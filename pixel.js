//import 'get-image-pixels';

let canvas = document.querySelector('canvas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let innerWidth = canvas.width;
let innerHeight = canvas.height;

let c = canvas.getContext('2d');

const radius = 5;
const alias = 2;
const ratio = (radius+alias)/radius;

let CircleArray = [];

const rgb = (red, green, blue) => `rgba(${red}, ${green}, ${blue}, 1)`;
const src = './images/Charizard.png';

class Circle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
    }
    draw() {
        c.beginPath();
        // c.arc(this.x, this.y, radius, 0, Math.PI * 2, 0);
        c.arc(this.x, this.y, radius, 0, Math.PI*2, 0);
        c.strokeStyle = this.color;
        c.stroke();
        c.fillStyle = this.color;
        c.fill();
        c.closePath();
    }
}

addEventListener('resize', function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    innerWidth = canvas.width;
    innerHeight = canvas.height;
    pixelize();
});

addEventListener('reload', function () {
    console.log('reload');
    ready();
});

let img = new Image();


function ready() {
    const shiftWidth = img.naturalWidth;
    const shiftHeight = img.naturalHeight;
    const beginX = (innerWidth - shiftWidth)/2;
    const beginY = (innerHeight - shiftHeight)/2;
    c.drawImage(img, 0, 0, shiftWidth, shiftHeight);
    pixelize();
}

function dealing(imgData, beginX, beginY, endX, endY) {
    CircleArray = [];
    let red, green, blue = 0;
    const numX = endX - beginX;
    const numY = endY - beginY;
    console.log(numX);
    let pos = 0;
    for (let y = radius; y < numY; y += 2*radius) {
        for (let x = radius; x < numX; x += 2*radius) {
            // let posx = (pos)%numX;
            // console.log(x);
            // console.log(posx);
            red = imgData[(y*numX + x)*4];
            green = imgData[(y*numX + x)*4 + 1];
            blue = imgData[(y*numX + x)*4+2];
            //console.log(rgb(red, green, blue))
            let circle = new Circle(x+beginX+(x/radius)*alias, y+beginY+(y/radius)*alias, rgb(red, green, blue));
            CircleArray.push(circle);
        }
    }
}

function pixelize() {
    // if (!img.complete) {
    //     setTimeout(pixelize, 10);
    //     return;
    // } else{
    //     let prom = new Promise(function(resolve, reject){
    //         //ready();
    //         resolve();
    //     });
    //     prom.then((res)=>{
            const shiftWidth = img.naturalWidth;
            const shiftHeight = img.naturalHeight;
            const beginX = (innerWidth - shiftWidth*ratio)/2;
            const beginY = (innerHeight- shiftHeight*ratio)/2;
            const endX = (innerWidth + shiftWidth)/2;
            const endY = (innerHeight + shiftHeight)/2;
            let i = 0;
            let imageData = c.getImageData(0, 0, shiftWidth, shiftHeight);
            c.clearRect(0, 0, shiftWidth, shiftHeight);
            console.log(imageData);
            // console.log('ahaha');
            dealing(imageData.data, beginX, beginY, endX, endY);
            //console.log(CircleArray);
            for (let i = 0 ; i < CircleArray.length; i++){
                CircleArray[i].draw();
            }
            //c.putImageData(imageData, beginX, beginY);
    //     })
    // }
}

img.src = src;
img.onload = ready;
