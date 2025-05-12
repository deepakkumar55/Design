// GitHub Username
const username = 'deepakkumar55';
const USER_API = `https://api.github.com/users/${username}`;
const REPOS_API = `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`;
const EVENTS_API = `https://api.github.com/users/${username}/events?per_page=10`;

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme based on preference
    initTheme();
    
    // Fetch GitHub profile data
    fetchProfile();
    
    // Fetch repositories
    fetchRepos();
    
    // Fetch activity timeline
    fetchActivity();
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize scroll to top button
    initScrollToTop();
    
    // Initialize smooth scroll
    initSmoothScroll();
    
    // Initialize typing animation
    initTypingAnimation();

    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Initialize contact form
    document.getElementById('contact-form').addEventListener('submit', handleContactForm);
    
    // Initialize project filters
    initProjectFilters();
});

// Theme Toggle
function initTheme() {
    const themeSwitch = document.getElementById('theme-switch');
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    // Set initial theme
    document.documentElement.setAttribute('data-theme', currentTheme);
    themeSwitch.checked = currentTheme === 'dark';
    
    // Add theme toggle event listener
    themeSwitch.addEventListener('change', () => {
        const theme = themeSwitch.checked ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    });
}

// Fetch Profile Data
async function fetchProfile() {
    try {
        const response = await fetch(USER_API);
        if (!response.ok) throw new Error('Failed to fetch profile data');
        
        const user = await response.json();
        
        // Update profile information
        document.getElementById('profile-image').src = user.avatar_url;
        document.getElementById('profile-name').textContent = user.name || username;
        document.getElementById('profile-username').textContent = `@${user.login}`;
        document.getElementById('profile-bio').textContent = user.bio || 'GitHub Developer';
        document.getElementById('github-link').href = user.html_url;
        document.getElementById('footer-github').href = user.html_url;
        document.getElementById('followers-count').textContent = formatNumber(user.followers);
        document.getElementById('contact-email').textContent = user.email || 'contact@deepakkumar.com';
        document.getElementById('contact-email').href = `mailto:${user.email || 'contact@deepakkumar.com'}`;
        document.getElementById('footer-name').textContent = user.name || username;
        document.getElementById('copyright-name').textContent = user.name || username;
        
    } catch (error) {
        console.error('Error fetching profile:', error);
    }
}

// Fetch Repositories
async function fetchRepos() {
    try {
        const response = await fetch(REPOS_API);
        if (!response.ok) throw new Error('Failed to fetch repositories');
        
        const repos = await response.json();
        
        // Update stats
        document.getElementById('total-repos').textContent = repos.length;
        
        // Calculate total stars
        const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
        document.getElementById('total-stars').textContent = formatNumber(totalStars);
        
        // Estimate total commits (GitHub API doesn't provide this directly)
        document.getElementById('total-commits').textContent = formatNumber(repos.length * 15);
        
        // Create languages chart
        createLanguagesChart(repos);
        
        // Create activity chart
        createActivityChart(repos);
        
        // Create contribution calendar
        createContributionCalendar();
        
        // Display projects
        displayProjects(repos);
        
    } catch (error) {
        console.error('Error fetching repositories:', error);
        document.getElementById('projects-container').innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <p>Failed to load repositories</p>
            </div>
        `;
    }
}

// Fetch Activity Timeline
async function fetchActivity() {
    try {
        const response = await fetch(EVENTS_API);
        if (!response.ok) throw new Error('Failed to fetch activity');
        
        const events = await response.json();
        displayActivity(events);
        
    } catch (error) {
        console.error('Error fetching activity:', error);
        document.getElementById('activity-timeline').innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <p>Failed to load activity timeline</p>
            </div>
        `;
    }
}

// Languages Chart
function createLanguagesChart(repos) {
    // Count languages
    const languages = {};
    repos.forEach(repo => {
        if (repo.language) {
            languages[repo.language] = (languages[repo.language] || 0) + 1;
        }
    });
    
    // Prepare data for chart
    const labels = Object.keys(languages);
    const data = Object.values(languages);
    const backgroundColors = generateColors(labels.length);
    
    // Create chart
    const ctx = document.getElementById('languages-chart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: backgroundColors,
                borderWidth: 1,
                borderColor: getComputedStyle(document.documentElement).getPropertyValue('--card-bg')
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary')
                    }
                }
            }
        }
    });
}

