# @easytool/react-carousel
React 轨道轮播UI组件

## Dependencies
```
react:    v16.x.x
prop-types: v15.x.x
```
## Install
```
npm i @easytool/react-carousel
```

## Usage
```jsx
import React, { Component } from 'react';
import { render } from 'react-dom';
import Carousel from '@easytool/react-carousel';

function App(props) {
    return (
        <Carousel {...this.state.carousel} >
            <img src={ xxx } width={200} height={200} />
            <div>
                <img src={ xxx } width={200} height={200} />
            </div>
            // offset设置该元素的偏移量
            <img src={ xxx } width={200} height={200} offset={[50, 50]} />
            // ignore忽略该元素
            <img src={ xxx } width={200} height={200} ignore="true" />
        </Carousel>
        // 支持多个 Carousel 同时使用
        <Carousel>
            ...
        </Carousel>>
    );
}

render(
    <App />,
    document.getElementById('app')
);
```

### 绑定事件
```jsx
export default class App extends Component {

    handleClick = () => {
        ...
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

    render() {
        return (
            <Carousel {...this.state.carousel} >
                <img src={ aPNG } width={200} height={200} onClick={this.handleClick} />
                <img src={ bPNG } width={200} height={200} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave} />
            </Carousel>
        );
    }
}
```
  
窗口缩放自适应
```jsx
const CENTER_HEIGHT_OFFSET = 40;
const RADIUS_X_PERCENT = 0.625;     // 600(x轴半径) / (document.documentElement.clientWidth / 2)
const RADIUS_Y_PERCENT =  0.451;    // 210(y轴半径) / (document.documentElement.clientHeight / 2)
export default class App extends Component {

    state = {
        carousel: {
            center: [document.documentElement.clientWidth / 2, document.documentElement.clientHeight / 2 + CENTER_HEIGHT_OFFSET],
            radiusX: document.documentElement.clientWidth / 2 * RADIUS_X_PERCENT,              // x轴椭圆半径
            radiusY: document.documentElement.clientHeight / 2 * RADIUS_Y_PERCENT              // y轴椭圆半径
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

    render() {
        return (
            <Carousel {...this.state.carousel} >
                <img src={ aPNG } width={200} height={200} onClick={this.handleClick} />
                <img src={ bPNG } width={200} height={200} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave} />
            </Carousel>
        );
    }
}
```

### 配置属性
```jsx
const KeyframeStyle = {
    width: 300,
    height: 500,
    top(y) { return y - 100;},
    left(x) { return x - 50;}
};
const CENTER_HEIGHT_OFFSET = 40;
const RADIUS_X_PERCENT = 0.625;
const RADIUS_Y_PERCENT =  0.451;
export default class App extends Component {

    state = {
        carousel: {
            center: [document.documentElement.clientWidth / 2, document.documentElement.clientHeight / 2 + CENTER_HEIGHT_OFFSET],
            radiusX: document.documentElement.clientWidth / 2 * RADIUS_X_PERCENT,                // x轴椭圆半径
            radiusY: document.documentElement.clientHeight / 2 * RADIUS_Y_PERCENT,               // y轴椭圆半径
            interval: 1,                // 每个点的间距, 为1时一圈生成360个点, 0.1时生成3600个点, 最少0.1
            offset: [-96, -166],        // 每个元素的偏移量
            anticlockwise: true,        // 是否逆时针旋转
            speed: 1,                   // 元素运动速度
            pause: false,               // 是否暂停
            keyframe: {                 // 关键角度样式
                70: KeyframeStyle,                     
                71: KeyframeStyle,                     
                72: KeyframeStyle,                     
                73: KeyframeStyle,                     
                74: KeyframeStyle,                     
                75: KeyframeStyle,                     
                76: KeyframeStyle,                     
                77: KeyframeStyle,                     
                78: KeyframeStyle,                     
                79: KeyframeStyle,                     
                80: KeyframeStyles
            }
        }
    }

    render() {
        return (
            <Carousel {...this.state.carousel} >
                <img src={ xxx } width={200} height={200} />
                <img src={ xxx } width={200} height={200} />
                <img src={ xxx } width={200} height={200} />
                <img src={ xxx } width={200} height={200} />
            </Carousel>
        );
    }
}
```

## API
```
<Carousel 
    center: array, 椭圆的中心点, 默认为屏幕中心.
    radiusX: number, 椭圆的 x 轴半径, x 和 y 相等时为正圆, 默认为500.
    radiusY: number, 椭圆的 y 轴半径, x 和 y 相等时为正圆, 默认为300.
    interval: number, 椭圆中每个相邻坐标点的间距, 默认为1, 目前最小为0.1, 值越小生成的圆点坐标越多, 为1生成360个点, 为0.1生成3600个点.
    offset: array, 椭圆轨道上每个元素的全局偏移量, 还可在元素自身属性上设置偏移量, 默认为[0, 0].
    anticlockwise: boolean, 是否逆时针旋转, 默认false.
    speed: number, 每个元素的移动速度, 最小值依赖 interval 的值. 默认为 1.
    pause: boolean, 是否暂停, 默认false.
    distribution: object{startAngle, endAngle}|array[angle1, angle2, ...]|function(points), 每个元素在圆上的初始分布. 默认为: {startAngle: 0, endAngle: 360},
        为 object 时表示在指定角度均匀分布, 如: {startAngle: 0, endAngle: 180};
        为 array 时表示手动分布, 如: [0, 90, 180, 270], 数组元素个数需与轨道上的元素个数对应;
        为 function 表示自定义分布, 方法接收圆上所有坐标的数组, 返回筛选出的节点数组作为分布点.
    keyframe: object, 关键帧(角度)样式, object.key 为数字表示角度, object.value 为使用的样式, left, top 属性可以为方法, 接收当前定位的x和y坐标.
        如: {
                180: {
                    width: 100,
                    height: 100,
                    left(x) => x,
                    top(y) => y
                }
            }
>
    <child
        offset: array, 轨道上元素自身的偏移量, 默认为[0, 0]. 会叠加到全局offset上.
        ignore: string, 是否忽略该元素, 忽略后不会在轨道上移动, 如: "true".
    />
</Carousel>
```

## License
MIT
