const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const electrostaticOnButton = document.getElementById('electrostaticOnButton');
const electrostaticOffButton = document.getElementById('electrostaticOffButton');
const particleSizeCanvas = document.getElementById('particleSizeCanvas');
const particleSizeCtx = particleSizeCanvas.getContext('2d');
const appleCanvas = document.getElementById('appleCanvas');
const appleCtx = appleCanvas.getContext('2d');

let particles = [];
let oscillatingParticles = [];
let attractedParticles = [];
let spraying = false;
let electrostaticEnabled = false;
let oscillationRange = 3;

const appleRadius = 20;
const appleCenterX = appleCanvas.width / 2;
const appleCenterY = appleCanvas.height / 2 + 20;

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
        ctx.fillStyle = 'skyblue';
        ctx.fill();
    }

    update() {
        this.y += this.speedY;
        this.x += this.speedX;
    }
}

class OscillatingParticle {
    constructor(x, y, size, speed) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.speed = speed;
        this.angle = Math.random() * 2 * Math.PI;
    }

    draw() {
        particleSizeCtx.beginPath();
        particleSizeCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        particleSizeCtx.fillStyle = 'skyblue';
        particleSizeCtx.fill();
    }

    update() {
        this.angle += this.speed;
        this.y = (particleSizeCanvas.height / 2) + Math.sin(this.angle) * oscillationRange;
    }
}

class FallingParticle {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.speedY = Math.random() * 2 + 1;
        this.speedX = Math.random() * 2 - 1;
        this.attached = false;
    }

    draw() {
        appleCtx.beginPath();
        appleCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        appleCtx.fillStyle = this.attached ? 'green' : 'skyblue';
        appleCtx.fill();
    }

    update() {
        if (!this.attached) {
            if (electrostaticEnabled) {
                const dx = appleCenterX - this.x;
                const dy = appleCenterY - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const attractionForce = 0.5; // Adjust this value to increase or decrease the attraction force
                this.speedX += dx / distance * attractionForce;
                this.speedY += dy / distance * attractionForce;
            }
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
}

function drawSprayer() {
    ctx.fillStyle = 'skyblue';
    ctx.fillRect(canvas.width / 2 - 15, 10, 30, 100);
    ctx.fillStyle = 'black';
    ctx.fillRect(canvas.width / 2 - 10, 0, 20, 20);
    ctx.fillRect(canvas.width / 2 - 5, 0, 10, 30);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2 - 15, 110);
    ctx.lineTo(canvas.width / 2 + 15, 110);
    ctx.lineTo(canvas.width / 2, 130);
    ctx.closePath();
    ctx.fillStyle = 'skyblue';
    ctx.fill();
}

function drawVoltageSource() {
    if (!electrostaticEnabled) return;
    const voltageX = canvas.width / 4;
    const voltageY = canvas.height / 2;
    ctx.fillStyle = 'red';
    ctx.fillRect(voltageX - 20, voltageY - 30, 40, 60);
    ctx.fillStyle = 'black';
    ctx.font = '16px Arial';
    ctx.fillText('+', voltageX - 15, voltageY - 10);
    ctx.fillText('-', voltageX - 15, voltageY + 20);
    ctx.fillText('V', voltageX - 5, voltageY + 5);
    drawVoltageConnections(voltageX, voltageY);
}

function drawVoltageConnections(voltageX, voltageY) {
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(voltageX, voltageY - 30);
    ctx.lineTo(voltageX, 130);
    ctx.lineTo(canvas.width / 2, 130);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(voltageX, voltageY + 30);
    ctx.lineTo(voltageX, canvas.height - 30);
    ctx.lineTo(canvas.width / 2, canvas.height - 30);
    ctx.lineTo(canvas.width / 2, canvas.height - 45);
    ctx.stroke();
}

function drawMetalPlate() {
    const plateWidth = canvas.width * 0.3;
    const plateHeight = 30;
    const plateX = (canvas.width - plateWidth) / 2;
    const plateY = canvas.height - plateHeight;
    ctx.fillStyle = electrostaticEnabled ? 'lightgreen' : 'gray';
    ctx.fillRect(plateX, plateY, plateWidth, plateHeight);
    drawApple(ctx, plateX + plateWidth / 2, plateY);
    if (electrostaticEnabled) drawGroundCable(plateX, plateY, plateWidth, plateHeight);
}

