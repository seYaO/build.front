// https://github.com/ZKingQ/PingPingPang

var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');
// var music = document.getElementById('music');
var timer = 10;
let animation
var ballsNum = 20,
    count = 0,
    score = 0,
    balls = [],
    ui = new UI(),
    now,
    lastTime = new Date(),
    lastTime1 = new Date();
var background_image;
var gamebox_image, gamecount_image, music_image, play_image, suspe_image;
var add_image, add2_image, add3_image, add5_image, miss_image, virus_image, virus_like_image, nurse_image;
var people_image = [];

var imgDatas = [
    'https://img1.40017.cn/cn/s/2020/zt/touch/200320/canvas-bg.png', // 背景图
    'https://img1.40017.cn/cn/s/2020/zt/touch/200320/game-box.png', // 计时背景图
    'https://img1.40017.cn/cn/s/2020/zt/touch/200320/game-count.png', // 计时背景图
    'https://img1.40017.cn/cn/s/2020/zt/touch/200320/game-music.png', // 音乐背景图
    'https://img1.40017.cn/cn/s/2020/zt/touch/200320/game-play.png', // 开始
    'https://img1.40017.cn/cn/s/2020/zt/touch/200320/game-suspe.png', // 暂停

    'https://img1.40017.cn/cn/s/2020/zt/touch/200320/icon-add.png', // +1 100x71
    'https://img1.40017.cn/cn/s/2020/zt/touch/200320/icon-add2.png', // +2 100x71
    'https://img1.40017.cn/cn/s/2020/zt/touch/200320/icon-add3.png', // +3 100x71
    'https://img1.40017.cn/cn/s/2020/zt/touch/200320/icon-add5.png', // +5 100x71
    'https://img1.40017.cn/cn/s/2020/zt/touch/200320/icon-miss.png', // miss 202x81

    'http://img1.40017.cn/cn/s/2020/zt/touch/200320/icon-virus.png', // 病毒 112x104
    'http://img1.40017.cn/cn/s/2020/zt/touch/200320/icon-virus_like.png', // 类似病毒 88x130

    'https://img1.40017.cn/cn/s/2020/zt/touch/200320/icon-nurse.png', // 84x119

    'https://img1.40017.cn/cn/s/2020/zt/touch/200320/icon-car.png', // 车 147x72
    'http://img1.40017.cn/cn/s/2020/zt/touch/200320/icon-plane.png', // 飞机 102x81
    'http://img1.40017.cn/cn/s/2020/zt/touch/200320/icon-police.png', // 73x128
    'https://img1.40017.cn/cn/s/2020/zt/touch/200320/icon-people0.png', // 105x127
    'https://img1.40017.cn/cn/s/2020/zt/touch/200320/icon-people1.png', // 85x121
    'https://img1.40017.cn/cn/s/2020/zt/touch/200320/icon-people2.png', // 88x129
]
var tempDatas = []
var scale = []


/**
 * 随机生成小球并放入
 * @returns {boolean} 是否成功放入小球
 */
function randomBall(val) {
    // console.log(val)
    var x, y, h, Image;
    var flag = true, i = 0, isVirus = false;
    // 尝试寻找空余地方放入
    while (flag) {
        if (++i > 1000) return false;
        // console.log(1)
        h = rate(gamebox_image.height - 38 - 50)
        x = Math.random() * canvas.width;
        y = Math.random() * canvas.height;
        // console.log(x, y, h)
        flag = false;
        if (y < h) { // y低于h
            flag = true
        }

        // balls.forEach((ball) => {
        //     // console.log(2)
        //     let dist = Math.sqrt((x - ball.x) ** 2 + (y - ball.y) ** 2);
        //     if (dist <= ball.width + 20)
        //         flag = true;
        // });
    }

    if (val == 0) { // 病毒
        Image = virus_image
        isVirus = true
    } else if (val == 1) { // 白色人物
        Image = nurse_image
    }
    else if (val == 2) { // 类似人物
        Image = virus_like_image
    } else {
        var idx = window.utils.randomNum(0, 5)
        Image = people_image[idx]
    }

    const vx = (Math.random() < 0.5 ? 1 : -1) * Math.random() * 2 + ui.difficulty / 2,
        vy = (Math.random() < 0.5 ? 1 : -1) * Math.random() * 2 + ui.difficulty / 2;

    balls.push(new Ball(Image, x, y, vx, vy, isVirus));
    return true;
}

// 墙面碰撞检测
function checkWalls(ball) {
    var bounce = -0.95; // 碰撞墙面衰减系数
    var multiple = 2
    if (ball.x + (ball.width / multiple) > canvas.width) {
        ball.x = canvas.width - (ball.width / multiple);
        ball.vx *= bounce;
    } else if (ball.x - (ball.width / multiple) < 0) {
        ball.x = (ball.width / multiple);
        ball.vx *= bounce;
    }
    if (ball.y + (ball.height / multiple) > canvas.height) {
        ball.y = canvas.height - (ball.height / multiple);
        ball.vy *= bounce;
    } else if (ball.y - (ball.height / multiple) < 0) {
        ball.y = (ball.height / multiple);
        ball.vy *= bounce;
    }
    // console.log(ball)
}

