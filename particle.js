class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = electrostaticEnabled ? 1 : 3;
        this.speedY = 5;
        this.speedX = (Math.random() - 0.5) * 2;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = 'blue';
        ctx.fill();
    }

    update() {
        this.y += this.speedY;
        this.x += this.speedX;
    }
}
