const canvas = document.getElementById('cursor-canvas');
const ctx = canvas.getContext('2d');

let particles = [];

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
    this.size = Math.random() * 5 + 5; 
    this.life = 120;
    this.angle = Math.random() * Math.PI * 2; 
    this.speed = 0.3 + Math.random() * 0.5; 
    this.alpha = 1;
  }

  update() {
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;

    this.angle += 0.05 * (Math.sin(this.life * 0.1)); 

    this.size *= 0.97;
    this.alpha -= 0.008;
    this.life--;

    if (this.alpha < 0) this.alpha = 0;
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = `#ffffff`; 
    ctx.beginPath();
    ctx.ellipse(this.x - this.size / 2, this.y, this.size / 2, this.size, 0, 0, Math.PI * 2);
    ctx.ellipse(this.x + this.size / 2, this.y, this.size / 2, this.size, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

window.addEventListener('mousemove', (e) => {
  for(let i = 0; i < 2; i++) {
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