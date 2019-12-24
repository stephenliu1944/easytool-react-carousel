// 绘制参考线
export function drawReferenceLines(container, points = []) {
    container.querySelectorAll('.carousel_ref_line').forEach(child => container.removeChild(child));
    points.forEach((point) => {
        let div = document.createElement('div');
        div.setAttribute('class', 'carousel_ref_line');
        div.style.backgroundColor = 'red';
        div.style.width = '1px';
        div.style.height = '1px';
        div.style.position = 'absolute';
        div.style.top = point.y + 'px';
        div.style.left = point.x + 'px';
        container.appendChild(div);
    });
}