// Activity Chart
function createActivityChart(repos) {
    // Group repos by creation month/year
    const monthlyActivity = {};
    
    // Get last 6 months
    const months = [];
    const currentDate = new Date();
    
    for (let i = 5; i >= 0; i--) {
        const date = new Date(currentDate);
        date.setMonth(currentDate.getMonth() - i);
        const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
        months.push(monthYear);
        monthlyActivity[monthYear] = 0;
    }
    
    // Count repos by update month/year
    repos.forEach(repo => {
        const updateDate = new Date(repo.updated_at);
        const monthYear = `${updateDate.toLocaleString('default', { month: 'short' })} ${updateDate.getFullYear()}`;
        
        if (monthlyActivity[monthYear] !== undefined) {
            monthlyActivity[monthYear]++;
        }
    });
    
    // Prepare data for chart
    const data = months.map(month => monthlyActivity[month] || 0);
    
    // Create chart
    const ctx = document.getElementById('activity-chart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [{
                label: 'Repository Activity',
                data: data,
                backgroundColor: hexToRgba(getComputedStyle(document.documentElement).getPropertyValue('--primary-color'), 0.2),
                borderColor: getComputedStyle(document.documentElement).getPropertyValue('--primary-color'),
                borderWidth: 3,
                tension: 0.4,
                pointBackgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--primary-color'),
                pointRadius: 5,
                pointHoverRadius: 7,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--text-tertiary')
                    },
                    grid: {
                        color: hexToRgba(getComputedStyle(document.documentElement).getPropertyValue('--border-color'), 0.5)
                    }
                },
                x: {
                    ticks: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--text-tertiary')
                    },
                    grid: {
                        display: false
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

// Create Contribution Calendar
function createContributionCalendar() {
    const calendarContainer = document.getElementById('contribution-calendar');
    const currentDate = new Date();
    
    // Create calendar container
    const calendar = document.createElement('div');
    calendar.className = 'calendar-grid';
    calendar.style.display = 'grid';
    calendar.style.gridTemplateColumns = 'repeat(53, 16px)';
    calendar.style.gridGap = '2px';
    calendar.style.margin = '0 auto';
    calendar.style.overflowX = 'auto';
    calendar.style.padding = '10px 0';
    
    // Generate days (dummy data since GitHub API doesn't easily provide this)
    for (let week = 0; week < 53; week++) {
        for (let day = 0; day < 7; day++) {
            const dayEl = document.createElement('div');
            dayEl.className = 'calendar-day';
            
            // Random contribution level (would be replaced with actual data)
            const level = Math.floor(Math.random() * 5);
            dayEl.classList.add(`day-level-${level}`);
            
            // Add date as tooltip
            const date = new Date(currentDate);
            date.setDate(currentDate.getDate() - (53 * 7) + (week * 7) + day);
            dayEl.title = date.toDateString();
            
            calendar.appendChild(dayEl);
        }
    }
    
    calendarContainer.appendChild(calendar);
}

// Display Projects
function displayProjects(repos) {
    const projectsContainer = document.getElementById('projects-container');
    projectsContainer.innerHTML = '';
    
    // Sort repos by stars and take top 6
    const featuredRepos = repos
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, 6);
    
    // Create project cards
    featuredRepos.forEach(repo => {
        // Determine project category (for filtering)
        let category = 'web';
        if (repo.language === 'Java' || repo.language === 'Kotlin') category = 'mobile';
        if (repo.language === 'Python' || repo.language === 'Node.js') category = 'backend';
        if (repo.name.toLowerCase().includes('tool') || repo.name.toLowerCase().includes('util')) category = 'tools';
        
        // Create tags based on topics or language
        const tags = repo.topics || [`${repo.language || 'Various'}`];
        
        // Format date
        const updatedDate = new Date(repo.updated_at);
        const formattedDate = updatedDate.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
        
        // Create project card
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
        projectCard.dataset.category = category;
        
        // Generate random placeholder image (would be replaced with actual screenshots)
        const imageColors = ['4f46e5', '2563eb', '7c3aed', 'db2777', 'f59e0b', '10b981'];
        const randomColor = imageColors[Math.floor(Math.random() * imageColors.length)];
        
        projectCard.innerHTML = `
            <div class="project-image">
                <img src="https://placehold.co/800x600/${randomColor}/ffffff?text=${repo.name}" alt="${repo.name}">
            </div>
            <div class="project-content">
                <h3 class="project-title">${repo.name}</h3>
                <div class="project-tags">
                    ${tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
                </div>
                <p class="project-description">${repo.description || 'No description available for this project.'}</p>
                <div class="project-links">
                    <a href="${repo.html_url}" class="project-link" target="_blank">
                        <i class="fab fa-github"></i> View Code
                    </a>
                    ${repo.homepage ? `
                        <a href="${repo.homepage}" class="project-link" target="_blank">
                            <i class="fas fa-external-link-alt"></i> Live Demo
                        </a>
                    ` : ''}
                </div>
                <div class="project-stats">
                    <div class="project-stat">
                        <i class="fas fa-star"></i> ${repo.stargazers_count}
                    </div>
                    <div class="project-stat">
                        <i class="fas fa-code-branch"></i> ${repo.forks_count}
                    </div>
                    <div class="project-stat">Updated on ${formattedDate}</div>
                </div>
            </div>
        `;
        
        projectsContainer.appendChild(projectCard);
    });
    
    // Add "View All Projects" button
    const viewAllBtn = document.createElement('a');
    viewAllBtn.href = `https://github.com/${username}?tab=repositories`;
    viewAllBtn.className = 'btn primary-btn';
    viewAllBtn.style.gridColumn = '1 / -1';
    viewAllBtn.style.textAlign = 'center';
    viewAllBtn.style.marginTop = '40px';
    viewAllBtn.target = '_blank';
    viewAllBtn.innerHTML = '<i class="fas fa-external-link-alt"></i> View All Repositories';
    
    projectsContainer.appendChild(viewAllBtn);
}

