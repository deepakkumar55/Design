class Confetti {
  constructor() {
    this.container = document.getElementById('confetti');
    this.particleCount = 100;
    this.colors = [
      '#9CCC65', // light green
      '#4CAF50', // green
      '#FF7043', // orange
      '#FFEB3B', // yellow
      '#E0F2F1', // light cyan
    ];
    this.particles = [];
  }

  init() {
    // Clear any existing particles
    this.container.innerHTML = '';
    this.particles = [];

    for (let i = 0; i < this.particleCount; i++) {
      this.createParticle();
    }

    // Start animation
    this.animate();

    // Auto-remove confetti after 4 seconds
    setTimeout(() => {
      this.stop();
    }, 4000);
  }

  createParticle() {
    const particle = document.createElement('div');
    
    // Random size
    const size = Math.random() * 10 + 5;
    
    // Random position
    const x = Math.random() * 100; // percent
    const y = -20 - Math.random() * 10; // start above the container
    
    // Random color
    const color = this.colors[Math.floor(Math.random() * this.colors.length)];
    
    // Random rotation
    const rotation = Math.random() * 360;
    
    // Random shape (circle, square, triangle)
    const shapes = ['circle', 'square', 'triangle'];
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    
    // Set styling
    particle.style.position = 'absolute';
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${x}%`;
    particle.style.top = `${y}%`;
    particle.style.backgroundColor = color;
    particle.style.transform = `rotate(${rotation}deg)`;
    particle.style.opacity = Math.random() * 0.5 + 0.5;
    
    if (shape === 'circle') {
      particle.style.borderRadius = '50%';
    } else if (shape === 'triangle') {
      particle.style.width = '0';
      particle.style.height = '0';
      particle.style.borderLeft = `${size/2}px solid transparent`;
      particle.style.borderRight = `${size/2}px solid transparent`;
      particle.style.borderBottom = `${size}px solid ${color}`;
      particle.style.backgroundColor = 'transparent';
    }
    
    // Add some physics properties
    const physics = {
      x: x,
      y: y,
      vx: Math.random() * 2 - 1, // velocity x (-1 to 1)
      vy: Math.random() * 2 + 1,  // velocity y (1 to 3)
      gravity: 0.05 + Math.random() * 0.05,
      rotation: rotation,
      rotationSpeed: Math.random() * 2 - 1, // rotation speed
    };
    
    this.container.appendChild(particle);
    this.particles.push({ element: particle, physics: physics });
  }

  animate() {
    if (this.particles.length === 0) return;

    this.animationId = requestAnimationFrame(() => this.animate());
    
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      
      // Update position
      p.physics.x += p.physics.vx;
      p.physics.y += p.physics.vy;
      p.physics.vy += p.physics.gravity;
      
      // Update rotation
      p.physics.rotation += p.physics.rotationSpeed;
      
      // Apply updates to DOM
      p.element.style.left = `${p.physics.x}%`;
      p.element.style.top = `${p.physics.y}%`;
      p.element.style.transform = `rotate(${p.physics.rotation}deg)`;
      
      // Remove particles that are off-screen
      if (p.physics.y > 120) {
        this.container.removeChild(p.element);
        this.particles.splice(i, 1);
        i--;
      }
    }
  }

  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    
    // Fade out remaining particles
    this.particles.forEach(p => {
      p.element.style.transition = 'opacity 1s';
      p.element.style.opacity = '0';
    });
    
    // Clean up after fade
    setTimeout(() => {
      if (this.container) {
        this.container.innerHTML = '';
      }
      this.particles = [];
    }, 1000);
  }
}

// Global confetti instance
const confettiEffect = new Confetti();
