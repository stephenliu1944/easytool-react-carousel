import PropTypes from 'prop-types';
import React, { Component, Children } from 'react';
import { requestAnimationFrame, cancelAnimationFrame } from 'utils/animation';
import { drawReferenceLines } from 'utils/dom';
import { drawEllipse } from 'utils/geometry';
import { isEmpty, getDecimalDigits } from 'utils/common';

const IntervalType = {
    SMALL: 0.1,
    MEDIUM: 1,
    LARGE: 10
};
const requestAnimation = requestAnimationFrame();
const cancelAnimation = cancelAnimationFrame();
export default class Carousel extends Component {
    
    constructor(props) {
        super(props);
    }

    static defaultProps = {
        DEV: false,                     // 调试模式
        interval: 1,                    // 轨道上每个坐标点的间距, medium 间距为1, 一圈生成360个点, small 间距为0.1, 一圈生成3600个点, large 间距为10, 一圈生成36个点.
        offset: [0, 0],                 // 每个元素的偏移量
        speed: 1,                       // 元素每次移动几格, 最少为1
        anticlockwise: false,           // 是否逆时针旋转
        pause: false,                   // 是否暂停
        distribution: {                 // 支持三种类型 object{startAngle, endAngle}, array[angle1, angle2], function(allPoints, elements);
            startAngle: 0, 
            endAngle: 360
        },         
        keyframe: {}                    // 关键帧(角度), key为角度, value为样式属性, top 和 left 可以为方法, 方法接收1个参数, 为当前的top或left.
    }

    state = {
        elements: [],                   // 轨道上的元素集合, 每个 element 上可以有 offset 和 ignore 两个自定义属性
        allPoints: [],                  // 轨道坐标集合
        distributionPoints: []
    };
    
    componentDidMount() {
        this.init();
        this.rotateElements();
    }

    componentDidUpdate(prevProps) {
        var { center: prevCenter = [], radiusX: prevRadiusX, radiusY: prevRadiusY, interval: prevInterval } = prevProps;
        var { center = [], radiusX, radiusY, interval } = this.props;

        if (center[0] !== prevCenter[0] 
            || center[1] !== prevCenter[1]
            || radiusX !== prevRadiusX 
            || radiusY !== prevRadiusY
            || interval !== prevInterval) {
            this.destroy();
            this.init();
            this.rotateElements();
        }
    }

    componentWillUnmount() {
        this.destroy();
    }

    render() {
        let { id, className, style = {} } = this.props;

        return (
            <div ref={this.setContainer} id={id} className={className} style={{ position: 'relative', ...style }}>
                { this.state.elements }
            </div>
        );
    }
    
    setContainer = (div) => {
        this.container = div;
    }

    getContainer = () => {
        return this.container;
    }

    init() {
        // 默认 center 为容器的中心点
        var style = window.getComputedStyle(this.container);
        var x = style.width.slice(0, -2) / 2;
        var y = style.height.slice(0, -2) / 2;
        var { center = [x, y], radiusX = x, radiusY = y, interval, distribution, children = [], DEV } = this.props;
        var intervalNum = parseInterval(interval);
        // 绘制椭圆轨道坐标
        // TODO: 该方法可以抽象, 返回对象集合: [{x, y, key(当前所在角度), index}, ...]
        this.state.allPoints = drawEllipse({
            center,
            radiusX,
            radiusY,
            interval: intervalNum
        });     

        if (children.length > this.state.allPoints.length) {
            throw `Child elements exceeds the maximum value (${this.state.allPoints.length}), please increase the interval props or decrease child element count.`;
        }
        // 为子元素分配坐标
        this.state.distributionPoints = distributePoints(distribution, intervalNum, children, this.state.allPoints);
        
        if (DEV) {
            drawReferenceLines(this.container, this.state.allPoints);
        }
    }