// 矢量偏移计算
function rotate(x, y, sin, cos, reverse) {
    return {
        x: (reverse) ? (x * cos + y * sin) : (x * cos - y * sin),
        y: (reverse) ? (y * cos - x * sin) : (y * cos + x * sin)
    };
}

// 物体碰撞检测
function checkCollision(ball0, ball1) {

    let dx = ball1.x - ball0.x,
        dy = ball1.y - ball0.y,
        dist = Math.sqrt(dx * dx + dy * dy);
    //collision handling code here
    if (dist < ball0.radius + ball1.radius) {
        //calculate angle, sine, and cosine
        let angle = Math.atan2(dy, dx),
            sin = Math.sin(angle),
            cos = Math.cos(angle),
            //rotate ball0's position
            pos0 = { x: 0, y: 0 }, //point
            //rotate ball1's position
            pos1 = rotate(dx, dy, sin, cos, true),
            //rotate ball0's velocity
            vel0 = rotate(ball0.vx, ball0.vy, sin, cos, true),
            //rotate ball1's velocity
            vel1 = rotate(ball1.vx, ball1.vy, sin, cos, true);
        //collision reaction, swap the two velocities
        [vel0, vel1] = [vel1, vel0]; // ES6
        //update position - to avoid objects becoming stuck together
        let absV = Math.abs(vel0.x) + Math.abs(vel1.x),
            overlap = (ball0.radius + ball1.radius) - Math.abs(pos0.x - pos1.x);
        pos0.x += vel0.x / absV * overlap;
        pos1.x += vel1.x / absV * overlap;
        //rotate positions back
        let pos0F = rotate(pos0.x, pos0.y, sin, cos, false),
            pos1F = rotate(pos1.x, pos1.y, sin, cos, false);
        //adjust positions to actual screen positions
        ball1.x = ball0.x + pos1F.x;
        ball1.y = ball0.y + pos1F.y;
        ball0.x = ball0.x + pos0F.x;
        ball0.y = ball0.y + pos0F.y;
        //rotate velocities back
        let vel0F = rotate(vel0.x, vel0.y, sin, cos, false),
            vel1F = rotate(vel1.x, vel1.y, sin, cos, false);
        ball0.vx = vel0F.x;
        ball0.vy = vel0F.y;
        ball1.vx = vel1F.x;
        ball1.vy = vel1F.y;
        ball0.vx *= 0.99;
        ball0.vy *= 0.99;
        ball1.vx *= 0.99;
        ball1.vy *= 0.99;
    }
}

// 物体移动函数
function move(ball) {
    ball.move();
    checkWalls(ball);
}

// 小球绘制与消除超时
function drawBalls(ball, index) {
    // if (ball.radius > 20) {
    //     ball.radius -= 0.01;
    //     ball.createTime = now;
    // }
    // else if (now - ball.createTime > 20000) {
    //     balls.splice(index, 1);
    //     --ui.score;
    // }
    ball.draw(context);
}

// 动画绘制
function drawFrame() {
    cancelAnimationFrame(animation)
    animation = requestAnimationFrame(drawFrame);
    now = new Date();
    context.clearRect(0, 0, canvas.width, canvas.height);
    // 背景图
    context.drawImage(background_image, 0, 0, canvas.width, canvas.height);
    // balls.forEach(move);
    // for (let i = 0, len = balls.length - 1; i < len; i++) {
    //     let ballA = balls[i];
    //     // n^2暴力枚举每个气泡之间是否发生碰撞
    //     for (let j = i + 1; j < balls.length; j++) {
    //         let ballB = balls[j];
    //         // checkCollision(ballA, ballB);
    //     }
    // }
    balls.forEach(drawBalls);
    ui.draw(context, animation);
}

// 坐标转换函数
function windowToCanvas(x, y) {
    let myStyle = window.getComputedStyle(canvas);
    let bbox = canvas.getBoundingClientRect();
    x -= bbox.left + parseFloat(myStyle.borderLeftWidth) + parseFloat(myStyle.paddingLeft);
    y -= bbox.top + parseFloat(myStyle.borderTopWidth) + parseFloat(myStyle.paddingTop);
    x *= canvas.width / (parseFloat(myStyle.width));
    y *= canvas.height / (parseFloat(myStyle.height));
    return { x: x, y: y };
}

