// 绘制参考线
export function drawReferenceLines(points = []) {
    points.forEach((point) => {
        let div = document.createElement('div');
        div.class = 'carousel_ref_line';
        div.style.backgroundColor = 'red';
        div.style.width = '1px';
        div.style.height = '1px';
        div.style.position = 'absolute';
        div.style.top = point.y + 'px';
        div.style.left = point.x + 'px';
        document.body.appendChild(div);
    });
}