// Display Activity Timeline
function displayActivity(events) {
    const timelineContainer = document.getElementById('activity-timeline');
    timelineContainer.innerHTML = '';
    
    if (events.length === 0) {
        timelineContainer.innerHTML = '<p class="no-data">No recent activity found.</p>';
        return;
    }
    
    events.forEach(event => {
        // Format date
        const eventDate = new Date(event.created_at);
        const formattedDate = eventDate.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
        
        // Create timeline item
        const timelineItem = document.createElement('div');
        timelineItem.className = 'timeline-item';
        
        // Set event content based on type
        let title = '';
        let description = '';
        let icon = '';
        
        switch(event.type) {
            case 'PushEvent':
                icon = 'fa-code-commit';
                title = `Pushed to ${event.repo.name}`;
                description = `Made ${event.payload.size} commit(s)`;
                break;
            case 'CreateEvent':
                icon = 'fa-plus-circle';
                title = `Created ${event.payload.ref_type} in ${event.repo.name}`;
                description = event.payload.description || 'No description provided';
                break;
            case 'PullRequestEvent':
                icon = 'fa-code-pull-request';
                title = `${event.payload.action} pull request in ${event.repo.name}`;
                description = event.payload.pull_request ? 
                    event.payload.pull_request.title : 'No description provided';
                break;
            case 'IssuesEvent':
                icon = 'fa-exclamation-circle';
                title = `${event.payload.action} issue in ${event.repo.name}`;
                description = event.payload.issue ? 
                    event.payload.issue.title : 'No description provided';
                break;
            case 'WatchEvent':
                icon = 'fa-star';
                title = `Starred ${event.repo.name}`;
                description = 'Added to starred repositories';
                break;
            case 'ForkEvent':
                icon = 'fa-code-branch';
                title = `Forked ${event.repo.name}`;
                description = `Forked from ${event.payload.forkee?.full_name || event.repo.name}`;
                break;
            default:
                icon = 'fa-code';
                title = `Activity in ${event.repo.name}`;
                description = 'Did something on GitHub';
        }
        
        timelineItem.innerHTML = `
            <div class="timeline-date">${formattedDate}</div>
            <div class="timeline-content">
                <h3 class="timeline-title"><i class="fas ${icon}"></i> ${title}</h3>
                <p class="timeline-description">${description}</p>
                <a href="https://github.com/${event.repo.name}" class="timeline-link" target="_blank">
                    View Repository <i class="fas fa-external-link-alt"></i>
                </a>
            </div>
        `;
        
        timelineContainer.appendChild(timelineItem);
    });
}

