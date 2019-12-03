import styles from './carousel.scss';
import PropTypes from 'prop-types';
import React, { Component, Children } from 'react';

export default class Carousel extends Component {
    
    constructor(props) {
        super(props);
    }

    static defaultProps = {
        center: [document.documentElement.clientWidth / 2, document.documentElement.clientHeight / 2],  // 中心点
        radiusX: 500,               // x轴椭圆半径
        radiusY: 200,               // y轴椭圆半径
        interval: 1,                // 轨道上的每个坐标点占多少度, 为1时一圈生成360个点, 0.1时生成3600个点, 最少0.1
        offset: [0, 0],             // 每个元素的偏移量
        speed: 1,                   // 元素每次移动几格, 最少为1
        anticlockwise: false,       // 是否逆时针旋转
        pause: false,               // 是否暂停
        distribution: {             // 支持三种类型 object{startAngle, endAngle}, array[angle1, angle2], function(allPoints, elements);
            startAngle: 0, 
            endAngle: 360
        },         
        keyframe: {                 // TODO: 关键帧
            90: {
                width: 100,
                height: 100
            }                       // 回调
        }
    }

    state = {
        points: [],                 // 轨道坐标集合
        elements: []                // 轨道上的元素集合, 每个 element 上可以有 offset 和 ignore 两个自定义属性
    };

    init() {
        var elements = this.props.children || [];
        var { center, radiusX, radiusY, interval, distribution } = this.props;
        var allPoints = drawEllipse({
            center,
            radiusX,
            radiusY,
            interval
        });

        var points;
        if (typeof distribution === 'function') {
            points = distribution(allPoints, elements);
        } else if (Array.isArray(distribution)) {
            points = distributePointsByAngle(allPoints, distribution);
        } else if (typeof distribution === 'object') {
            let { startAngle, endAngle } = distribution;
            points = distributePointsByCount({
                points: allPoints,
                count: elements.length,
                startAngle,
                endAngle
            });
        } else {
            throw 'please set distribution option';
        }
        
        this.state.points = allPoints;        
        this.state.elements = bindElementsPoint(elements, points);
    }

    rotateElements = () => {
        var { offset = [0, 0], anticlockwise, speed = 1, pause = false, keyframe = {} } = this.props;
        var { elements = [], points = [] } = this.state;

        if (!pause) {
            this.state.elements = Children.map(elements, (el) => {
                let { style = {}, point, offset: elOffset = [0, 0] } = el.props;

                if (!point) {
                    return el;
                }

                let nextPoint;
                let nextStyle = {};
                
                if (anticlockwise) {
                    nextPoint = findPrevPoint(point, points, speed);
                } else {
                    nextPoint = findNextPoint(point, points, speed);
                }

                // TODO: 保留上一针的位置, 调整top, left
                // if (keyframe[nextPoint.angle]) {
                //     nextStyle = keyframe[nextPoint.angle];
                // }

                Object.assign(nextStyle, {
                    position: 'absolute',
                    left: nextPoint.x + offset[0] + elOffset[0],
                    top: nextPoint.y + offset[1] + elOffset[1]
                }); 

                return React.cloneElement(el, {
                    point: nextPoint,
                    style: Object.assign({}, style, nextStyle)
                });    
            });

            this.setState(this.state);    
        }

        this._animator = requestAnimationFrame(this.rotateElements);
    }

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

    destroy() {
        cancelAnimationFrame(this._animator);
        this._animator = null;
        this.state.points = null;
        this.state.elements = null;
    }

    render() {
        return (
            <div className={styles.carousel}>
                { this.state.elements }
            </div>
        );
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
    // todo: FILTER        
};