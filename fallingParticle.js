// fallingParticle.js

class FallingParticle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.baseSize = 3;
        this.size = electrostaticEnabled ? this.baseSize : this.baseSize * 7 / 3;
        this.speedY = Math.random() * 2 + 1;
        this.speedX = Math.random() * 2 - 1;
        this.attached = false;
    }

    draw() {
        appleCtx.beginPath();
        appleCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        appleCtx.fillStyle = this.attached ? 'green' : 'blue';
        appleCtx.fill();
    }

    update() {
        if (!this.attached) {
            const dx = appleCenterX - this.x;
            const dy = appleCenterY - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const attractionForce = electrostaticEnabled ? 0.1 : 0.000000001; // Fuerza de atracción rápida y extremadamente lenta

            this.speedX += dx / distance * attractionForce;
            this.speedY += dy / distance * attractionForce;

            this.y += this.speedY;
            this.x += this.speedX;

            if (this.isCollidingWithApple()) {
                this.attached = true;
                this.speedY = 0;
                this.speedX = 0;
            }
        }
    }

    isCollidingWithApple() {
        const dx = this.x - appleCenterX;
        const dy = this.y - appleCenterY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < appleRadius;
    }

    setSize() {
        this.size = electrostaticEnabled ? this.baseSize : this.baseSize * 7 / 3;
    }
}