function drawGroundCable(x, y, width, height) {
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + width, y + height / 2);
    ctx.lineTo(x + width + 20, y + height / 2);
    ctx.lineTo(x + width + 20, y + height + 20);
    ctx.lineTo(x + width + 10, y + height + 20);
    ctx.lineTo(x + width + 20, y + height + 30);
    ctx.lineTo(x + width + 30, y + height + 20);
    ctx.lineTo(x + width + 20, y + height + 20);
    ctx.stroke();
}

function drawApple(ctx, x, y) {
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(x, y - 20, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'brown';
    ctx.fillRect(x - 2, y - 50, 4, 10);
    ctx.fillStyle = 'green';
    ctx.beginPath();
    ctx.moveTo(x, y - 45);
    ctx.lineTo(x + 10, y - 55);
    ctx.lineTo(x + 5, y - 45);
    ctx.closePath();
    ctx.fill();
}

function drawParticles() {
    particles.forEach((particle, index) => {
        if (particle.y > canvas.height) {
            particles.splice(index, 1);
        }
        particle.update();
        particle.draw();
    });
}

function createParticles() {
    if (spraying) {
        particles.push(new Particle(canvas.width / 2, 130));
    }
}

function createOscillatingParticles() {
    for (let i = 0; i < 5; i++) {
        const x = Math.random() * particleSizeCanvas.width;
        const y = particleSizeCanvas.height / 2;
        const size = (electrostaticEnabled ? 1 : 3) * 3;
        const speed = Math.random() * 0.1 + 0.02;
        oscillatingParticles.push(new OscillatingParticle(x, y, size, speed));
    }
}

function createFallingParticle() {
    const x = Math.random() * appleCanvas.width;
    const y = Math.random() * -appleCanvas.height;
    const size = electrostaticEnabled ? 1 : 3;
    attractedParticles.push(new FallingParticle(x, y, size));
}

function drawParticleSizeIndicator() {
    particleSizeCtx.clearRect(0, 0, particleSizeCanvas.width, particleSizeCanvas.height);
    particleSizeCtx.fillStyle = 'white';
    particleSizeCtx.fillRect(0, 0, particleSizeCanvas.width, particleSizeCanvas.height);
    particleSizeCtx.strokeStyle = 'black';
    particleSizeCtx.lineWidth = 2;
    particleSizeCtx.strokeRect(0, 0, particleSizeCanvas.width, particleSizeCanvas.height);

    if (spraying) {
        oscillatingParticles.forEach(particle => {
            particle.update();
            particle.draw();
        });
    }
}

function drawAppleCanvas() {
    appleCtx.clearRect(0, 0, appleCanvas.width, appleCanvas.height);
    drawApple(appleCtx, appleCanvas.width / 2, appleCanvas.height / 2 + 20);

    attractedParticles.forEach((particle, index) => {
        if (particle.y > appleCanvas.height) {
            attractedParticles.splice(index, 1);
        }
        particle.update();
        particle.draw();
    });
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSprayer();
    drawVoltageSource();
    drawMetalPlate();
    if (spraying) {
        drawParticles();
        createParticles();
        createFallingParticle();
    }
    drawParticleSizeIndicator();
    drawAppleCanvas();
    requestAnimationFrame(animate);
}

startButton.addEventListener('click', () => {
    spraying = true;
    particles = [];  // Reset particles when starting
    attractedParticles = [];  // Reset attracted particles when starting
});
stopButton.addEventListener('click', () => {
    spraying = false;
});
electrostaticOnButton.addEventListener('click', () => {
    electrostaticEnabled = true;
    oscillatingParticles.forEach(particle => particle.size = 3);
    attractedParticles.forEach(particle => particle.size = 1);
});
electrostaticOffButton.addEventListener('click', () => {
    electrostaticEnabled = false;
    oscillatingParticles.forEach(particle => particle.size = 9);
    attractedParticles.forEach(particle => particle.size = 3);
});

createOscillatingParticles();

animate();
