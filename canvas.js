let canvas = document.querySelector('canvas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let innerWidth = canvas.width;
let innerHeight = canvas.height;

// console.log(canvas);
// console.log(window.innerWidth);
// console.log(window.innerHeight);

let c = canvas.getContext('2d');

const randomColor = () => parseInt(Math.random() * 255);

const randomX = radius => (Math.random() * (innerWidth - radius * 2)+ radius);

const randomY = radius =>  (Math.random() * (innerHeight - radius * 2) + radius);

const randomRadius = () => (Math.random() * 30);

const randomSpeed = () => ((Math.random()-0.5) * 4);
// const numRect = 10;
const numArcs = 100;

class Circle {
    constructor(x, y, radius, dx, dy) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.radius = radius;
        this.colorStr = `rgba(${randomColor()}, ${randomColor()}, ${randomColor()}, 0.5)`;
    }

    draw() {
        c.beginPath();
        c.strokeStyle = this.colorStr;
        c.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
        c.stroke();
        c.fillStyle = this.colorStr;
        c.fill();
    }

    update() {
        this.draw();
        if (this.x + this.radius > innerWidth || this.x - this.radius < 0) {
            this.dx = -this.dx;
        }
        if (this.y + this.radius > innerHeight || this.y - this.radius < 0) {
            this.dy = -this.dy;
        }

        this.x += this.dx;
        this.y += this.dy;
    }
};

let Circlearray = [];

for (let i = 0; i < numArcs; i++){
    const radius = randomRadius();
    const x = randomX(radius);
    const y = randomY(radius);
    const dx = randomSpeed();
    const dy = randomSpeed();
    Circlearray.push(new Circle(x, y, radius, dx, dy));
}

function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, innerWidth, innerHeight);
    for (let i = 0; i < numArcs; i++){
        Circlearray[i].update();
    }
    // console.log('haha');
}

window.addEventListener('resize', function(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    innerWidth = canvas.width;
    innerHeight = canvas.height;
    for (let i = 0; i < numArcs; i++) {
        CircleArray[i].update();
    }
})

animate();

// for (let i = 0; i < numRect; i++) {
//     const x = Math.random() * window.innerWidth;
//     const y = Math.random() * window.innerHeight;
//     const w = Math.random() * 200;
//     const h = Math.random() * 200;
//     const r = randomColor();
//     const g = randomColor();
//     const b = randomColor();
//     c.fillStyle = `rgba(${r}, ${g}, ${b}, 0.3)`;
//     c.fillRect(x, y, w, h);
// }

// for (let i = 0; i < numArcs; i++){
//     c.beginPath();
//     const x = Math.random() * window.innerWidth;
//     const y = Math.random() * window.innerHeight;
//     const r = randomColor();
//     const g = randomColor();
//     const b = randomColor();
//     c.strokeStyle = `rgba(${r}, ${g}, ${b}, 2)`;
//     c.arc(x, y, 30, 0, Math.PI*2, false);
//     c.stroke();
// }