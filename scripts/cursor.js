const canvas = document.getElementById('cursor-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
let moveCount = 0; // to throttle particle creation

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 6 + 6;
    this.life = 300; // lasts longer
    this.angle = Math.random() * Math.PI * 2;
    this.speed = 0.05 + Math.random() * 0.1; // very slow
    this.alpha = 1;
  }

  update() {
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;

    this.angle += 0.02 * Math.sin(this.life * 0.05);

    this.size *= 0.99;
    this.alpha -= 0.002; // very slow fade
    this.life--;

    if (this.alpha < 0) this.alpha = 0;
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)"; // Starry white
    ctx.shadowColor = "rgba(200, 200, 255, 0.5)";
    ctx.shadowBlur = 4;

    ctx.beginPath();
    ctx.ellipse(this.x - this.size / 2, this.y, this.size / 2, this.size, 0, 0, Math.PI * 2);
    ctx.ellipse(this.x + this.size / 2, this.y, this.size / 2, this.size, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

window.addEventListener('mousemove', (e) => {
  moveCount++;
  if (moveCount % 3 === 0) { // only emit every 3rd movement event
    particles.push(new Particle(e.clientX, e.clientY));
  }
});

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.update();
    p.draw();

    if (p.life <= 0 || p.alpha <= 0) {
      particles.splice(i, 1);
    }
  }

  requestAnimationFrame(animate);
}

animate();
