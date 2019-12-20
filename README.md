# @easytool/react-carousel
React 轨道轮播UI组件

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
        <Carousel>
            <img src={ xxx } width={200} height={200} />
            <img src={ xxx } width={200} height={200} />
            <img src={ xxx } width={200} height={200} />
            // offset设置该元素的偏移量
            <img src={ xxx } width={200} height={200} offset={[50, 50]} />
            // ignore忽略该元素
            <img src={ xxx } width={200} height={200} ignore="true" />
        </Carousel>
    );
}

render(
    <App />,
    document.getElementById('app')
);
```

### 多个 Carousel
```jsx
function App(props) {
    return (
        <Carousel radiusX="400" radiusY="300">
            <img src={ xxx } width={200} height={200} />
            <img src={ xxx } width={200} height={200} />
        </Carousel>
        <Carousel radiusX="300" radiusY="200">
            <img src={ xxx } width={200} height={200} />
            <img src={ xxx } width={200} height={200} />
        </Carousel>>
    );
}
```

### 绑定事件
```jsx
export default class App extends Component {

    state = {
        pause: false
    }

    handleClick = (e) => {
        console.log(e.target);
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

    render() {
        return (
            <Carousel {...this.state} >
                <img src={ aPNG } width={200} height={200} onClick={this.handleClick} />
                <img src={ bPNG } width={200} height={200} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave} />
            </Carousel>
        );
    }
}
```
  
### 窗口自适应
```jsx
const CENTER_HEIGHT_OFFSET = 40;
const RADIUS_X_PERCENT = 0.625;     // 600(x轴半径) / (document.documentElement.clientWidth / 2)
const RADIUS_Y_PERCENT =  0.451;    // 210(y轴半径) / (document.documentElement.clientHeight / 2)
export default class App extends Component {

    state = {
        center: [document.documentElement.clientWidth / 2, document.documentElement.clientHeight / 2 + CENTER_HEIGHT_OFFSET],
        radiusX: document.documentElement.clientWidth / 2 * RADIUS_X_PERCENT,              // x轴椭圆半径
        radiusY: document.documentElement.clientHeight / 2 * RADIUS_Y_PERCENT              // y轴椭圆半径
    }

    componentDidMount() {
        window.addEventListener('resize', this.handleWindowResize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleWindowResize);
    }

    handleWindowResize = () => {
        this.setState({
            center: [document.documentElement.clientWidth / 2, document.documentElement.clientHeight / 2 + CENTER_HEIGHT_OFFSET],
            radiusX: document.documentElement.clientWidth / 2 * RADIUS_X_PERCENT,              // x轴椭圆半径
            radiusY: document.documentElement.clientHeight / 2 * RADIUS_Y_PERCENT              // y轴椭圆半径
        });
    }

    render() {
        return (
            <Carousel {...this.state} >
                <img src={ aPNG } width={200} height={200} onClick={this.handleClick} />
                <img src={ bPNG } width={200} height={200} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave} />
            </Carousel>
        );
    }
}
```

### 配置属性
```jsx
const CENTER_HEIGHT_OFFSET = 40;
const RADIUS_X_PERCENT = 0.625;
const RADIUS_Y_PERCENT =  0.451;
export default class App extends Component {

    state = {
        center: [document.documentElement.clientWidth / 2, document.documentElement.clientHeight / 2 + CENTER_HEIGHT_OFFSET],
        radiusX: document.documentElement.clientWidth / 2 * RADIUS_X_PERCENT,                // x轴椭圆半径
        radiusY: document.documentElement.clientHeight / 2 * RADIUS_Y_PERCENT,               // y轴椭圆半径
        interval: 1,                // 每个点的间距, 为1时一圈生成360个点, 0.1时生成3600个点, 最少0.1
        offset: [-96, -166],        // 每个元素的偏移量
        anticlockwise: true,        // 是否逆时针旋转
        speed: 1,                   // 元素运动速度
        pause: false,               // 是否暂停
        keyframe: {                 // 关键位置样式
            45: {
                width: 300,
                height: 500
            },
            90: {
                left: (x, y) => x + 10,
                top: (x, y) => y + 10
            },
            180: 'hide',
            270: className => ['animation']
        }
    }

    render() {
        return (
            <Carousel {...this.state} >
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
    DEV: boolean, 开发模式, 会有红色参考线, 默认为false.
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
    keyframe: object, 全局关键帧(位置)样式, key 为数字表示角度, value 有4种使用方式:
        {
            0: 'className',             // 关键帧为 string 时, 将替换元素 className
            90: className => className  // 关键帧为 function 时, 接收当前元素的 className, 返回值将作为元素新的 className, 多个className可以用数组表示.
            180: {                      // 关键帧覆盖的样式
                width: 100,
                height: 100
            },
            270: {                      // 样式为方法时可以接收元素当前的x和y坐标.
                left: (x, y) => x + 10,
                top: (x, y) => y + 10
            }
        }
>
    <child
        offset: array, 轨道上元素自身的偏移量, 默认为[0, 0]. 会叠加到全局offset上.
        ignore: string, 是否忽略该元素, 忽略后不会在轨道上移动, 如: "true".
        keyframe: object, 元素关键帧(角度)样式, 会覆盖全局关键帧样式.
    />
</Carousel>
```

## License
MIT
