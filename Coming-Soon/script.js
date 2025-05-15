document.addEventListener('DOMContentLoaded', function() {
    // Preloader
    window.addEventListener('load', function() {
        const preloader = document.querySelector('.preloader');
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 700);
        }, 1000);
    });

    // Set the launch date (30 days from now)
    const launchDate = new Date();
    launchDate.setDate(launchDate.getDate() + 30);
    
    // Update the countdown every second
    const countdown = setInterval(function() {
        const now = new Date().getTime();
        const distance = launchDate - now;
        
        // Calculate days, hours, minutes, and seconds
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // Display the results with animation
        updateCounter('days', days);
        updateCounter('hours', hours);
        updateCounter('minutes', minutes);
        updateCounter('seconds', seconds);
        
        // If the countdown is over, display a message
        if (distance < 0) {
            clearInterval(countdown);
            document.querySelector('.countdown').innerHTML = "<h2 class='animate__animated animate__fadeIn'>We've Launched!</h2>";
        }
    }, 1000);

    // Function to update counter with animation
    function updateCounter(id, value) {
        const element = document.getElementById(id);
        const current = parseInt(element.textContent);
        
        if (current !== value) {
            element.classList.add('animate__animated', 'animate__fadeOutDown');
            
            setTimeout(() => {
                element.textContent = value.toString().padStart(2, '0');
                element.classList.remove('animate__fadeOutDown');
                element.classList.add('animate__fadeInUp');
                
                setTimeout(() => {
                    element.classList.remove('animate__animated', 'animate__fadeInUp');
                }, 500);
            }, 500);
        }
    }
    
    // Handle subscription form submission
    document.getElementById('subscription-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const emailInput = this.querySelector('input[type="email"]');
        const email = emailInput.value;
        const successMessage = this.querySelector('.success-message');
        
        // Simulate form submission (replace with actual API call)
        emailInput.disabled = true;
        this.querySelector('button').disabled = true;
        
        // Show success message with animation
        setTimeout(() => {
            successMessage.style.display = 'block';
            successMessage.classList.add('animate__animated', 'animate__fadeIn');
            
            // Reset form after delay
            setTimeout(() => {
                emailInput.value = '';
                emailInput.disabled = false;
                this.querySelector('button').disabled = false;
                successMessage.classList.add('animate__fadeOut');
                
                setTimeout(() => {
                    successMessage.style.display = 'none';
                    successMessage.classList.remove('animate__animated', 'animate__fadeIn', 'animate__fadeOut');
                }, 500);
            }, 3000);
        }, 1500);
    });
    
    // Initialize Typed.js
    new Typed('.typing', {
        strings: ['extraordinary.', 'amazing.', 'innovative.', 'game-changing.'],
        typeSpeed: 70,
        backSpeed: 40,
        backDelay: 1500,
        startDelay: 800,
        loop: true
    });
    
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
                "value": ["#FF3CAC", "#784BA0", "#2B86C5"]
            },
            "shape": {
                "type": "circle",
                "stroke": {
                    "width": 0,
                    "color": "#000000"
                },
                "polygon": {
                    "nb_sides": 5
                }
            },
            "opacity": {
                "value": 0.5,
                "random": true,
                "anim": {
                    "enable": false,
                    "speed": 1,
                    "opacity_min": 0.1,
                    "sync": false
                }
            },
            "size": {
                "value": 3,
                "random": true,
                "anim": {
                    "enable": false,
                    "speed": 40,
                    "size_min": 0.1,
                    "sync": false
                }
            },
            "line_linked": {
                "enable": true,
                "distance": 150,
                "color": "#ffffff",
                "opacity": 0.2,
                "width": 1
            },
            "move": {
                "enable": true,
                "speed": 2,
                "direction": "none",
                "random": false,
                "straight": false,
                "out_mode": "out",
                "bounce": false,
                "attract": {
                    "enable": false,
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
                        "opacity": 1
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
    
    // Parallax effect on mouse move
    document.addEventListener('mousemove', function(e) {
        const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
        const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
        
        const header = document.querySelector('header');
        const countdown = document.querySelector('.countdown');
        const subscription = document.querySelector('.subscription');
        
        header.style.transform = `translate(${moveX * -2}px, ${moveY * -2}px)`;
        countdown.style.transform = `translate(${moveX}px, ${moveY}px)`;
        subscription.style.transform = `translate(${moveX * 1.5}px, ${moveY * 1.5}px)`;
    });
});
