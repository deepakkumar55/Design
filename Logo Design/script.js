// TheCampusCoders Logo Interaction Script

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Logo elements
    const logo = document.querySelector('.logo');
    const logoBg = document.querySelector('.logo-bg');
    const circleBorder = document.querySelector('.circle-border');
    const leftBracket = document.querySelector('.left-bracket');
    const rightBracket = document.querySelector('.right-bracket');
    const logoElements = document.querySelector('.logo-elements');
    
    // Text elements
    const title = document.querySelector('.title');
    const tagline = document.querySelector('.tagline');
    
    // Initialize GSAP if available (for smoother animations)
    if (window.gsap) {
        initGSAPAnimations();
    }
    
    // Add mouse move parallax effect
    document.addEventListener('mousemove', function(e) {
        const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
        const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
        
        logoElements.style.transform = `translateX(${xAxis}px) translateY(${yAxis}px) rotate(${xAxis/5}deg)`;
    });
    
    // Add interactive hover effects
    logoBg.addEventListener('mouseenter', function() {
        circleBorder.style.stroke = '#ffcc00';
        leftBracket.style.stroke = '#0088ff';
        rightBracket.style.stroke = '#0088ff';
        
        // Add subtle rotation
        logo.style.transform = 'scale(1.05) rotate(3deg)';
        
        // Create particles effect
        createParticles();
    });
    
    logoBg.addEventListener('mouseleave', function() {
        circleBorder.style.stroke = '#ffffff';
        leftBracket.style.stroke = '#ffffff';
        rightBracket.style.stroke = '#ffffff';
        
        // Reset transform
        logo.style.transform = 'scale(1) rotate(0deg)';
    });
    
    // Create a dynamic matrix-style code rain background
    createCodeRainCanvas();
    
    // Create floating code particles
    function createParticles() {
        const particles = ['<', '>', '{', '}', '/', '*'];
        const container = document.querySelector('.logo-bg');
        
        for (let i = 0; i < 10; i++) {
            const particle = document.createElement('span');
            particle.className = 'code-particle';
            particle.textContent = particles[Math.floor(Math.random() * particles.length)];
            particle.style.position = 'absolute';
            particle.style.color = Math.random() > 0.5 ? '#0088ff' : '#ffffff';
            particle.style.fontSize = `${Math.random() * 16 + 8}px`;
            particle.style.opacity = '0';
            particle.style.top = `${Math.random() * 100}%`;
            particle.style.left = `${Math.random() * 100}%`;
            container.appendChild(particle);
            
            // Animate particle
            setTimeout(() => {
                particle.style.transition = 'all 1.5s ease-out';
                particle.style.opacity = '0.8';
                particle.style.transform = `translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) scale(${Math.random() + 0.5})`;
                
                setTimeout(() => {
                    particle.remove();
                }, 1500);
            }, i * 100);
        }
    }
    
    // Create Matrix-style code rain effect
    function createCodeRainCanvas() {
        const codeRainElement = document.querySelector('.code-rain');
        
        // Only create if browser supports canvas
        if (window.HTMLCanvasElement && codeRainElement) {
            const canvas = document.createElement('canvas');
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            canvas.style.position = 'absolute';
            canvas.style.top = '0';
            canvas.style.left = '0';
            canvas.style.opacity = '0.15';
            codeRainElement.appendChild(canvas);
            
            const ctx = canvas.getContext('2d');
            
            // Matrix code characters
            const chars = '0123456789ABCDEF<>{}[]/\\=+-*&^%$#@!';
            const fontSize = 14;
            const columns = canvas.width / fontSize;
            
            // Array for drops - one per column
            const drops = [];
            
            // Initialize drops
            for (let i = 0; i < columns; i++) {
                drops[i] = Math.floor(Math.random() * canvas.height);
            }
            
            // Animation function
            function draw() {
                // Black BG for the canvas, transparent with opacity
                ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                ctx.fillStyle = '#0088ff'; // Blue text
                ctx.font = `${fontSize}px monospace`;
                
                for (let i = 0; i < drops.length; i++) {
                    // Random character to print
                    const text = chars[Math.floor(Math.random() * chars.length)];
                    
                    // x = i * fontSize, y = value of drops[i]
                    ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                    
                    // Randomly reset the drop back to the top row
                    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                        drops[i] = 0;
                    }
                    
                    // Move drop down
                    drops[i]++;
                }
            }
            
            // Run animation at 30fps
            setInterval(draw, 33);
        }
    }
    
    // Advanced GSAP animations if available
    function initGSAPAnimations() {
        // Timeline for initial loading animation
        const tl = gsap.timeline();
        
        tl.from(circleBorder, {
            strokeDashoffset: 2400,
            duration: 2,
            ease: "power2.out"
        })
        .from([leftBracket, rightBracket], {
            strokeDashoffset: 800,
            duration: 1.5,
            stagger: 0.3,
            ease: "power2.out"
        }, "-=1")
        .from('.cap-base, .cap-slash, .tassel, .tassel-end, .notch', {
            opacity: 0,
            scale: 0.8,
            duration: 1,
            stagger: 0.2,
            ease: "back.out(1.7)"
        }, "-=0.5")
        .from('.text-content', {
            y: 30,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        });
        
        // Create a subtle hover effect
        gsap.to(logoElements, {
            y: -10,
            duration: 3,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    }
    
    // Handle window resize
    window.addEventListener('resize', function() {
        const canvas = document.querySelector('.code-rain canvas');
        if (canvas) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
    });
});