// 检测是否点中小球并计分
function clickBall(ev) {
    if (!timer) return

    var loc = windowToCanvas(ev.x, ev.y);
    var flag = false, virusBall;
    var dist = { w: 0, h: 0 };
    // console.log(loc)
    balls.forEach((ball, index) => {
        if (ball.isVirus) {
            virusBall = ball
        }
        // if (flag) return;
        // var dist = { w: 0, h: 0 };
        // dist.w = Math.sqrt((loc.x - ball.x) * (loc.x - ball.x));
        // dist.h = Math.sqrt((loc.y - ball.y) * (loc.y - ball.y));
        // // console.log(dist, '--', ball.width, ball.height)
        // if (dist.w <= ball.width && dist.h <= ball.height) {
        //     var point = Math.round(Math.log(ball.width + 10 * Math.abs(ball.vx) * Math.abs(ball.vy)));
        //     ui.addShow(point, loc, ball);
        //     balls.splice(index, 1);
        //     if (ball.isVirus) {
        //         Continue()
        //     }

        //     flag = true;
        // }
    });

    dist.w = Math.sqrt((loc.x - virusBall.x) * (loc.x - virusBall.x));
    dist.h = Math.sqrt((loc.y - virusBall.y) * (loc.y - virusBall.y));
    if (dist.w <= virusBall.width && dist.h <= virusBall.height) {
        var point = Math.round(Math.log(virusBall.width + 10 * Math.abs(virusBall.vx) * Math.abs(virusBall.vy)));
        ui.addShow(point, loc, virusBall);
        // balls.splice(index, 1);
        // if (ball.isVirus) {
        //     Continue()
        // }

        flag = true;
        Continue()
    }

    if (!flag) ui.addShow(0, loc);
}

// 网页可见区域宽： document.body.clientWidth
// 网页可见区域高： document.body.clientHeight
// 网页可见区域宽： document.body.offsetWidth (包括边线的宽)
// 网页可见区域高： document.body.offsetHeight (包括边线的高)
// 网页正文全文宽： document.body.scrollWidth
// 网页正文全文高： document.body.scrollHeight
// 网页被卷去的高： document.body.scrollTop
// 网页被卷去的左： document.body.scrollLeft
// 网页正文部分上： window.screenTop
// 网页正文部分左： window.screenLeft
// 屏幕分辨率的高： window.screen.height
// 屏幕分辨率的宽： window.screen.width
// 屏幕可用工作区高度： window.screen.availHeight
// 屏幕可用工作区宽度： window.screen.availWidth


/**
 * 比例分配
 * @param {*} scale 
 * scale.nurse
 * scale.likevirus
 * 1-3 1-10% 类似-20% 
 * 4-6 1-8% 类似-30% 
 * 7-9 1-5% 类似-40% 
 * 10-12 1-1% 类似-50% 
 */
function scaleFn() {
    var arr = [], newArr = [0], nNum = 0, lNum = 0, nScale = 0, lScale = 0;
    switch (count) {
        case 0:
        case 1:
        case 2:
        case 3:
            nScale = 0.1
            lScale = 0.2
            ballsNum = 20
            break;
        case 4:
        case 5:
        case 6:
            nScale = 0.08
            lScale = 0.3
            ballsNum = 40
            break;
        case 7:
        case 8:
        case 9:
            nScale = 0.05
            lScale = 0.4
            ballsNum = 60
            break;
        default:
            nScale = 0.01
            lScale = 0.5
            ballsNum = 80
            break;
    }
    // ballsNum = 1
    nNum = Math.ceil(ballsNum * nScale)
    lNum = Math.ceil(ballsNum * lScale)
    for (var i = 0; i < nNum; i++) {
        arr.push(1) // 白色人物
    }
    for (var i = 0; i < lNum; i++) {
        arr.push(2) // 类似人物
    }
    for (var i = 0; i < ballsNum - nNum - lNum; i++) {
        arr.push(3) // 其他
    }
    var len = arr.length
    for (var i = 0; i < len; i++) {
        var idx = window.utils.randomNum(0, arr.length - 1)
        newArr.push(arr[idx])
        arr.splice(idx, 1);
    }
    return newArr
}

function Continue() {
    count++
    balls = []
    var ballArr = scaleFn()
    ballArr.forEach(function (val) {
        randomBall(val);
    })
    // debugger
    drawFrame();
}

function Start() {
    var w = $(window).width(), h = $(window).height()
    $("#myCanvas").css({ "width": w + "px", "height": h + "px" })
    canvas.width = w
    canvas.height = h
    imgDatas.forEach(function (item) {
        tempDatas.push(window.utils.tempFilePaths(item))
    })
    // console.log(tempDatas)
    Promise.all(tempDatas).then(res => {
        // 背景图
        background_image = res[0]
        gamebox_image = res[1]
        gamecount_image = res[2]
        music_image = res[3]
        play_image = res[4]
        suspe_image = res[5]

        add_image = res[6]
        add2_image = res[7]
        add3_image = res[8]
        add5_image = res[9]
        miss_image = res[10]
        virus_image = res[11]
        virus_like_image = res[12]
        nurse_image = res[13]
        people_image = res.slice(-6)

        canvas.addEventListener('mousedown', clickBall);
        console.log(people_image)
        Continue() // 游戏开始
    }).catch(e => { });
}

// 根据窗口大小动态缩放canvas尺寸
function resize() {
    const height = window.innerHeight;
    const ratio = canvas.width / canvas.height;
    const width = height * ratio;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
}

window.addEventListener('load', resize, false);
window.addEventListener('resize', resize, false);
