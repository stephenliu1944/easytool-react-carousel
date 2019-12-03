export function bindElementsPoint(elements = [], points = []) {
    var index = 0;

    return Children.map(elements, (el) => {
        let ignore = el.props.ignore;  
        
        if (ignore === true || ignore === 'true') {
            return el;
        }

        return React.cloneElement(el, {
            point: points[index++]
        });    
    });
}
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
// 画椭圆形
export function drawEllipse(options = {}) {
    const { sin, cos, sqrt } = Math;
    const precision = 10000;
    let { center = [], offset = [], radiusX = 500, radiusY = 100, interval = 1 } = Object.assign({}, options);
    let [cx = 0, cy = 0] = center;
    let [fx = 0, fy = 0] = offset;
    let a = radiusX;
    let b = radiusY;
    let points = [];
    let index = 0;

    for (let i = 0; i < 360; ) {
        let x, y; 
        let radian = angleToRadian(i);

        // 椭圆坐标计算公式
        x = (a * b * cos(radian)) / sqrt(square(a * sin(radian)) + square(b * cos(radian)));
        y = (a * b * sin(radian)) / sqrt(square(a * sin(radian)) + square(b * cos(radian)));

        points.push({
            x: x + cx + fx,
            y: y + cy + fy,
            angle: i,
            index: index++
        });
        // 避免 0.1 + 0.2 的问题, TODO: 优化
        i = (i * precision + interval * precision) / precision;
    }

    // 返回椭圆上的所有坐标点数组
    return points;
}

export function distributePointsByAngle(points = [], angles = []) {
    return points.filter((point) => {
        return angles.includes(point.angle);
    });
}

// 该分布算法需要抽象为参数方法, 接收 points
export function distributePointsByCount(options) {
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
export function findPrevPoint(point, points, speed = 1) {
    return points[point.index - speed] || points[points.length - 1];
}
// 找下一个节点
export function findNextPoint(point, points, speed = 1) {
    return points[point.index + speed] || points[0];
}