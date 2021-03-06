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

const radius = 3;
const alias = 1;
const ratio = (radius + alias) / radius;
const thres = 190;
const circleRadius = 380;
const maxAcc = 0.3;
const rgb = (red, green, blue, alpha) => `rgba(${red}, ${green}, ${blue}, ${alpha})`;
const randomAngle = () => Math.random() * Math.PI * 2;
const distance = (x1, y1, x2, y2) => Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
const zoom = 0.5;

const src = './images/barcelona_0.5_3_1.png';

let CircleArray = [];
let showImage = true;
let requestId = undefined;
let returnValue = 0;
let begin = true;

//console.log(canvas.style);

class Circle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.startX = x;
        this.startY = y;
        this.dx = 0;
        this.dy = 0;
        this.finished = 0;
        this.accX = 0;
        this.accY = 0;
        this.destX = x;
        this.dextY = y;
        this.originX = x;
        this.originY = y;
    }
    draw() {
        c.beginPath();
        // c.arc(this.x, this.y, radius, 0, Math.PI * 2, 0);
        //console.log('draw');
        c.arc(this.x, this.y, radius, 0, Math.PI * 2, 0);
        c.strokeStyle = this.color;
        c.fillStyle = this.color;
        c.stroke();
        c.fill();
    }

    moveTo(theta) {
        this.startX = this.x;
        this.startY = this.y;
        this.destX = widthCenter + circleRadius * Math.cos(theta);
        //console.log(theta);
        this.destY = heightCenter + circleRadius * Math.sin(theta);
        this.dx = 0;
        this.dy = 0;
        const dist = distance(this.x, this.y, this.destX, this.destY);
        this.xpart = (this.destX - this.x) / dist;
        this.ypart = (this.destY - this.y) / dist;
    }

    moveBack() {
        this.startX = this.x;
        this.startY = this.y;
        this.destX = this.originX;
        this.destY = this.originY;
        this.dx = 0;
        this.dy = 0;
        const dist = distance(this.x, this.y, this.destX, this.destY);
        this.xpart = (this.destX - this.x) / dist;
        this.ypart = (this.destY - this.y) / dist;
    }

    update() {
        //console.log(this.color);
        if (showImage && this.finished==2) {
            this.draw();
            return;
        } else if (!showImage && this.finished==2) {
            this.finished = 0;
            this.moveTo(randomAngle());
        }

        //console.log(this.finished);
        const halfWayX = (this.destX - this.startX) / 2;
        const nowX = this.x - this.startX;
        //Get how far we've gone. Thus decide the speed of next move
        let progress = (nowX - halfWayX) / halfWayX;
        this.accX = -this.xpart * maxAcc * progress;
        this.accY = -this.ypart * maxAcc * progress;
        this.dx += this.accX;
        this.dy += this.accY;
        if (Math.abs(this.x + this.dx - this.startX) > Math.abs(this.startX - this.destX) ||
            Math.abs(this.y + this.dy - this.startY) > Math.abs(this.startY - this.destY)) {
            this.dx = 0;
            this.dy = 0;
            this.accX = 0;
            this.accY = 0;
            if (showImage) {
                if (this.finished == 1) {
                    returnValue += 1;
                    this.finished = 2;
                } else {
                    this.moveBack();
                    this.finished = 1;
                }
            } else {
                this.moveTo(randomAngle());
                //console.log(this.destX);
            }
        } else {
            this.x += this.dx;
            this.y += this.dy;
        }
        this.draw();
        //console.log(returnValue);
    }
}

window.addEventListener('resize', function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    innerWidth = canvas.width;
    innerHeight = canvas.height;
    widthCenter = innerWidth / 2;
    heightCenter = innerHeight / 2;
    img.src = src;
});

window.addEventListener('click', function () {
    begin = false;
    showImage = !showImage;
    if (!showImage) {
        oscillate();
    }
});

let img = new Image();

function ready() {
    const shiftWidth = img.naturalWidth*zoom;
    const shiftHeight = img.naturalHeight*zoom;
    const beginX = (innerWidth - shiftWidth) / 2;
    const beginY = (innerHeight - shiftHeight) / 2;
    c.drawImage(img, (innerWidth - shiftWidth) / 2, (innerHeight - shiftHeight) / 2, shiftWidth, shiftHeight);
    pixelize();
    //console.log(CircleArray.length);
    for (let i = 0; i < CircleArray.length; i++) {
        // console.log(CircleArray[i].color);
        let theta = randomAngle();
        CircleArray[i].x = widthCenter + circleRadius * Math.cos(theta);
        CircleArray[i].y = heightCenter + circleRadius * Math.sin(theta);
        CircleArray[i].moveTo(randomAngle());
        CircleArray[i].draw();
    }
    if (begin == false) {
        oscillate();
    }
}

function dealing(imgData, beginX, beginY, numX, numY) {
    CircleArray = [];
    let red, green, blue, alpha = 0;
    //console.log(numX);
    let pos = 0;
    for (let y = radius; y < numY; y += 2 * radius) {
        for (let x = radius; x < numX; x += 2 * radius) {
            red = imgData[(y * numX + x) * 4];
            green = imgData[(y * numX + x) * 4 + 1];
            blue = imgData[(y * numX + x) * 4 + 2];
            alpha = imgData[(y * numX + x) * 4 + 3];
            if (alpha >= 0.9) {
            //console.log(rgb(red, green, blue))
                let circle = new Circle(x + beginX + (x / radius) * alias, y + beginY + (y / radius) * alias, rgb(red, green, blue, alpha));
                CircleArray.push(circle);
            }
        }
    }
}

function pixelize() {
    const shiftWidth = img.naturalWidth*zoom;
    const shiftHeight = img.naturalHeight*zoom;
    const beginX = (innerWidth - shiftWidth * ratio) / 2;
    const beginY = (innerHeight - shiftHeight * ratio) / 2;
    let imageData = c.getImageData((innerWidth - shiftWidth) / 2, (innerHeight - shiftHeight) / 2, shiftWidth, shiftHeight);
    c.clearRect((innerWidth - shiftWidth) / 2, (innerHeight - shiftHeight) / 2, shiftWidth, shiftHeight);
    dealing(imageData.data, beginX, beginY, shiftWidth, shiftHeight);
    // for (let i = 0; i < CircleArray.length; i++) {
    //     CircleArray[i].draw();
    // }
}

function oscillate() {
    requestId = requestAnimationFrame(oscillate);
    c.clearRect(0, 0, innerWidth, innerHeight);
    for (let i = 0; i < CircleArray.length; i++) {
        CircleArray[i].update();
    }
    if (showImage && returnValue >= CircleArray.length) {
        window.cancelAnimationFrame(requestId);
        requestId = undefined;
        returnValue = 0;
    }
}

img.src = src;
img.onload = ready;