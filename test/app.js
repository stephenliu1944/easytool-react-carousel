/** 
 * 该类用于开发调试, 打包时会忽略此文件.
 */
import './app.css';
import Carousel from '../src/index';
import aPNG from './images/a.png';
import bPNG from './images/b.png';
import cPNG from './images/c.png';
import dPNG from './images/d.png';
import ePNG from './images/e.png';
import fPNG from './images/f.png';
import React, { Component } from 'react';
import { render } from 'react-dom';

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
                90: {
                    transform(x, y) {
                        return 'translate(10px, 10px)';
                    }
                },
                180: c => {
                    return c + ' animation';
                }, 
                0: c => {
                    return c.replace('animation', '');
                }
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
                    <img className="1" src={aPNG} width={200} height={200} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave} />
                    <img className="2" src={bPNG} width={200} height={200} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave} />
                    <img className="3" src={cPNG} width={200} height={200} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave} />
                    <img src={dPNG} width={200} height={200} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave} />
                    <img src={ePNG} width={200} height={200} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave} />
                    <div>
                        <img src={fPNG} width={200} height={200} onClick={this.gotoAssessment} />
                    </div>
                </Carousel>
            </div>
        );
    }
}

render(
    <App />,
    document.getElementById('app')
);