// Initialize Project Filters
function initProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter projects
            const filterValue = button.dataset.filter;
            const projects = document.querySelectorAll('.project-card');
            
            projects.forEach(project => {
                if (filterValue === 'all' || project.dataset.category === filterValue) {
                    project.style.display = 'flex';
                } else {
                    project.style.display = 'none';
                }
            });
        });
    });
}

// Initialize Scroll Animations
function initScrollAnimations() {
    const sections = document.querySelectorAll('section, .footer-content, .footer-bottom');
    
    // Set initial state
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    });
    
    // Check which sections are in viewport
    function checkScroll() {
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const sectionBottom = section.getBoundingClientRect().bottom;
            const viewportHeight = window.innerHeight;
            
            if (sectionTop < viewportHeight - 100 && sectionBottom > 0) {
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }
        });
    }
    
    // Initial check
    checkScroll();
    
    // Add scroll event listener
    window.addEventListener('scroll', checkScroll);
}

// Initialize Scroll to Top Button
function initScrollToTop() {
    const scrollBtn = document.getElementById('scroll-top');
    
    function checkScrollPosition() {
        if (window.scrollY > 500) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    }
    
    // Initial check
    checkScrollPosition();
    
    // Add scroll event listener
    window.addEventListener('scroll', checkScrollPosition);
    
    // Add click event listener
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Initialize Smooth Scroll
function initSmoothScroll() {
    const smoothScrollLinks = document.querySelectorAll('.smooth-scroll');
    
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href');
            if (!targetId || targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;
            
            window.scrollTo({
                top: targetElement.offsetTop - 60,
                behavior: 'smooth'
            });
        });
    });
}

// Initialize Typing Animation
function initTypingAnimation() {
    const options = {
        strings: [
            'Full Stack Developer',
            'Open Source Contributor',
            'UI/UX Enthusiast',
            'Problem Solver',
            'Continuous Learner'
        ],
        typeSpeed: 50,
        backSpeed: 30,
        backDelay: 2000,
        loop: true,
        cursorChar: '|'
    };
    
    new Typed('#typing-text', options);
}

// Handle Contact Form Submission
function handleContactForm(e) {
    e.preventDefault();
    
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    
    // Validate form (basic validation)
    if (!nameInput.value || !emailInput.value || !messageInput.value) {
        alert('Please fill in all fields');
        return;
    }
    
    // Show success message (in a real app, you'd send data to a server)
    const form = document.getElementById('contact-form');
    form.innerHTML = `
        <div class="success-message">
            <i class="fas fa-check-circle"></i>
            <h3>Message Sent!</h3>
            <p>Thank you for reaching out. I'll get back to you soon!</p>
        </div>
    `;
}

// Utility: Format Numbers
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

// Utility: Generate Colors for Charts
function generateColors(count) {
    const baseColors = [
        '#3b82f6', '#10b981', '#f59e0b', '#ef4444', 
        '#6366f1', '#8b5cf6', '#ec4899', '#06b6d4'
    ];
    
    const colors = [];
    for (let i = 0; i < count; i++) {
        colors.push(baseColors[i % baseColors.length]);
    }
    
    return colors;
}

// Utility: Convert Hex to RGBA
function hexToRgba(hex, alpha = 1) {
    if (!hex) return `rgba(59, 130, 246, ${alpha})`;  // Default to primary blue
    
    // Remove # if present
    hex = hex.replace('#', '');
    
    // Parse hex
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
