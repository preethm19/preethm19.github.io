// Setup device pixel ratio for high-DPI mobile devices
const dpr = window.devicePixelRatio || 1;

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Set canvas dimensions based on device pixel ratio
canvas.width = window.innerWidth * dpr;
canvas.height = window.innerHeight * dpr;
canvas.style.width = window.innerWidth + "px";
canvas.style.height = window.innerHeight + "px";
ctx.scale(dpr, dpr);

// Disable tap highlight on mobile
document.body.style.webkitTapHighlightColor = "transparent";

let particlesArray = [];
const numParticles = 100;
const maxDistance = 150; // Connection distance for longer lines

// Mouse and touch position tracking
let mouse = { x: null, y: null };

// Track mouse movement
window.addEventListener("mousemove", (event) => {
  mouse.x = event.x;
  mouse.y = event.y;
});

// Track touch movement
window.addEventListener("touchmove", (event) => {
  const touch = event.touches[0];
  mouse.x = touch.clientX;
  mouse.y = touch.clientY;
});

// Click and touch effect: Add extra temporary particles
function addTemporaryParticles(x, y) {
  const exitAngle = Math.random() * Math.PI * 2;
  for (let i = 0; i < 10; i++) {
    particlesArray.push(new Particle(x, y, true, exitAngle));
  }
}

window.addEventListener("click", (event) => {
  addTemporaryParticles(event.clientX, event.clientY);
});

window.addEventListener("touchstart", (event) => {
  const touch = event.touches[0];
  addTemporaryParticles(touch.clientX, touch.clientY);
});

class Particle {
  constructor(x, y, isTemporary = false, exitAngle = null) {
    this.x = x || Math.random() * canvas.width;
    this.y = y || Math.random() * canvas.height;
    this.size = Math.random() * 9 + 3;
    this.speedX = (Math.random() * 2 - 1) * 2.0;
    this.speedY = (Math.random() * 2 - 1) * 2.0;
    this.opacity = 0.4;
    this.isTemporary = isTemporary;
    this.exitAngle = exitAngle;
    this.toRemove = false;

    // 🎯 Updated to Cyan Blue
    this.baseColor = isTemporary ? "0, 225, 255" : "0, 225, 255";

    if (this.isTemporary) {
      this.opacity = 1.0;
      this.size = Math.random() * 15 + 7;
      gsap.to(this, { size: 4.5, opacity: 0.5, duration: 0.7 });
      let distance = Math.max(canvas.width, canvas.height) * 1.2;
      let targetX = this.x + Math.cos(this.exitAngle) * distance;
      let targetY = this.y + Math.sin(this.exitAngle) * distance;
      gsap.to(this, {
        x: targetX,
        y: targetY,
        duration: 1.0,
        ease: "power2.in",
        delay: 0.7,
        onComplete: () => {
          this.toRemove = true;
        }
      });
    }
  }

  update() {
    if (!this.isTemporary) {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
      if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }
  }

  draw() {
    ctx.fillStyle = `rgba(${this.baseColor}, ${this.opacity})`;
    ctx.shadowBlur = 12; 
    ctx.shadowColor = `rgba(${this.baseColor}, 0.5)`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

for (let i = 0; i < numParticles; i++) {
  particlesArray.push(new Particle());
}

function animateParticles() {
  particlesArray = particlesArray.filter(p => !p.isTemporary || !p.toRemove);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particlesArray.forEach(particle => {
    particle.update();
    particle.draw();
  });
  requestAnimationFrame(animateParticles);
}

animateParticles();
