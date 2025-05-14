document.addEventListener('DOMContentLoaded', function() {
    // Initialize particles.js
    particlesJS('particles-js', {
        "particles": {
            "number": {
                "value": 100,
                "density": {
                    "enable": true,
                    "value_area": 800
                }
            },
            "color": {
                "value": ["#ffffff", "#6f42ff", "#ff42a6", "#42fff2"]
            },
            "shape": {
                "type": "circle",
                "stroke": {
                    "width": 0,
                    "color": "#000000"
                }
            },
            "opacity": {
                "value": 0.5,
                "random": true,
                "anim": {
                    "enable": true,
                    "speed": 1,
                    "opacity_min": 0.1,
                    "sync": false
                }
            },
            "size": {
                "value": 3,
                "random": true,
                "anim": {
                    "enable": true,
                    "speed": 2,
                    "size_min": 0.1,
                    "sync": false
                }
            },
            "line_linked": {
                "enable": true,
                "distance": 150,
                "color": "#6f42ff",
                "opacity": 0.2,
                "width": 1
            },
            "move": {
                "enable": true,
                "speed": 1,
                "direction": "none",
                "random": true,
                "straight": false,
                "out_mode": "out",
                "bounce": false,
                "attract": {
                    "enable": true,
                    "rotateX": 600,
                    "rotateY": 1200
                }
            }
        },
        "interactivity": {
            "detect_on": "canvas",
            "events": {
                "onhover": {
                    "enable": true,
                    "mode": "grab"
                },
                "onclick": {
                    "enable": true,
                    "mode": "push"
                },
                "resize": true
            },
            "modes": {
                "grab": {
                    "distance": 140,
                    "line_linked": {
                        "opacity": 0.8
                    }
                },
                "bubble": {
                    "distance": 400,
                    "size": 40,
                    "duration": 2,
                    "opacity": 8,
                    "speed": 3
                },
                "repulse": {
                    "distance": 200,
                    "duration": 0.4
                },
                "push": {
                    "particles_nb": 4
                },
                "remove": {
                    "particles_nb": 2
                }
            }
        },
        "retina_detect": true
    });

    // Add subtle floating animation to the error code
    const errorCode = document.querySelector('.error-code');
    let direction = 1;
    let position = 0;
    
    function floatAnimation() {
        if (position > 10) direction = -1;
        if (position < 0) direction = 1;
        
        position += 0.1 * direction;
        errorCode.style.transform = `translateY(${position}px)`;
        
        requestAnimationFrame(floatAnimation);
    }
    
    floatAnimation();

    // 3D tilt effect on mousemove
    const container = document.querySelector('.container');
    
    document.addEventListener('mousemove', function(e) {
        const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
        const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
        container.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
    });
    
    // Reset transform when mouse leaves
    document.addEventListener('mouseleave', function() {
        container.style.transform = 'rotateY(0deg) rotateX(0deg)';
    });
    
    // Create a more dynamic 404 glitch effect
    const glitch = document.querySelector('.glitch');
    
    function randomGlitch() {
        const intensity = Math.random() * 10;
        const xOffset = (Math.random() - 0.5) * intensity;
        const yOffset = (Math.random() - 0.5) * intensity;
        
        glitch.style.textShadow = `
            ${xOffset}px ${yOffset}px 0 rgba(255, 0, 0, 0.7),
            ${-xOffset}px ${-yOffset}px 0 rgba(0, 255, 255, 0.7),
            ${yOffset}px ${-xOffset}px 0 rgba(0, 0, 255, 0.7)
        `;
        
        setTimeout(() => {
            glitch.style.textShadow = '';
        }, 100);
        
        // Schedule next glitch
        setTimeout(randomGlitch, Math.random() * 3000 + 1000);
    }
    
    randomGlitch();
    
    // Handle search functionality
    const searchInput = document.querySelector('.glow-input');
    const searchButton = document.querySelector('.pulse-btn');
    
    function handleSearch() {
        const query = searchInput.value.trim();
        if (query) {
            // Add quick animation before search
            searchInput.style.transform = 'scale(0.98)';
            setTimeout(() => {
                searchInput.style.transform = 'scale(1)';
                // In a real application, redirect to search results page
                alert(`Searching the cosmos for: ${query}`);
                // window.location.href = `/search?q=${encodeURIComponent(query)}`;
            }, 200);
        }
    }
    
    searchButton.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
    
    // Create shooting stars occasionally
    function createShootingStar() {
        const star = document.createElement('div');
        star.classList.add('shooting-star');
        star.style.top = `${Math.random() * 40}%`;
        star.style.left = `${Math.random() * 100}%`;
        document.body.appendChild(star);
        
        setTimeout(() => {
            star.remove();
        }, 1000);
        
        setTimeout(createShootingStar, Math.random() * 10000 + 5000);
    }
    
    createShootingStar();
    
    // Custom cursor trailer effect
    const trail = document.createElement('div');
    trail.classList.add('cursor-trail');
    document.body.appendChild(trail);
    
    document.addEventListener('mousemove', function(e) {
        trail.style.left = `${e.clientX}px`;
        trail.style.top = `${e.clientY}px`;
    });

    // Enhanced cursor effects
    const cursorFollower = document.querySelector('.cursor-follower');
    const cursorTrail = document.querySelector('.cursor-trail');
    
    document.addEventListener('mousemove', function(e) {
        // Smooth cursor follower
        gsap.to(cursorFollower, {
            duration: 0.3,
            x: e.clientX,
            y: e.clientY
        });
        
        // Instant trail
        cursorTrail.style.left = `${e.clientX}px`;
        cursorTrail.style.top = `${e.clientY}px`;
    });
    
    document.addEventListener('mousedown', function() {
        cursorFollower.style.transform = 'translate(-50%, -50%) scale(0.8)';
        cursorFollower.style.borderColor = 'var(--secondary-color)';
    });
    
    document.addEventListener('mouseup', function() {
        cursorFollower.style.transform = 'translate(-50%, -50%) scale(1)';
        cursorFollower.style.borderColor = 'var(--primary-color)';
    });
    
    // Interactive UFO
    const ufo = document.getElementById('interactive-ufo');
    const ufoBeam = ufo.querySelector('.ufo-beam');
    
    ufo.addEventListener('click', function() {
        // Make UFO beam appear and abduct the astronaut
        ufoBeam.style.opacity = '1';
        
        const astronaut = document.querySelector('.floating-astronaut');
        
        gsap.to(astronaut, {
            duration: 2,
            y: -100,
            opacity: 0,
            ease: "power2.in",
            onComplete: function() {
                // Return astronaut after a delay
                setTimeout(() => {
                    gsap.to(astronaut, {
                        duration: 2,
                        y: 0,
                        opacity: 1,
                        ease: "bounce.out"
                    });
                    ufoBeam.style.opacity = '0';
                }, 3000);
            }
        });
    });
    
    // Black hole effect
    const blackHole = document.querySelector('.black-hole');
    
    blackHole.addEventListener('mouseover', function() {
        // Create gravitational pull effect
        document.querySelectorAll('.star, .parallax-star').forEach(star => {
            gsap.to(star, {
                duration: 1,
                x: `-=${Math.random() * 20}`,
                y: `-=${Math.random() * 20}`,
                ease: "power2.in"
            });
        });
    });
    
    blackHole.addEventListener('mouseout', function() {
        // Return stars to their positions
        document.querySelectorAll('.star, .parallax-star').forEach(star => {
            gsap.to(star, {
                duration: 2,
                x: 0,
                y: 0,
                ease: "elastic.out(1, 0.3)"
            });
        });
    });
    
    // Meteor shower
    function createMeteor() {
        const meteor = document.createElement('div');
        meteor.classList.add('meteor');
        meteor.style.left = `${Math.random() * 100}%`;
        meteor.style.top = `${Math.random() * 30}%`;
        document.getElementById('meteor-container').appendChild(meteor);
        
        // Remove meteor after animation completes
        setTimeout(() => {
            meteor.remove();
        }, 2000);
    }
    
    // Create meteors periodically
    setInterval(createMeteor, 3000);
    
    // Create initial batch of meteors
    for (let i = 0; i < 3; i++) {
        setTimeout(createMeteor, i * 300);
    }
    
    // Parallax stars effect
    const starsContainer = document.getElementById('parallax-stars-container');
    const starCount = 100;
    
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.classList.add('parallax-star');
        
        // Random size
        const size = Math.random() * 3;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        
        // Random position
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        
        // Random depth (z-index and parallax strength)
        const depth = Math.random();
        star.style.opacity = depth;
        star.setAttribute('data-depth', depth);
        
        starsContainer.appendChild(star);
    }
    
    // Parallax effect on mouse move
    document.addEventListener('mousemove', function(e) {
        const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
        const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
        
        document.querySelectorAll('.parallax-star').forEach(star => {
            const depth = parseFloat(star.getAttribute('data-depth')) * 5;
            star.style.transform = `translate(${xAxis * depth}px, ${yAxis * depth}px)`;
        });
    });
    
    // Mini game functionality
    const startGameBtn = document.getElementById('start-game');
    const closeGameBtn = document.getElementById('close-game');
    const gameContainer = document.getElementById('game-container');
    const player = document.getElementById('player');
    const target = document.getElementById('target');
    const scoreElement = document.getElementById('score');
    
    let score = 0;
    let gameActive = false;
    
    startGameBtn.addEventListener('click', function() {
        gameContainer.classList.remove('hidden');
        score = 0;
        scoreElement.textContent = score;
        gameActive = true;
        
        // Set random position for target
        resetTarget();
    });
    
    closeGameBtn.addEventListener('click', function() {
        gameContainer.classList.add('hidden');
        gameActive = false;
    });
    
    function resetTarget() {
        target.style.left = `${Math.random() * 280}px`;
        target.style.top = `${Math.random() * 200 + 20}px`;
    }
    
    // Control player with keyboard
    document.addEventListener('keydown', function(e) {
        if (!gameActive) return;
        
        const playerPos = parseInt(player.style.left) || 150;
        
        if (e.key === 'ArrowLeft') {
            const newPos = Math.max(playerPos - 15, 0);
            player.style.left = `${newPos}px`;
        } else if (e.key === 'ArrowRight') {
            const newPos = Math.min(playerPos + 15, 280);
            player.style.left = `${newPos}px`;
        } else if (e.key === ' ' || e.key === 'ArrowUp') {
            shootBullet();
        }
    });
    
    function shootBullet() {
        const bullet = document.createElement('div');
        bullet.style.position = 'absolute';
        bullet.style.width = '5px';
        bullet.style.height = '10px';
        bullet.style.backgroundColor = 'white';
        bullet.style.borderRadius = '50%';
        
        const playerPos = parseInt(player.style.left) || 150;
        bullet.style.left = `${playerPos + 7.5}px`;
        bullet.style.bottom = '40px';
        
        gameContainer.appendChild(bullet);
        
        const bulletInterval = setInterval(() => {
            const bulletTop = parseInt(bullet.style.bottom) || 40;
            bullet.style.bottom = `${bulletTop + 5}px`;
            
            // Check for collision with target
            const bulletRect = bullet.getBoundingClientRect();
            const targetRect = target.getBoundingClientRect();
            
            if (
                bulletRect.left < targetRect.right &&
                bulletRect.right > targetRect.left &&
                bulletRect.top < targetRect.bottom &&
                bulletRect.bottom > targetRect.top
            ) {
                // Hit target
                score++;
                scoreElement.textContent = score;
                resetTarget();
                
                // Create explosion effect
                const explosion = document.createElement('div');
                explosion.style.position = 'absolute';
                explosion.style.width = '30px';
                explosion.style.height = '30px';
                explosion.style.borderRadius = '50%';
                explosion.style.background = 'radial-gradient(circle, white, transparent)';
                explosion.style.left = `${parseInt(target.style.left) - 7.5}px`;
                explosion.style.top = `${parseInt(target.style.top) - 7.5}px`;
                explosion.style.animation = 'fadeOut 0.5s forwards';
                gameContainer.appendChild(explosion);
                
                setTimeout(() => {
                    explosion.remove();
                }, 500);
                
                clearInterval(bulletInterval);
                bullet.remove();
            }
            
            // Remove bullet when it goes off screen
            if (bulletTop > 300) {
                clearInterval(bulletInterval);
                bullet.remove();
            }
        }, 20);
    }
    
    // Audio background
    const audioBtn = document.getElementById('toggle-audio');
    const audioIcon = document.getElementById('audio-icon');
    let audio = null;
    let audioPlaying = false;
    
    audioBtn.addEventListener('click', function() {
        if (!audio) {
            audio = new Audio('https://s3-us-west-2.amazonaws.com/s.cdpn.io/123941/Yodel_Sound_Effect.mp3');
            audio.loop = true;
            audio.volume = 0.3;
        }
        
        if (audioPlaying) {
            audio.pause();
            audioIcon.className = 'fas fa-volume-mute';
        } else {
            audio.play();
            audioIcon.className = 'fas fa-volume-up';
        }
        
        audioPlaying = !audioPlaying;
    });
    
    // Create asteroid field
    const asteroidField = document.querySelector('.asteroid-field');
    
    for (let i = 0; i < 15; i++) {
        const asteroid = document.createElement('div');
        asteroid.classList.add('asteroid');
        
        // Random size
        const size = Math.random() * 20 + 5;
        asteroid.style.width = `${size}px`;
        asteroid.style.height = `${size}px`;
        
        // Random position
        asteroid.style.left = `${Math.random() * 100}%`;
        asteroid.style.bottom = `${Math.random() * 100}px`;
        
        // Random appearance
        asteroid.style.backgroundColor = `rgba(${100 + Math.random() * 50}, ${100 + Math.random() * 50}, ${100 + Math.random() * 50}, 0.8)`;
        asteroid.style.borderRadius = '50%';
        asteroid.style.boxShadow = '0 0 5px rgba(255, 255, 255, 0.5)';
        
        // Random rotation
        const rotationSpeed = Math.random() * 10 + 5;
        asteroid.style.animation = `rotate ${rotationSpeed}s linear infinite`;
        
        asteroidField.appendChild(asteroid);
    }
    
    // Add keyframes dynamically for asteroid rotation
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        @keyframes rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        
        @keyframes fadeOut {
            from { opacity: 1; transform: scale(1); }
            to { opacity: 0; transform: scale(2); }
        }
        
        .asteroid {
            position: absolute;
            transform-style: preserve-3d;
        }
    `;
    document.head.appendChild(styleSheet);
    
    // Add 3D effect to the entire scene based on device orientation (mobile)
    if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', function(e) {
            if (!e.beta || !e.gamma) return;
            
            const tiltX = e.beta / 5; // Convert to a reasonable range
            const tiltY = e.gamma / 5;
            
            document.querySelector('.container').style.transform = 
                `perspective(1000px) rotateX(${-tiltX}deg) rotateY(${tiltY}deg)`;
        });
    }
});

// Add CSS for elements created in JS
const style = document.createElement('style');
style.textContent = `
    .shooting-star {
        position: fixed;
        width: 2px;
        height: 2px;
        background: white;
        border-radius: 50%;
        animation: shooting 1s linear;
        z-index: -1;
    }
    
    .cursor-trail {
        position: fixed;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(111,66,255,0.5) 0%, rgba(111,66,255,0) 70%);
        pointer-events: none;
        transform: translate(-50%, -50%);
        z-index: 9999;
        transition: transform 0.1s ease-out;
    }
    
    @keyframes shooting {
        0% {
            transform: translate(0, 0) rotate(-45deg) scale(1);
            opacity: 1;
            box-shadow: 0 0 5px white, 0 0 10px white;
        }
        100% {
            transform: translate(200px, 200px) rotate(-45deg) scale(0.1);
            opacity: 0;
            box-shadow: 0 0 20px white, 0 0 40px white;
        }
    }
`;
document.head.appendChild(style);
