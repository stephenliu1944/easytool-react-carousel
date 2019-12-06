import PropTypes from 'prop-types';
import React, { Component, Children } from 'react';
import { drawEllipse } from 'utils/geometry';

export default class Carousel extends Component {
    
    constructor(props) {
        super(props);
    }

    static defaultProps = {
        center: [document.documentElement.clientWidth / 2, document.documentElement.clientHeight / 2],  // 中心点
        radiusX: 500,               // x轴椭圆半径
        radiusY: 300,               // y轴椭圆半径
        interval: 1,                // 轨道上的每个坐标点占多少度, 为1时一圈生成360个点, 0.1时生成3600个点, 最少0.1
        offset: [0, 0],             // 每个元素的偏移量
        speed: 1,                   // 元素每次移动几格, 最少为1
        anticlockwise: false,       // 是否逆时针旋转
        pause: false,               // 是否暂停
        distribution: {             // 支持三种类型 object{startAngle, endAngle}, array[angle1, angle2], function(allPoints, elements);
            startAngle: 0, 
            endAngle: 360
        },         
        keyframe: {}                // 关键帧(角度), key为角度, value为样式属性, top 和 left 可以为方法, 方法接收1个参数, 为当前的top或left.
    }

    state = {
        ellipsePoints: [],          // 轨道坐标集合
        distributionPoints: [],
        elements: []                // 轨道上的元素集合, 每个 element 上可以有 offset 和 ignore 两个自定义属性
    };
    
    componentDidMount() {
        this.init();
        this.rotateElements();
    }

    componentDidUpdate(prevProps) {
        var { center: prevCenter, radiusX: prevRadiusX, radiusY: prevRadiusY } = prevProps;
        var { center, radiusX, radiusY } = this.props;

        if (center[0] !== prevCenter[0] 
            || center[1] !== prevCenter[1]
            || radiusX !== prevRadiusX 
            || radiusY !== prevRadiusY) {
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
            <div id={id} className={className} style={{ position: 'relative', ...style }}>
                { this.state.elements }
            </div>
        );
    }
    
    init() {
        var { center, radiusX, radiusY, interval, distribution, children = [] } = this.props;
        // 绘制椭圆轨道坐标
        this.state.ellipsePoints = drawEllipse({
            center,
            radiusX,
            radiusY,
            interval
        });     
        // 为子元素分配坐标
        this.state.distributionPoints = distributePoints(distribution, children, this.state.ellipsePoints);
    }

    rotateElements = () => {
        var { offset = [0, 0], anticlockwise, speed = 1, pause = false, keyframe = {}, children = [] } = this.props;
        var { elements = [], ellipsePoints = [], distributionPoints = [] } = this.state;

        if (!pause) {
            let distributionIndex = 0;
            // 注意: Children.map() 会给每个 key 递归增加层级符号.$.$.$key..., react issues 11464.
            // TODO: 更换此方法
            this.state.elements = Children.map(children, (child, index) => {
                // 注意: 这里第一次 elements 是空的, 是从 child 取值, 之后是从 elements[index] 中取值.
                let element = elements[index] || child;
                let { style: currStyle = {}, backstyle: backStyle, ignore, point, offset: childOffset = [0, 0] } = element.props;

                if (ignore === true || ignore === 'true') {
                    // 注意: 这里要返回原始节点对象
                    return child;
                }
                
                let nextPoint;
                // 注意: point 第一次是空的还未分配, 所以从 distributionPoints 里分配
                point = point || distributionPoints[distributionIndex++];

                if (anticlockwise) {
                    nextPoint = findPrevPoint(point, ellipsePoints, speed);
                } else {
                    nextPoint = findNextPoint(point, ellipsePoints, speed);
                }

                let x = nextPoint.x + offset[0] + childOffset[0];
                let y = nextPoint.y + offset[1] + childOffset[1];
                let nextStyle = this.getNextStyle(keyframe[nextPoint.angle], backStyle || currStyle, x, y);
                let copyElement = React.cloneElement(child, {
                    style: nextStyle,
                    point: nextPoint,
                    backstyle: this.getBackupStyle(keyframe[nextPoint.angle], backStyle || currStyle)    // 保留关键帧之前的样式 
                });    

                return copyElement;
            });

            this.setState(this.state);
        }

        this._animator = requestAnimationFrame(this.rotateElements);
    }

    getNextStyle(keyframeStyle, currStyle, x, y) {
        var nextStyle = {};
        // 检测是否在关键帧(角度)位置
        if (keyframeStyle) {
            Object.assign(nextStyle, keyframeStyle);
            // 让用户可以调整 top, left
            if (typeof nextStyle.top === 'function') {
                nextStyle.top = nextStyle.top(y);
            }
            if (typeof nextStyle.left === 'function') {
                nextStyle.left = nextStyle.left(x);
            }
        // 非关键帧情况线判断是否有上一次的样式备份, 如果有则还原样式, 没有则使用当前样式
        } else {
            Object.assign(nextStyle, currStyle, {
                left: x,
                top: y
            });
        }
        nextStyle.position = 'absolute';

        return nextStyle;
    }

    getBackupStyle(keyframeStyle, backStyle) {
        if (keyframeStyle) {
            // 保留上一针的样式 
            return backStyle;
        }
    }

    destroy() {
        cancelAnimationFrame(this._animator);
        delete this._animator;
        delete this.state.elements;
        delete this.state.ellipsePoints;
        delete this.state.distributionPoints;
    }
}

Carousel.propTypes = {
    center: PropTypes.array,
    radiusX: PropTypes.number,           
    radiusY: PropTypes.number,           
    offset: PropTypes.array,       
    interval: PropTypes.number,          
    speed: PropTypes.number,             
    anticlockwise: PropTypes.bool,       
    pause: PropTypes.bool
};

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

function distributePoints(distribution, elements = [], allPoints = []) {
    var points;

    if (typeof distribution === 'function') {       // 根据自定义方法分配
        points = distribution(allPoints);
    } else if (Array.isArray(distribution)) {       // 根据提供的坐标集合分配
        points = distributePointsByAngle(distribution, allPoints);
    } else if (typeof distribution === 'object') {  // 根据限定的角度范围分配
        let { startAngle, endAngle } = distribution;
        points = distributePointsByCount({
            points: allPoints,
            count: getElementsPointCount(elements),
            startAngle,
            endAngle
        });
    } else {
        throw 'please set distribution option';
    }

    return points;
}

function distributePointsByAngle(angles = [], points = []) {
    return points.filter((point) => {
        return angles.includes(point.angle);
    });
}
// 该分布算法需要抽象为参数方法, 接收 points
function distributePointsByCount(options) {
    let { points = [], count = 0, startAngle = 0, endAngle = 360 } = Object.assign({}, options);
    let filterPoints;

    if ( startAngle > 0 || endAngle < 360) {
        count -= 1;
        filterPoints = points.filter((point) => {
            return startAngle <= point.angle && point.angle <= endAngle;
        });
    } else {    
        filterPoints = points;
    }
    
    let avgAngle = (endAngle - startAngle) / count;
    
    let distPoints = filterPoints.filter((point) => {
        return point.angle % avgAngle === 0;
    });
    
    return distPoints;
}
// 找上一个节点
function findPrevPoint(point, points, speed = 1) {
    return points[point.index - speed] || points[points.length - 1];
}
// 找下一个节点
function findNextPoint(point, points, speed = 1) {
    return points[point.index + speed] || points[0];
}