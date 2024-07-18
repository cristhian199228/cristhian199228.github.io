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
const appleSurfaceCanvas = document.getElementById('appleSurfaceCanvas');
const appleSurfaceCtx = appleSurfaceCanvas.getContext('2d');

let particles = [];
let oscillatingParticles = [];
let attractedParticles = [];
let spraying = false;
let electrostaticEnabled = false;
let oscillationRange = 3;
const particleSpacing = 10;
const particleSize = 3;

const staticGaps = generateStaticGaps();

function generateStaticGaps() {
    const gaps = [];
    const radius = appleSurfaceCanvas.width;
    const gapProbability = 0.3; // Ajustar la probabilidad de vacíos para la matriz estática
    for (let y = particleSpacing; y < radius; y += particleSpacing) {
        for (let x = particleSpacing; x < appleSurfaceCanvas.width + 1; x += particleSpacing) {
            const distance = Math.sqrt((x - radius) ** 2 + (y - radius) ** 2);
            if (distance < radius && Math.random() < gapProbability) {
                gaps.push({ x, y });
            }
        }
    }
    return gaps;
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
    drawApple(ctx, plateX + plateWidth / 2, plateY - appleRadius);
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

function drawGallon() {
    const gallonWidth = 30;
    const gallonHeight = 50;
    const plateWidth = canvas.width * 0.3;
    const plateHeight = 30;
    const plateX = (canvas.width - plateWidth) / 2;
    const plateY = canvas.height - plateHeight;
    const gallonColor = 'green';

    if (electrostaticEnabled) {
        const gallonX = plateX + plateWidth + 20;
        const gallonY = plateY - gallonHeight;
        drawSingleGallon(gallonX, gallonY, gallonWidth, gallonHeight, gallonColor);
    } else {
        for (let i = 0; i < 3; i++) {
            const gallonX = plateX + plateWidth + 20 + i * (gallonWidth + 10);
            const gallonY = plateY - gallonHeight;
            drawSingleGallon(gallonX, gallonY, gallonWidth, gallonHeight, gallonColor);
        }
    }
}

function drawSingleGallon(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);

    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(x + width / 2, y, 10, 0, Math.PI, true);
    ctx.closePath();
    ctx.fill();
}

function drawAppleSurfaceCanvas() {
    appleSurfaceCtx.clearRect(0, 0, appleSurfaceCanvas.width, appleSurfaceCanvas.height);
    
    // Dibujar semicírculo rojo
    const radius = appleSurfaceCanvas.width * 1.2;
    appleSurfaceCtx.fillStyle = 'red';
    appleSurfaceCtx.beginPath();
    appleSurfaceCtx.arc(radius, radius, radius, Math.PI, 0); // Dibujar semicírculo
    appleSurfaceCtx.closePath();
    appleSurfaceCtx.fill();
    
    // Dibujar partículas adheridas al semicírculo solo si el rociador está activado
    if (spraying) {
        drawParticlesOnAppleSurface();
    }
}

function drawParticlesOnAppleSurface() {
    const radius = appleSurfaceCanvas.width;

    for (let y = particleSpacing; y < radius; y += particleSpacing) {
        for (let x = particleSpacing; x < appleSurfaceCanvas.width + 1; x += particleSpacing) {
            const distance = Math.sqrt((x - radius) ** 2 + (y - radius) ** 2);
            if (distance < radius) {
                const hasGap = staticGaps.some(gap => gap.x === x && gap.y === y);
                if (!electrostaticEnabled && hasGap) {
                    continue; // Skip this position if it should be a gap when electrostatic is off
                }
                appleSurfaceCtx.fillStyle = 'skyblue';
                appleSurfaceCtx.beginPath();
                appleSurfaceCtx.arc(x, y, particleSize, 1, Math.PI * 5);
                appleSurfaceCtx.fill();
            }
        }
    }
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
        const size = electrostaticEnabled ? 3 : 7;
        const speed = Math.random() * 0.1 + 0.02;
        oscillatingParticles.push(new OscillatingParticle(x, y, size, speed));
    }
}

function createFallingParticle() {
    const x = Math.random() * appleCanvas.width;
    const y = Math.random() * -appleCanvas.height;
    const size = electrostaticEnabled ? 3 : 7;
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
    drawApple(appleCtx, appleCenterX, appleCenterY);

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
    drawGallon();  // Llamar a la función para dibujar la galonera
    if (spraying) {
        drawParticles();
        createParticles();
        createFallingParticle();
    }
    drawParticleSizeIndicator();
    drawAppleCanvas();
    drawAppleSurfaceCanvas();
    requestAnimationFrame(animate);
}

startButton.addEventListener('click', () => {
    spraying = true;
    particles = []; 
    attractedParticles = []; 
});

stopButton.addEventListener('click', () => {
    spraying = false;
});

electrostaticOnButton.addEventListener('click', () => {
    electrostaticEnabled = true;
    oscillatingParticles.forEach(particle => particle.setSize());
    attractedParticles.forEach(particle => particle.setSize());
});

electrostaticOffButton.addEventListener('click', () => {
    electrostaticEnabled = false;
    oscillatingParticles.forEach(particle => particle.setSize());
    attractedParticles.forEach(particle => particle.setSize());
});

createOscillatingParticles();
animate();
