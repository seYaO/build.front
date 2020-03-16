/**
 * 用于小球和雪花生成的类
 * @class Ball
 */
function rate(px) {
    // ((_w > 750) ? 750 : _w) / 750 * 100 + 'px'
    return px / (750.0 / window.screen.width) * 3
    // return px / (750.0 / window.screen.width) * 2
}

class Ball {
    constructor(img, x = 0, y = 0, vx = 0, vy = 0) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.width = rate(img.width);
        this.height = rate(img.height);
        this.flag = true; // 是否为病毒
        this.createTime = new Date();
        this.img = img
    }

    move() {
        this.x += this.vx;
        this.y += this.vy;
    }

    draw(context) {
        context.save();
        context.translate(this.x, this.y);
        context.beginPath();
        context.drawImage(this.img, 0, 0, this.width, this.height);
        context.closePath();
        context.fill();
        context.restore();
    }
}