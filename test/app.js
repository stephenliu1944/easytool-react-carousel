/** 
 * 该类用于开发调试, 打包时会忽略此文件.
 */
import './app.css';
import Carousel from '../src/index';
import galaxyJPG from './images/galaxy.jpg';
import aJPG from './images/a.jpg';
import bJPG from './images/b.jpg';
import cJPG from './images/c.jpg';
import dJPG from './images/d.jpg';
import eJPG from './images/e.jpg';
import fJPG from './images/f.jpg';
import React, { Component } from 'react';
import { render } from 'react-dom';

console.log(aJPG);
const KeyframeStyle = {
    width: 300,
    height: 500,
    top(y) { return y - 100;},
    left(x) { return x - 50;}
};
const CENTER_HEIGHT_OFFSET = 40;
const RADIUS_X_PERCENT = 0.625;     // 600 / (document.documentElement.clientWidth / 2)
const RADIUS_Y_PERCENT =  0.451;    // 210 / (document.documentElement.clientHeight / 2)

export default class App extends Component {
    
    state = {
        carousel: {
            center: [document.documentElement.clientWidth / 2, document.documentElement.clientHeight / 2 + CENTER_HEIGHT_OFFSET],
            radiusX: document.documentElement.clientWidth / 2 * RADIUS_X_PERCENT,                // x轴椭圆半径
            radiusY: document.documentElement.clientHeight / 2 * RADIUS_Y_PERCENT,               // y轴椭圆半径
            interval: 1,                // 每个点的间距, 为1时一圈生成360个点, 0.1时生成3600个点, 最少0.1
            offset: [-96, -166],        // 每个元素的偏移量
            anticlockwise: false,       // 是否逆时针旋转
            speed: 1,
            pause: false,               // 是否暂停
            // distribution: [90, 162, 234, 306, 18],               // 手动分配元素所在位置(角度)
            keyframe: {                 // TODO: 关键帧, 如何保留上一针的位置
                // 70: KeyframeStyle,                     
                // 71: KeyframeStyle,                     
                // 72: KeyframeStyle,                     
                // 73: KeyframeStyle,                     
                // 74: KeyframeStyle,                     
                // 75: KeyframeStyle,                     
                // 76: KeyframeStyle,                     
                // 77: KeyframeStyle,                     
                // 78: KeyframeStyle,                     
                // 79: KeyframeStyle,                     
                // 80: KeyframeStyle,                     
                // 81: KeyframeStyle,                     
                // 82: KeyframeStyle,                     
                // 83: KeyframeStyle,                     
                // 84: KeyframeStyle,                     
                // 85: KeyframeStyle,                     
                // 86: KeyframeStyle,                     
                // 87: KeyframeStyle,                     
                // 88: KeyframeStyle,                     
                // 89: KeyframeStyle,                     
                // 90: KeyframeStyle,
                // 91: KeyframeStyle,                                          
                // 92: KeyframeStyle,
                // 93: KeyframeStyle,
                // 94: KeyframeStyle,
                // 95: KeyframeStyle,
                // 96: KeyframeStyle,
                // 97: KeyframeStyle,
                // 98: KeyframeStyle,
                // 99: KeyframeStyle,
                // 100: KeyframeStyle,
                // 101: KeyframeStyle,
                // 102: KeyframeStyle,
                // 103: KeyframeStyle,
                // 104: KeyframeStyle,
                // 105: KeyframeStyle,
                // 106: KeyframeStyle,
                // 107: KeyframeStyle,
                // 108: KeyframeStyle,
                // 109: KeyframeStyle,
                // 110: KeyframeStyle
            }
        }
    }

    componentDidMount() {
        window.addEventListener('resize', this.handleWindowResize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleWindowResize);
    }

    handleWindowResize = () => {
        this.setState({
            carousel: {
                ...this.state.carousel,
                center: [document.documentElement.clientWidth / 2, document.documentElement.clientHeight / 2 + CENTER_HEIGHT_OFFSET],
                radiusX: document.documentElement.clientWidth / 2 * RADIUS_X_PERCENT,              // x轴椭圆半径
                radiusY: document.documentElement.clientHeight / 2 * RADIUS_Y_PERCENT              // y轴椭圆半径
            }
        });
    }

    handleMouseEnter = (e) => {
        this.setState({ 
            carousel: {
                ...this.state.carousel,
                pause: true
            }
        });
    }

    handleMouseLeave = (e) => {
        this.setState({ 
            carousel: {
                ...this.state.carousel,
                pause: false
            }
        });
    }

    gotoAssessment = () => {
        this.props.router.push('/assess');
    }

    render() {
        return (
            <div className="app">
                <Carousel {...this.state.carousel} >
                    <img src={ aJPG } width={200} height={200} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave} />
                    <img src={bJPG} width={200} height={200} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave} />
                    <img src={cJPG} width={200} height={200} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave} />
                    <img src={dJPG} width={200} height={200} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave} />
                    <img src={ eJPG } width={200} height={200} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave} />
                    <img src={fJPG } width={200} height={200} onClick={this.gotoAssessment} />
                </Carousel>
                <Carousel {...this.state.carousel} radiusX={document.documentElement.clientHeight / 2 * RADIUS_Y_PERCENT} radiusY={document.documentElement.clientWidth / 2 * RADIUS_X_PERCENT}>
                    <img src={ aJPG } width={200} height={200} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave} />
                    <img src={bJPG} width={200} height={200} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave} />
                    <img src={cJPG} width={200} height={200} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave} />
                    <img src={dJPG} width={200} height={200} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave} />
                    <img src={ eJPG } width={200} height={200} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave} />
                    <img src={fJPG } width={200} height={200} onClick={this.gotoAssessment} />
                </Carousel>
            </div>
        );
    }
}

render(
    <App />,
    document.getElementById('app')
);