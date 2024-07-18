// oscillatingParticle.js

class OscillatingParticle {
    constructor(x, y, size, speed) {
        this.x = x;
        this.y = y;
        this.baseSize = 3;
        this.size = electrostaticEnabled ? this.baseSize : this.baseSize * 7 / 3;
        this.speed = speed;
        this.angle = Math.random() * 2 * Math.PI;
    }

    draw() {
        particleSizeCtx.beginPath();
        particleSizeCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        particleSizeCtx.fillStyle = 'blue';
        particleSizeCtx.fill();
    }

    update() {
        this.angle += this.speed;
        this.y = (particleSizeCanvas.height / 2) + Math.sin(this.angle) * oscillationRange;
    }

    setSize() {
        this.size = electrostaticEnabled ? this.baseSize : this.baseSize * 7 / 3;
    }
}
