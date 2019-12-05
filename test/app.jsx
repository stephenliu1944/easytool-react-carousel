/** 
 * 该类用于开发调试, 打包时会忽略此文件.
 */
import Carousel from '../src/index';
import styles from './home.scss';
import titlePNG from 'images/title.png';
import assessmentPNG from 'images/assessment.png';
import centerBoxPNG from 'images/centerBox.png';
import React, { Component } from 'react';

const KeyframeStyle = {
    width: 300,
    height: 500,
    top(y) { return y - 100;},
    left(x) { return x - 50;}
};
const Profile = {
    'person': '通过关联自然人对外投资任职企业分析计算风险',
    'composite': '通过分析1、2度关联方综合实力识别风险',
    'compliance': '通过判断是否符合行业准入规范严把门槛',
    'opinion': '通过分析1、2度法人存在的负面舆情预警风险',
    'legal': '通过关联法人金融风险和信用分析防范风险'
};
const CENTER_HEIGHT_OFFSET = 40;
const RADIUS_X_PERCENT = 0.625;     // 600 / (document.documentElement.clientWidth / 2)
const RADIUS_Y_PERCENT =  0.451;    // 210 / (document.documentElement.clientHeight / 2)

export default class App extends Component {
    
    state = {
        span: <span key="s" className={styles.profile} onClick={() => {this.test();}}>{'bbbbbbbbbbbb'}</span>,
        profile: null,
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
                80: KeyframeStyle,                     
                81: KeyframeStyle,                     
                82: KeyframeStyle,                     
                83: KeyframeStyle,                     
                84: KeyframeStyle,                     
                85: KeyframeStyle,                     
                86: KeyframeStyle,                     
                87: KeyframeStyle,                     
                88: KeyframeStyle,                     
                89: KeyframeStyle,                     
                90: KeyframeStyle,
                91: KeyframeStyle,                                          
                92: KeyframeStyle,
                93: KeyframeStyle,
                94: KeyframeStyle,
                95: KeyframeStyle,
                96: KeyframeStyle,
                97: KeyframeStyle,
                98: KeyframeStyle,
                99: KeyframeStyle,
                100: KeyframeStyle,
                101: KeyframeStyle,
                102: KeyframeStyle,
                103: KeyframeStyle,
                104: KeyframeStyle,
                105: KeyframeStyle,
                106: KeyframeStyle,
                107: KeyframeStyle,
                108: KeyframeStyle,
                109: KeyframeStyle,
                110: KeyframeStyle
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

    handleMouseEnter = (key, e) => {
        this.setState({ 
            profile: Profile[key],
            carousel: {
                ...this.state.carousel,
                pause: true
            }
        });
    }

    handleMouseLeave = (e) => {
        this.setState({ 
            profile: null,
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
            <div className={styles.home}>
                <Carousel {...this.state.carousel} >
                    <div key="person" className={styles.person} onMouseEnter={(e) => this.handleMouseEnter('person', e)} onMouseLeave={this.handleMouseLeave} ></div>
                    <div key="composite" className={styles.composite} onMouseEnter={(e) => this.handleMouseEnter('composite', e)} onMouseLeave={this.handleMouseLeave} ></div>
                    <div key="compliance" className={styles.compliance} onMouseEnter={(e) => this.handleMouseEnter('compliance', e)} onMouseLeave={this.handleMouseLeave} ></div>
                    <div key="opinion" className={styles.opinion} onMouseEnter={(e) => this.handleMouseEnter('opinion', e)} onMouseLeave={this.handleMouseLeave} ></div>
                    <div key="legal" className={styles.legal} onMouseEnter={(e) => this.handleMouseEnter('legal', e)} onMouseLeave={this.handleMouseLeave} ></div>
                    <img key="title" className={styles.title} src={titlePNG} ignore="true" />
                    <div key="center" className={styles.center} onClick={this.gotoAssessment} ignore="true">
                        <img className={styles.assessment} src={assessmentPNG} />
                        <img className={styles.centerBox} src={centerBoxPNG} />
                    </div>
                </Carousel>
            </div>
        );
    }
}