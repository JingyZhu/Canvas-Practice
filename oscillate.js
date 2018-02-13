let canvas = document.querySelector('canvas');
let body = document.querySelector('body');
const backcolor = body.style.backgroundColor;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let innerWidth = canvas.width;
let innerHeight = canvas.height;
let widthCenter = innerWidth / 2;
let heightCenter = innerHeight / 2;

let c = canvas.getContext('2d');

// Const values
const colorArr = ['#025159', '#F2E205', '#F2B705', '#F27405', '#BF2604']
const randomColor = () => colorArr[Math.round((Math.random() * 4))];
const randomAngle = () => Math.random() * Math.PI * 2;
const distance = (x1, y1, x2, y2) => Math.sqrt((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1));
const radius = 2;
const circleRadius = 300;
const numArcs = 1500;
const maxAcc = 1;
// ----------------------

let CircleArray = [];

class Circle {
    constructor(x, y, value) {
        this.x = x;
        this.y = y;
        this.color = randomColor();
        this.startX = x;
        this.startY = y;
        this.dx = value;
        this.dy = value;
        this.goingAngle = value;
        this.finished = true;
        this.accX = value;
        this.accY = value;
        this.destX = x;
        this.dextY = y;
    }

    draw() {
        c.beginPath();
        c.strokeStyle = this.color;
        c.arc(this.x, this.y, radius, 0, Math.PI*2, false);
        c.stroke();
        c.fillStyle = this.color;
        c.fill();
    }

    moveTo(theta) {
        if (this.finished) {
            //console.log('moveTo');
            this.startX = this.x;
            this.startY = this.y;
            this.destX = widthCenter + circleRadius * Math.cos(theta);
            this.destY = heightCenter + circleRadius * Math.sin(theta);
            const dist = distance(this.x, this.y, this.destX, this.destY);
            this.xpart = (this.destX - this.x) / dist;
            this.ypart = (this.destY - this.y) / dist;
            this.finished = false;
            //this.addspeed
        }
    }

    update() {
        const halfWayX = (this.destX - this.startX) / 2;
        const nowX = this.x - this.startX;

        //Get how far we've gone. Thus decide the speed of next move
        let progress = (nowX - halfWayX)/halfWayX;
        this.accX = -this.xpart * maxAcc * progress;
        this.accY = -this.ypart * maxAcc * progress;
        this.dx += this.accX;
        this.dy += this.accY;
        if (Math.abs(this.x + this.dx - this.startX) > Math.abs(this.startX - this.destX) || 
            Math.abs(this.y + this.dy - this.startY) > Math.abs(this.startY - this.destY)) {
                this.finished = true;
                this.dx = 0;
                this.dy = 0;
                this.accX = 0;
                this.accY = 0;
                this.moveTo(randomAngle());
            } else {
                //console.log(this.dy);
                //console.log(this.x);
                this.x += this.dx;
                this.y += this.dy;
            }
        this.draw()
    }




}

window.addEventListener('resize', function(){
    CircleArray = [];
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    innerWidth = canvas.width;
    innerHeight = canvas.height;
    widthCenter = innerWidth / 2;
    heightCenter = innerHeight / 2;
    init();
})

function init() {
    for (let i = 0 ; i < numArcs; i++) {
        const theta = randomAngle();
        CircleArray.push(new Circle(widthCenter + circleRadius * Math.cos(theta), heightCenter + circleRadius * Math.sin(theta), 0));
    }
    for (let i = 0 ; i < numArcs; i++) {
        CircleArray[i].draw();
        CircleArray[i].moveTo(randomAngle());
    }
}

init();

function oscillate() {
    requestAnimationFrame(oscillate);
    c.clearRect(0, 0, innerWidth, innerHeight);
    //console.log(CircleArray[0]);
    for (let i = 0; i < numArcs; i++){
        CircleArray[i].update();
    }
}

oscillate();
// function animate() {
//     requestAnimationFrame(animate);
//     c.clearRect(0, 0, innerWidth, innerHeight);
//     for (let i = 0; i < numArcs; i++){
//         Circlearray[i].update();
//     }
//     // console.log('haha');
// }

// animate();