    rotateElements = () => {
        var { offset = [0, 0], anticlockwise, speed = 1, pause = false, keyframe = {}, children = [] } = this.props;
        var { elements = [], allPoints = [], distributionPoints = [] } = this.state;

        if (isEmpty(elements) || !pause) {
            let distributionIndex = 0;
            // 注意: Children.map() 会给每个 key 递归增加层级符号.$.$.$key..., react issues 11464.            
            let newElements = Children.map(children, (child, index) => {
                // 注意: 这里第一次 elements 是空的, 是从 child 取值, 之后是从 elements[index] 中取值.
                let element = elements[index] || child;
                let { className, style: currStyle = {}, backstyle: backStyle, keyframe: elKeyframe = [], ignore, point, offset: childOffset = [0, 0] } = element.props;

                if (ignore === true || ignore === 'true') {
                    // 注意: 这里要返回原始节点对象
                    return child;
                }
                
                let nextPoint;
                // 注意: point 第一次是空的还未分配, 所以从 distributionPoints 里分配
                point = point || distributionPoints[distributionIndex++];

                if (anticlockwise) {
                    nextPoint = findPrevPoint(point, allPoints, speed);
                } else {
                    nextPoint = findNextPoint(point, allPoints, speed);
                }

                let x = nextPoint.x + offset[0] + childOffset[0];
                let y = nextPoint.y + offset[1] + childOffset[1];
                let keyframeOpt = elKeyframe[nextPoint.angle] || keyframe[nextPoint.angle];
                let copyElement = React.cloneElement(child, {
                    className: this.getNextClassName(className, keyframeOpt),
                    style: this.getNextStyle(currStyle, keyframeOpt, x, y),
                    point: this.getNextPoint(nextPoint, keyframeOpt)
                    // backstyle: this.getBackupStyle(backStyle || currStyle, keyframe[nextPoint.angle])    // 保留关键帧之前的样式 
                });    

                return copyElement;
            });

            this.setState({
                elements: newElements
            });
        }

        this._animationFrame = requestAnimation(this.rotateElements);
        // this._animationFrame = setTimeout(this.rotateElements, 1000 / 60); 16.6666667;
    }
    // 计算下一帧的class
    getNextClassName(currClassName = '', keyframeClassName) {
        var nextClassName = typeof keyframeClassName === 'function' || typeof keyframeClassName === 'string' 
            ? keyframeClassName : currClassName;
        
        if (typeof nextClassName === 'function') {
            nextClassName = nextClassName(currClassName) || '';
            if (Array.isArray(nextClassName)) {
                return nextClassName.filter(cn => cn).map(cn => cn.trim()).join(' ');
            }
        }

        if (typeof nextClassName !== 'string') {
            throw 'keyframe function must return a string value.';
        }

        return nextClassName.trim();
    }
    // 计算下一帧的样式
    getNextStyle(currStyle = {}, keyframeStyle, x, y) {
        var nextStyle = {
            ...currStyle, 
            left: x,
            top: y,
            position: 'absolute'
        };
        // 优先使用关键帧样式
        if (typeof keyframeStyle === 'object' && keyframeStyle !== null) {
            for (let key in keyframeStyle) {
                let style = keyframeStyle[key];
                if (typeof style === 'function') {
                    // TODO: 此处返回值需要校验
                    nextStyle[key] = style(x, y);
                } else {
                    nextStyle[key] = style;
                }
            }                    
        } 

        return nextStyle;
    }

    getNextPoint(point, keyframePoint) {
        // TODO: 元素跳跃功能, keyframe.value为数字时
        return point;
    }

    getBackupStyle(backStyle, keyframeStyle) {
        if (keyframeStyle) {
            // 保留上一针的样式 
            return backStyle;
        }
    }

    destroy() {
        cancelAnimation(this._animationFrame);
        delete this._animationFrame;
        delete this.state.elements;
        delete this.state.allPoints;
        delete this.state.distributionPoints;
    }
}

Carousel.propTypes = {
    DEV: PropTypes.bool,
    center: PropTypes.array,
    radiusX: PropTypes.number,           
    radiusY: PropTypes.number,           
    offset: PropTypes.array,       
    interval: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    speed: PropTypes.number,             
    anticlockwise: PropTypes.bool,       
    pause: PropTypes.bool
};

function parseInterval(interval) {
    if (typeof interval === 'string') {
        return IntervalType[interval.toUpperCase()] || IntervalType.MEDIUM;
    } else if (typeof interval === 'number') {
        // if (interval > 10) {
        //     return IntervalType.LARGE;
        // } else if (interval < 0.1) {
        //     return IntervalType.SMALL;
        // }

        return interval;
    }

    return IntervalType.MEDIUM;
}

function getElementsPointCount(elements) {
    var count = 0;
    Children.forEach(elements, (el) => {
        let ignore = el.props.ignore;  
        if (!ignore || ignore !== 'true') {
            count++;
        } 
    });

    return count;
}

function distributePoints(distribution, interval, elements = [], allPoints = []) {
    var points;

    if (typeof distribution === 'function') {       // 根据自定义方法分配
        points = distribution(allPoints, interval);
    } else if (Array.isArray(distribution)) {       // 根据提供的坐标集合分配
        points = distributePointsByAngle(distribution, allPoints);
    } else if (typeof distribution === 'object') {  // 根据限定的角度范围分配
        let { startAngle, endAngle } = distribution;
        points = distributePointsByCount({
            points: allPoints,
            count: getElementsPointCount(elements),
            interval,
            startAngle,
            endAngle
        });
    } else {
        throw 'please set distribution option';
    }

    return points;
}

function distributePointsByAngle(angles = [], points = []) {
    return points.filter(point => angles.includes(point.angle));
}

function distributePointsByCount(options) {
    let { points: allPoints = [], count = 0, interval, startAngle = 0, endAngle = 360 } = Object.assign({}, options);
    let digits = getDecimalDigits(interval);    
    let fixed = digits * 10 || 1;               // fixed 为了提高 avgAngle 值精度, interval 小于1时可使均分更精确
    let avgAngle = Math.floor((endAngle - startAngle) / count * fixed) / fixed;
    let points = [];
    let start = startAngle;

    for (let i = 0; i < count; i++) {
        points.push(+(start + i * avgAngle).toFixed(digits));   // 解决 IEEE 754 64位双精度浮点数编码问题
    }

    let distPoints = allPoints.filter((point) => {
        return points.includes(point.angle);
    });

    return distPoints;
}
// 找上一个节点
function findPrevPoint(point, points, speed = 0) {
    return points[point.index - speed] || points[points.length - 1];
}
// 找下一个节点
function findNextPoint(point, points, speed = 0) {
    return points[point.index + speed] || points[0];
}