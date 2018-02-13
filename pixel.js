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

const radius = 2;
const alias = 0.7;
const ratio = (radius+alias)/radius;
const thres = 190;
const circleRadius = 250;

let CircleArray = [];

const rgb = (red, green, blue, alpha) => `rgba(${red}, ${green}, ${blue}, ${alpha})`;

const src = './images/Charizard_t.png';

//console.log(canvas.style);

class Circle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.dx = 0;
        this.dy = 0;
        this.originX = x;
        this.originY = y;
        this.lastX = x;
        this.lastY = y;
    }
    draw() {
        c.beginPath();
        // c.arc(this.x, this.y, radius, 0, Math.PI * 2, 0);
        c.arc(this.x, this.y, radius, 0, Math.PI * 2, 0);
        c.strokeStyle = this.color;
        c.stroke();
        c.fillStyle = this.color;
        c.fill();
        c.closePath();
    }
    oscillate(){
        if (this.dx === 0 && this.dy === 0) {

        }
    }
}

addEventListener('resize', function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    innerWidth = canvas.width;
    innerHeight = canvas.height;
    img.src = src;
});

// addEventListener('reload', function () {
//     //console.log('reload');
//     ready();
// });

let img = new Image();


function ready() {
    const shiftWidth = img.naturalWidth*0.5;
    const shiftHeight = img.naturalHeight*0.5;
    const beginX = (innerWidth - shiftWidth)/2;
    const beginY = (innerHeight - shiftHeight)/2;
    c.drawImage(img, (innerWidth - shiftWidth)/2, (innerHeight - shiftHeight)/2, shiftWidth, shiftHeight);
    pixelize();
}

function dealing(imgData, beginX, beginY, numX, numY) {
    CircleArray = [];
    let red, green, blue, alpha = 0;
    //console.log(numX);
    let pos = 0;
    for (let y = radius; y < numY; y += 2*radius) {
        for (let x = radius; x < numX; x += 2*radius) {
            red = imgData[(y*numX + x)*4];
            green = imgData[(y*numX + x)*4 + 1];
            blue = imgData[(y*numX + x)*4+2];
            alpha = imgData[(y*numX + x)*4 +3];
            //console.log(rgb(red, green, blue))
            let circle = new Circle(x+beginX+(x/radius)*alias, y+beginY+(y/radius)*alias, rgb(red, green, blue, alpha));
            CircleArray.push(circle);
        }
    }
}

function pixelize() {
        const shiftWidth = img.naturalWidth*0.5;
        const shiftHeight = img.naturalHeight*0.5;
        const beginX = (innerWidth - shiftWidth*ratio)/2;
        const beginY = (innerHeight- shiftHeight*ratio)/2;
        let imageData = c.getImageData((innerWidth - shiftWidth)/2, (innerHeight-shiftHeight)/2, shiftWidth, shiftHeight);
        c.clearRect((innerWidth - shiftWidth)/2, (innerHeight-shiftHeight)/2, shiftWidth, shiftHeight);
        dealing(imageData.data, beginX, beginY, shiftWidth, shiftHeight);
        for (let i = 0 ; i < CircleArray.length; i++){
            CircleArray[i].draw();
        }
            //c.putImageData(imageData, beginX, beginY);
    //     })
    // }
}

img.src = src;
img.onload = ready;
