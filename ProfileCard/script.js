document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const themeToggle = document.querySelector('.theme-toggle');
    const contactBtn = document.querySelector('.contact-btn');
    const downloadBtn = document.querySelector('.download-btn');
    const contactFormContainer = document.querySelector('.contact-form-container');
    const closeBtn = document.querySelector('.close-btn');
    const contactForm = document.getElementById('contact-form');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    const skillBars = document.querySelectorAll('.progress-bar');
    const projectCards = document.querySelectorAll('.project-card');
    
    // Set percentages as data attributes for skill bars
    skillBars.forEach(bar => {
        const width = bar.style.width;
        bar.setAttribute('data-percent', width);
    });
    
    // Testimonial slider functionality
    initTestimonialSlider();
    
    // CTA button functionality
    const ctaBtn = document.querySelector('.cta-btn');
    if (ctaBtn) {
        ctaBtn.addEventListener('click', () => {
            contactFormContainer.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    
    // Improved project card hover effects with better performance
    function setupProjectCardEffects() {
        if (!projectCards.length) return;
        
        // Pre-cache all cards to avoid repeated DOM queries
        const allCards = Array.from(projectCards);
        
        projectCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                // Highlight current card and dim others
                card.classList.add('card-focus');
                
                // Get other cards efficiently using the cached array
                const otherCards = allCards.filter(c => c !== card);
                otherCards.forEach(c => c.classList.add('card-dimmed'));
            });
            
            card.addEventListener('mouseleave', () => {
                // Remove all effect classes on mouseleave
                card.classList.remove('card-focus');
                allCards.forEach(c => c.classList.remove('card-dimmed'));
            });
        });
    }
    
    setupProjectCardEffects();
    
    // Add typing effect to bio text
    const bioElement = document.querySelector('.bio');
    if (bioElement) {
        const originalText = bioElement.textContent;
        typeWriterEffect(bioElement, originalText);
    }
    
    // Theme Toggling
    function initTheme() {
        const savedTheme = localStorage.getItem('theme');
        const themeIcon = themeToggle.querySelector('i');
        
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
            themeIcon.classList.replace('fa-moon', 'fa-sun');
        }
    }
    
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        const themeIcon = themeToggle.querySelector('i');
        
        if (document.body.classList.contains('dark-theme')) {
            themeIcon.classList.replace('fa-moon', 'fa-sun');
            localStorage.setItem('theme', 'dark');
        } else {
            themeIcon.classList.replace('fa-sun', 'fa-moon');
            localStorage.setItem('theme', 'light');
        }
    });
    
    // Tabs Functionality
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active class to current button
            button.classList.add('active');
            
            // Get the corresponding tab pane and activate it
            const targetTab = button.getAttribute('data-tab');
            document.getElementById(targetTab).classList.add('active');
            
            // If skills tab is activated, animate the skill bars
            if (targetTab === 'skills') {
                animateSkillBars();
            }
        });
    });
    
    // Contact Form Modal
    contactBtn.addEventListener('click', () => {
        contactFormContainer.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
    });
    
    function closeModal() {
        contactFormContainer.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    closeBtn.addEventListener('click', closeModal);
    
    // Close modal when clicking outside the form
    contactFormContainer.addEventListener('click', (e) => {
        if (e.target === contactFormContainer) {
            closeModal();
        }
    });
    
    // Also close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && contactFormContainer.classList.contains('active')) {
            closeModal();
        }
    });
    
    // Handle form submission
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const formDataObject = {};
        
        formData.forEach((value, key) => {
            formDataObject[key] = value;
        });
        
        // Simulate form submission (in a real app, this would be an AJAX call)
        console.log('Form data:', formDataObject);
        
        // Show success message
        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
        submitBtn.style.backgroundColor = 'var(--success-color)';
        submitBtn.disabled = true;
        
        // Reset form after delay
        setTimeout(() => {
            contactForm.reset();
            closeModal();
            
            // Reset button
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.style.backgroundColor = '';
                submitBtn.disabled = false;
            }, 500);
        }, 2000);
    });
    
    // Handle resume download
    downloadBtn.addEventListener('click', () => {
        // In a real application, this would link to an actual resume file
        // For demo purposes, show an alert
        alert('Resume download feature would be implemented here!');
        
        // Example of actual implementation:
        // const resumeUrl = './assets/deepak_resume.pdf';
        // window.open(resumeUrl, '_blank');
    });
    
    // Animate skill bars
    function animateSkillBars() {
        skillBars.forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0';
            
            // Force reflow
            void bar.offsetWidth;
            
            // Set the CSS variable that the animation will use
            bar.style.setProperty('--width', width);
            
            // Reset the class to trigger animation
            bar.classList.remove('animate');
            void bar.offsetWidth; // Force reflow
            bar.classList.add('animate');
        });
    }
    
    // Add animation to elements when they come into view
    function setupIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target); // Stop observing once animated
                }
            });
        }, options);
        
        // Observe skill tags, project cards, and highlight items
        const elementsToAnimate = document.querySelectorAll('.skill-tag, .project-card, .highlight-item');
        elementsToAnimate.forEach(element => {
            observer.observe(element);
        });
    }
    
    // Initialize animations with a slight delay to ensure DOM is fully rendered
    setTimeout(() => {
        setupIntersectionObserver();
        
        // If the skills tab is already active on load, animate the skill bars
        if (document.querySelector('#skills').classList.contains('active')) {
            animateSkillBars();
        }
        
        // Add staggered animation to social icons
        const socialIcons = document.querySelectorAll('.social-icons .icon');
        socialIcons.forEach((icon, index) => {
            icon.style.animationDelay = `${index * 0.1}s`;
            icon.classList.add('animate-in');
        });
    }, 100);
    
    // Initialize theme on page load
    initTheme();
});

function initTestimonialSlider() {
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.control-dots .dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (!testimonialCards.length) return;
    
    let currentIndex = 0;
    
    function showTestimonial(index) {
        testimonialCards.forEach(card => card.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        testimonialCards[index].classList.add('active');
        dots[index].classList.add('active');
        currentIndex = index;
    }
    
    function nextTestimonial() {
        let nextIndex = currentIndex + 1;
        if (nextIndex >= testimonialCards.length) {
            nextIndex = 0;
        }
        showTestimonial(nextIndex);
    }
    
    function prevTestimonial() {
        let prevIndex = currentIndex - 1;
        if (prevIndex < 0) {
            prevIndex = testimonialCards.length - 1;
        }
        showTestimonial(prevIndex);
    }
    
    // Event listeners
    if (nextBtn) nextBtn.addEventListener('click', nextTestimonial);
    if (prevBtn) prevBtn.addEventListener('click', prevTestimonial);
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => showTestimonial(index));
    });
    
    // Auto rotate testimonials
    let intervalId = setInterval(nextTestimonial, 5000);
    
    // Pause rotation on hover
    const testimonialSlider = document.querySelector('.testimonial-slider');
    if (testimonialSlider) {
        testimonialSlider.addEventListener('mouseenter', () => {
            clearInterval(intervalId);
        });
        
        testimonialSlider.addEventListener('mouseleave', () => {
            intervalId = setInterval(nextTestimonial, 5000);
        });
    }
}

function typeWriterEffect(element, text, speed = 30) {
    // Only apply on initial page load
    if (sessionStorage.getItem('typed') === 'true') {
        return;
    }
    
    element.textContent = '';
    let i = 0;
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else {
            sessionStorage.setItem('typed', 'true');
        }
    }
    
    type();
}

// Add smooth scrolling for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
