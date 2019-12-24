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

const CENTER_HEIGHT_OFFSET = 40;
const RADIUS_X_PERCENT = 0.625;     // 600 / (document.documentElement.clientWidth / 2)
const RADIUS_Y_PERCENT =  0.451;    // 210 / (document.documentElement.clientHeight / 2)

export default class App extends Component {
    
    state = {
        DEV: true,
        radiusX: 600,               // x轴椭圆半径
        radiusY: 210,               // y轴椭圆半径
        interval: 1,                // 每个点的间距, 为1时一圈生成360个点, 0.1时生成3600个点, 最少0.1
        offset: [-96, -166],        // 每个元素的偏移量
        anticlockwise: true,       // 是否逆时针旋转
        speed: 1,
        pause: false,               // 是否暂停
        distribution: [18, 90, 162, 234, 306],  // 按指定角度位置分布元素
        keyframe: {                             // TODO: 关键帧, 如何保留上一针的位置
            // 90: {
            //     transform(x, y) {
            //         return 'scale(0.5)';
            //     }
            // },
            0: className => [className.replace('show-animation', ''), 'hide-animation'],
            180: className => [className.replace('hide-animation', ''), 'show-animation']
        }
    }

    componentDidMount() {
        window.addEventListener('resize', this.handleWindowResize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleWindowResize);
    }

    handleWindowResize = () => {
        var container = this.carouselRef.getContainer();
        var style = window.getComputedStyle(container);
        var x = style.width.slice(0, -2) / 2;
        var y = style.height.slice(0, -2) / 2;

        this.setState({
            center: [x, y]
        });
    }

    handleMouseEnter = (e) => {
        this.setState({ 
            pause: true
        });
    }

    handleMouseLeave = (e) => {
        this.setState({ 
            pause: false
        });
    }

    gotoAssessment = () => {
        this.props.router.push('/assess');
    }

    render() {
        return (
            <div className="app">
                <Carousel {...this.state} ref={(carousel) => this.carouselRef = carousel} className="carousel">
                    <img className="gundam" src={aPNG} width={200} height={200} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave} />
                    <img className="gundam" src={bPNG} width={200} height={200} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave} />
                    <img className="gundam" src={cPNG} width={200} height={200} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave} />
                    <img className="gundam" src={dPNG} width={200} height={200} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave} />
                    <img className="gundam" src={ePNG} width={200} height={200} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave} />
                    <div className="gundam center" ignore="true">
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