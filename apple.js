const appleRadius = 40;
const appleCenterX = appleCanvas.width / 2;
const appleCenterY = appleCanvas.height / 2;

function drawApple(ctx, x, y) {
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(x, y, appleRadius, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = 'brown';
    ctx.fillRect(x - 2, y - appleRadius - 20, 4, 20);
    
    ctx.fillStyle = 'green';
    ctx.beginPath();
    ctx.moveTo(x, y - appleRadius - 20);
    ctx.lineTo(x + 20, y - appleRadius - 40);
    ctx.lineTo(x + 10, y - appleRadius - 20);
    ctx.closePath();
    ctx.fill();
}
