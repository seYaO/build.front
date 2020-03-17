/**
 * 用于显示分数和点击效果的类
 * @class UI
 */
class UI {
    constructor() {
        /**
         * 分数显示坐标
         * @property {int} x, y
         * 当前分数
         * @property {int} score
         * 分数显示颜色
         * @property {string} color
         */
        this.x = 50;
        this.y = 50;
        this.hit = 0;
        this.score = 0;
        this.display = [];
        this.difficulty = 0;
        this.color = '#d2e2f2';
        this.playTime = new Date();
        this.lastTime = new Date();
    }

    draw(context, animation) {
        context.save();
        this.display.forEach((val, key) => {
            context.font = val.font;
            context.fillStyle = val.color;
            var Image = val.isMiss ? miss_image : add_image
            context.drawImage(Image, val.loc.x - rate(Image.width) / 2, val.loc.y - rate(Image.height), rate(Image.width), rate(Image.height));
            if (new Date() - val.time > 1000)
                this.display.splice(key, 1);
        });
        context.font = '20px monaco';
        context.fillStyle = this.color;
        // 检查游戏进程
        console.log(timer)
        if (timer) {
            context.fillStyle = '#F56C6C';
            context.fillText('score:' + this.score, this.x, this.y);
        } else {
            cancelAnimationFrame(animation);
            // context.clearRect(0, 0, canvas.width, canvas.height);
            // context.fillStyle = 'black';
            // context.fillRect(0, 0, canvas.width, canvas.height);
            // context.fillStyle = 'white';
            // context.font = rate(100) + 'px monaco';
            // context.textAlign = 'center';
            // context.fillText('Game Over', canvas.width / 2, canvas.height / 2);
        }
        if (now - this.playTime > 1000) {
            bgm.pause();
        }
        context.restore();
    }

    addShow(point, loc, ball) {
        console.log('addShow', ball)
        if (point !== 0) {
            if (ball.isVirus) {
                this.score += 1;
                this.display.push({
                    point: "+1",
                    isMiss: false,
                    loc: loc,
                    color: "#E6A23C",
                    font: "20px monaco",
                    time: new Date()
                })
            } else {
                this.display.push({
                    point: "Miss",
                    isMiss: true,
                    loc: loc,
                    color: "#E6A23C",
                    font: "20px monaco",
                    time: new Date()
                });
            }
        }
        // if (point === 0) {
        //     this.display.push({
        //         point: "Miss",
        //         isMiss: true,
        //         loc: loc,
        //         color: "#E6A23C",
        //         font: "20px monaco",
        //         time: new Date()
        //     });
        //     // this.score -= 1;
        //     this.hit = 0;
        // } else {
        //     this.score += 1;
        //     this.display.push({
        //         point: "+1",
        //         isMiss: false,
        //         loc: loc,
        //         color: "#E6A23C",
        //         font: "20px monaco",
        //         time: new Date()
        //     })
        // }

        if (this.display.length > 2) this.display.splice(0, 1);
    }
}
