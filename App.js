// **************************************
class Circle {
    constructor(x, y, r, dx, dy, color) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.dx = dx;
        this.dy = dy;
        this.color = color;
        this.neghborciecles = [];

    }
    desin() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowColor = "white";
        ctx.shadowBlur = "5";
        ctx.fill();
        ctx.closePath();
    }
    update() {

        for (let i = 0; i < this.neghborciecles.length; i++) {
            let distance = Math.sqrt(Math.pow(this.x - this.neghborciecles[i].x, 2) + Math.pow(this.y - this.neghborciecles[i].y, 2));
            if (distance <= this.r + this.neghborciecles[i].r) {

                let tempdx = this.dx;
                let tempdy = this.dy;

                this.dx = this.neghborciecles[i].dx;
                this.dy = this.neghborciecles[i].dy;

                this.neghborciecles[i].dx = tempdx;
                this.neghborciecles[i].dy = tempdy;

                let overlap = this.r + this.neghborciecles[i].r - distance;
                let angle = Math.atan2(this.y - this.neghborciecles[i].y, this.x - this.neghborciecles[i].x);

                this.x += (overlap / 2) * Math.cos(angle);
                this.y += (overlap / 2) * Math.sin(angle);

                this.neghborciecles[i].x -= (overlap / 2) * Math.cos(angle);
                this.neghborciecles[i].y -= (overlap / 2) * Math.sin(angle);
            }
        }

        if (this.x + this.r > window.innerWidth || this.x < this.r) {
            this.dx = direction * this.dx;
        }
        if (this.y + this.r > window.innerHeight || this.y < this.r) {
            this.dy = direction * this.dy;
        }
        this.x += this.dx;
        this.y += this.dy;
    }
}

function randomColor() {
    let letters = "ABCDEF0123456789";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


function animationStart() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    requestAnimationFrame(animationStart);
    for (let i = 0; i < circles.length; i++) {
        circles[i].neghborciecles = circles.filter((el, j) => j !== i);

        circles[i].desin();
        circles[i].update();

    }
}

function randomuniforme(xmin, xmax) {
    return Math.random() * (xmax - xmin) + xmin;
}
function distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}
function GenerateCircles(n) {
    let circles = [];
    let stepzeros = true;

    do {
        let r = Math.random() * 50;
        let dx = Math.random() * 5;
        let dy = Math.random() * 5;
        let color = randomColor();
        let x = randomuniforme(r, window.innerWidth - r);
        let y = randomuniforme(r, window.innerHeight - r);
        if (stepzeros) {
            circles.push(new Circle(x, y, r, dx, dy, color));
            stepzeros = false;
        }
        else {
            if (circles.every(el => distance(x, y, el.x, el.y) > r + el.r + Math.max(dx, dy, el.dx, el.dy))) {
                circles.push(new Circle(x, y, r, dx, dy, color));
            }
        }
    } while (circles.length < n)

    return circles;
}

// **************************************

let canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let ctx = canvas.getContext('2d');

let direction = -1;
let n = 50;
let circles = GenerateCircles(n);

animationStart();
