import { getDecimalDigits } from './common';

// 乘方
export function square(num) {
    return num * num;
}
// 弧度转角度
export function radianToAngle(radian) {
    return 180 / Math.PI * radian;
}
// 角度转弧度
export function angleToRadian(angle) {
    return Math.PI / 180 * angle;
}
// 画椭圆形, TODO: 抽象此方法, 以360度绘制任何图形.
export function drawEllipse(options = {}) {
    const { sin, cos, sqrt } = Math;
    let { center = [], offset = [], radiusX = 500, radiusY = 100, interval = 1 } = Object.assign({}, options);
    let [cx = 0, cy = 0] = center;
    let [fx = 0, fy = 0] = offset;
    let a = radiusX;
    let b = radiusY;
    let points = [];
    let index = 0;
    let digits = getDecimalDigits(interval);

    for (let i = 0; i < 360; ) {
        let x, y; 
        let radian = angleToRadian(i);

        // 椭圆坐标分布计算公式
        // 短轴分布稀疏
        x = a * cos(radian);
        y = b * sin(radian);
        // 长轴分布稀疏
        // x = (a * b * cos(radian)) / sqrt(square(a * sin(radian)) + square(b * cos(radian)));
        // y = (a * b * sin(radian)) / sqrt(square(a * sin(radian)) + square(b * cos(radian)));
        // 星形分布
        // x = (a * b * cos(radian)) / sqrt(square(a * sin(radian)) + square(b * cos(radian)));
        // y = (a * b * sin(radian)) / sqrt(square(a * cos(radian)) + square(b * sin(radian)));
        // 正方形分布
        // x = (a * b * cos(radian)) / sqrt(square(a * cos(radian)) + square(b * sin(radian)));
        // y = (a * b * sin(radian)) / sqrt(square(a * sin(radian)) + square(b * cos(radian)));

        points.push({
            x: x + cx + fx,
            y: y + cy + fy,
            angle: i,
            index: index++
        });

        // 避免 IEEE 754 双精度问题
        i = +(i + interval).toFixed(digits);
    }

    // 返回椭圆上的所有坐标点数组
    return points;
}