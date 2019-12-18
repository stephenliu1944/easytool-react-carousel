export function requestAnimationFrame() {
    return window.requestAnimationFrame || 
            window.webkitRequestAnimationFrame || 
            window.mozRequestAnimationFrame    || 
            window.oRequestAnimationFrame      || 
            window.msRequestAnimationFrame     || 
            function(cb) {
                return window.setTimeout(cb, 1000 / 60);    // 每秒60帧肉眼感觉不出卡顿
            };
}

export function cancelAnimationFrame() {
    return window.cancelAnimationFrame  ||
            window.webkitCancelAnimationFrame ||
            window.mozCancelAnimationFrame    ||
            window.oCancelAnimationFrame      ||
            window.clearTimeout;
}