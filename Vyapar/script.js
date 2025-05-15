document.addEventListener('DOMContentLoaded', function() {
    // Add skip to content link for accessibility
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-to-content';
    skipLink.textContent = 'Skip to content';
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add ID to main content for skip link
    const mainContent = document.querySelector('.main-content');
    mainContent.id = 'main-content';
    
    // Toggle sidebar
    const toggleBtn = document.getElementById('toggleNav');
    const sidebar = document.querySelector('.sidebar');
    
    toggleBtn.addEventListener('click', function() {
        sidebar.classList.toggle('collapsed');
        
        // For mobile responsiveness
        if (window.innerWidth <= 992) {
            sidebar.classList.toggle('expanded');
        }
        
        // Save state to localStorage
        localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed'));
    });
    
    // Check if sidebar was collapsed previously
    if (localStorage.getItem('sidebarCollapsed') === 'true') {
        sidebar.classList.add('collapsed');
    }
    
    // Add animation classes to elements
    const animatedElements = document.querySelectorAll('.card, .chart-card, .recent-activity, .trending-products');
    animatedElements.forEach((element, index) => {
        setTimeout(() => {
            element.classList.add('fade-in');
        }, index * 100);
    });
    
    // Initialize charts
    initCharts();
    
    // Setup interactive filters
    setupFilters();
    
    // Setup profile and notification dropdowns
    setupDropdowns();
    
    // Add interaction to table rows
    setupTableInteractions();
    
    // Add product card interactions
    setupProductCards();
    
    // Add scroll to top button
    setupScrollToTop();
    
    // Add dark mode toggle (create button first)
    setupDarkMode();
    
    // Add card click handlers
    setupCardInteractions();
    
    // Add tooltips to action buttons
    document.querySelectorAll('.action-btn').forEach(btn => {
        btn.setAttribute('data-tooltip', 'View Details');
    });
    
    // Create toast container if it doesn't exist
    if (!document.querySelector('.toast-container')) {
        const toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }
});

function setupCardInteractions() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        const menuIcon = card.querySelector('.card-header i');
        if (menuIcon) {
            menuIcon.addEventListener('click', function(e) {
                e.stopPropagation();
                
                // Create dropdown menu
                const menu = document.createElement('div');
                menu.className = 'profile-dropdown'; // Reuse dropdown styles
                menu.style.top = (e.clientY + 10) + 'px';
                menu.style.left = e.clientX + 'px';
                menu.style.right = 'auto';
                menu.innerHTML = `
                    <ul>
                        <li><i class="fas fa-sync-alt"></i> Refresh</li>
                        <li><i class="fas fa-expand"></i> Expand</li>
                        <li><i class="fas fa-chart-line"></i> View Analytics</li>
                        <li class="divider"></li>
                        <li><i class="fas fa-download"></i> Export Data</li>
                    </ul>
                `;
                
                document.body.appendChild(menu);
                
                // Handle menu item clicks
                menu.querySelectorAll('li').forEach(item => {
                    if (!item.classList.contains('divider')) {
                        item.addEventListener('click', function() {
                            const action = this.textContent.trim();
                            const cardTitle = card.querySelector('.card-header h3').textContent;
                            showToast('Card Action', `${action} selected for ${cardTitle}`, 'info');
                            menu.remove();
                        });
                    }
                });
                
                // Close when clicking outside
                document.addEventListener('click', function closeMenu() {
                    menu.remove();
                    document.removeEventListener('click', closeMenu);
                });
            });
        }
        
        // Make entire card clickable for detailed view
        card.addEventListener('click', function() {
            if (!event.target.closest('.card-header i')) {
                const cardTitle = this.querySelector('.card-header h3').textContent;
                showToast('Card Selected', `Viewing detailed data for ${cardTitle}`, 'info');
            }
        });
    });
}

function setupFilters() {
    const filterSection = document.querySelector('.filters h3');
    const filterOptions = document.querySelector('.filter-options');
    
    // Initial state - show filters
    filterOptions.style.display = 'flex';
    filterOptions.style.opacity = '1';
    filterOptions.style.maxHeight = 'none';
    
    filterSection.addEventListener('click', function() {
        if (filterOptions.style.display === 'none' || filterOptions.style.maxHeight === '0px') {
            // Show filters
            filterOptions.style.display = 'flex';
            setTimeout(() => {
                filterOptions.style.opacity = '1';
                filterOptions.style.maxHeight = filterOptions.scrollHeight + 'px';
            }, 10);
        } else {
            // Hide filters
            filterOptions.style.opacity = '0';
            filterOptions.style.maxHeight = '0px';
            setTimeout(() => {
                filterOptions.style.display = 'none';
            }, 300);
        }
    });
    
    // Apply filters button
    const applyBtn = document.querySelector('.apply-filters');
    applyBtn.addEventListener('click', function() {
        // Show loading state
        this.innerHTML = '<i class="fas fa-spinner spin"></i> Applying...';
        this.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            this.innerHTML = 'Apply Filters';
            this.disabled = false;
            
            // Refresh data
            refreshDashboardData();
            
            // Show success message
            showToast('Filters Applied', 'Dashboard data has been updated with your filters', 'success');
        }, 1200);
    });
}

function initCharts() {
    // Set Chart.js defaults
    Chart.defaults.font.family = "'Inter', sans-serif";
    Chart.defaults.font.size = 12;
    Chart.defaults.color = '#8d99ae';
    Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    Chart.defaults.plugins.tooltip.padding = 10;
    Chart.defaults.plugins.tooltip.cornerRadius = 6;
    Chart.defaults.plugins.title.display = false;
    
    // Sales chart - Multiple datasets for different regions
    const salesCtx = document.getElementById('salesChart').getContext('2d');
    window.salesChart = new Chart(salesCtx, {
        type: 'line',
        data: {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August'],
            datasets: [
                {
                    label: 'North India',
                    data: [15000, 21000, 18000, 24000, 23000, 24000, 21000, 32000],
                    borderColor: '#4361EE',
                    backgroundColor: 'rgba(67, 97, 238, 0.1)',
                    tension: 0.3,
                    fill: true
                },
                {
                    label: 'South India',
                    data: [10000, 17000, 20000, 22000, 18000, 26000, 25000, 27000],
                    borderColor: '#3A0CA3',
                    backgroundColor: 'rgba(58, 12, 163, 0.1)',
                    tension: 0.3,
                    fill: true
                },
                {
                    label: 'East India',
                    data: [8000, 12000, 11000, 14000, 15000, 19000, 17000, 20000],
                    borderColor: '#4CC9F0',
                    backgroundColor: 'rgba(76, 201, 240, 0.1)',
                    tension: 0.3,
                    fill: true
                },
                {
                    label: 'West India',
                    data: [14000, 15000, 18000, 19000, 21000, 25000, 28000, 30000],
                    borderColor: '#F72585',
                    backgroundColor: 'rgba(247, 37, 133, 0.1)',
                    tension: 0.3,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += new Intl.NumberFormat('en-IN', {
                                    style: 'currency',
                                    currency: 'INR',
                                    maximumFractionDigits: 0
                                }).format(context.parsed.y);
                            }
                            return label;
                        }
                    }
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        drawBorder: false,
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        callback: function(value) {
                            return new Intl.NumberFormat('en-IN', {
                                style: 'currency',
                                currency: 'INR',
                                notation: 'compact',
                                compactDisplay: 'short',
                                maximumFractionDigits: 1
                            }).format(value);
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
    
    // Traffic sources chart
    const trafficCtx = document.getElementById('trafficChart').getContext('2d');
    window.trafficChart = new Chart(trafficCtx, {
        type: 'doughnut',
        data: {
            labels: ['Social Media', 'Referral', 'Search Engine', 'Direct'],
            datasets: [{
                data: [35, 25, 30, 10],
                backgroundColor: [
                    '#4361EE',
                    '#3A0CA3',
                    '#4CC9F0',
                    '#F72585'
                ],
                borderWidth: 0,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            const total = context.dataset.data.reduce((acc, data) => acc + data, 0);
                            const percentage = Math.round((value / total) * 100);
                            return `${label}: ${percentage}% (${value.toLocaleString('en-IN')})`;
                        }
                    }
                }
            },
            cutout: '70%',
            animation: {
                animateScale: true,
                animateRotate: true
            }
        }
    });
    
    // Set up chart actions
    const chartActions = document.querySelectorAll('.chart-actions button');
    chartActions.forEach(button => {
        button.addEventListener('click', function() {
            chartActions.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Show loading state on chart
            const chartCanvas = this.closest('.chart-card').querySelector('canvas');
            chartCanvas.style.opacity = '0.5';
            
            // Update chart data after delay
            setTimeout(() => {
                updateChartData(this.textContent.trim());
                chartCanvas.style.opacity = '1';
            }, 500);
        });
    });
}

function updateChartData(timeframe) {
    // Sample data for different timeframes
    const data = {
        'Weekly': {
            'North India': [15000, 21000, 18000, 24000, 23000, 24000, 21000, 32000],
            'South India': [10000, 17000, 20000, 22000, 18000, 26000, 25000, 27000],
            'East India': [8000, 12000, 11000, 14000, 15000, 19000, 17000, 20000],
            'West India': [14000, 15000, 18000, 19000, 21000, 25000, 28000, 30000]
        },
        'Monthly': {
            'North India': [150000, 180000, 210000, 250000, 220000, 280000, 320000, 350000],
            'South India': [120000, 170000, 190000, 220000, 200000, 250000, 290000, 310000],
            'East India': [90000, 110000, 130000, 150000, 180000, 200000, 210000, 230000],
            'West India': [130000, 170000, 190000, 230000, 250000, 270000, 310000, 340000]
        },
        'Yearly': {
            'North India': [1800000, 2200000, 2500000, 2800000, 3100000, 3300000, 3600000, 4200000],
            'South India': [1500000, 1900000, 2100000, 2400000, 2700000, 3000000, 3300000, 3700000],
            'East India': [1100000, 1300000, 1600000, 1800000, 2100000, 2400000, 2600000, 2900000],
            'West India': [1600000, 2000000, 2300000, 2600000, 2900000, 3200000, 3800000, 4000000]
        }
    };
    
    // Update chart data
    if (data[timeframe]) {
        window.salesChart.data.datasets.forEach((dataset, index) => {
            const regionName = dataset.label;
            dataset.data = data[timeframe][regionName];
        });
        
        window.salesChart.update();
        
        // Show notification
        showToast('Chart Updated', `Showing ${timeframe.toLowerCase()} sales data`, 'info');
    }
}

function refreshDashboardData() {
    // Update card values with random changes
    const cards = document.querySelectorAll('.card-body h2');
    
    cards.forEach(card => {
        const currentText = card.textContent;
        let currentValue;
        
        if (currentText.includes('₹')) {
            // For currency values
            currentValue = parseInt(currentText.replace(/[₹,]/g, ''));
            const change = Math.floor(currentValue * (Math.random() * 0.05)); // Random change up to 5%
            const newValue = currentValue + change;
            card.textContent = '₹' + newValue.toLocaleString('en-IN');
            
            // Update the percentage change
            const percentElem = card.nextElementSibling.querySelector('span');
            const newPercent = Math.floor(Math.random() * 10) + 5; // Random 5-15%
            const isUp = Math.random() > 0.3; // 70% chance of being up
            
            if (isUp) {
                percentElem.className = 'up';
                percentElem.innerHTML = `<i class="fas fa-arrow-up"></i> ${newPercent}%`;
            } else {
                percentElem.className = 'down';
                percentElem.innerHTML = `<i class="fas fa-arrow-down"></i> ${newPercent}%`;
            }
        } else if (currentText.includes('%')) {
            // For percentage values
            currentValue = parseFloat(currentText);
            const change = currentValue * (Math.random() * 0.1); // Random change up to 10%
            const newValue = (currentValue + change).toFixed(1);
            card.textContent = newValue + '%';
            
            // Update the percentage change
            const percentElem = card.nextElementSibling.querySelector('span');
            const newPercent = (Math.random() * 1).toFixed(1); // Random 0.0-1.0%
            const isUp = Math.random() > 0.3; // 70% chance of being up
            
            if (isUp) {
                percentElem.className = 'up';
                percentElem.innerHTML = `<i class="fas fa-arrow-up"></i> ${newPercent}%`;
            } else {
                percentElem.className = 'down';
                percentElem.innerHTML = `<i class="fas fa-arrow-down"></i> ${newPercent}%`;
            }
        } else {
            // For numeric values
            currentValue = parseInt(currentText.replace(/,/g, ''));
            const change = Math.floor(currentValue * (Math.random() * 0.08)); // Random change up to 8%
            const newValue = currentValue + change;
            card.textContent = newValue.toLocaleString('en-IN');
            
            // Update the percentage change
            const percentElem = card.nextElementSibling.querySelector('span');
            const newPercent = Math.floor(Math.random() * 15) + 2; // Random 2-17%
            const isUp = Math.random() > 0.3; // 70% chance of being up
            
            if (isUp) {
                percentElem.className = 'up';
                percentElem.innerHTML = `<i class="fas fa-arrow-up"></i> ${newPercent}%`;
            } else {
                percentElem.className = 'down';
                percentElem.innerHTML = `<i class="fas fa-arrow-down"></i> ${newPercent}%`;
            }
        }
        
        // Update timestamp
        const footerElem = card.closest('.card').querySelector('.card-footer small');
        const now = new Date();
        footerElem.textContent = `Last updated: Today ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} ${now.getHours() >= 12 ? 'PM' : 'AM'}`;
    });
    
    // Also update traffic chart with slight variations
    if (window.trafficChart) {
        const currentData = window.trafficChart.data.datasets[0].data.slice();
        const newData = currentData.map(value => {
            const maxChange = value * 0.05; // Max 5% change
            const change = (Math.random() * 2 - 1) * maxChange; // Random change between -5% and +5%
            return Math.max(5, Math.round(value + change)); // Ensure minimum value of 5
        });
        
        window.trafficChart.data.datasets[0].data = newData;
        window.trafficChart.update();
        
        // Update total visitors in footer
        const total = newData.reduce((a, b) => a + b, 0);
        const visitorFooter = document.querySelector('.chart-card:nth-child(2) .card-footer p strong');
        if (visitorFooter) {
            visitorFooter.textContent = total.toLocaleString('en-IN');
        }
    }
}

function setupDropdowns() {
    // Profile dropdown
    const profile = document.querySelector('.profile');
    profile.addEventListener('click', function(e) {
        e.stopPropagation();
        
        // Remove any existing dropdown
        const existingDropdown = document.querySelector('.profile-dropdown');
        if (existingDropdown) {
            existingDropdown.remove();
            return;
        }
        
        // Create dropdown
        const dropdown = document.createElement('div');
        dropdown.className = 'profile-dropdown';
        dropdown.innerHTML = `
            <ul>
                <li><i class="fas fa-user"></i> My Profile</li>
                <li><i class="fas fa-cog"></i> Account Settings</li>
                <li><i class="fas fa-bell"></i> Notifications</li>
                <li class="divider"></li>
                <li><i class="fas fa-moon"></i> Dark Mode</li>
                <li class="divider"></li>
                <li><i class="fas fa-sign-out-alt"></i> Logout</li>
            </ul>
        `;
        
        document.body.appendChild(dropdown);
        
        // Position dropdown
        const rect = profile.getBoundingClientRect();
        dropdown.style.top = (rect.bottom + 10) + 'px';
        dropdown.style.right = (window.innerWidth - rect.right) + 'px';
        
        // Add click handlers to dropdown items
        dropdown.querySelectorAll('li').forEach(item => {
            if (!item.classList.contains('divider')) {
                item.addEventListener('click', function() {
                    const action = this.textContent.trim();
                    
                    if (action === 'Dark Mode') {
                        document.body.classList.toggle('dark-mode');
                        localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
                        showToast('Theme Changed', 'Dark mode ' + (document.body.classList.contains('dark-mode') ? 'enabled' : 'disabled'), 'info');
                    } else {
                        showToast('Profile Action', `${action} selected`, 'info');
                    }
                    
                    dropdown.remove();
                });
            }
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function closeDropdown(e) {
            if (!dropdown.contains(e.target) && !profile.contains(e.target)) {
                dropdown.remove();
                document.removeEventListener('click', closeDropdown);
            }
        });
    });
    
    // Notification dropdown
    const notifBell = document.querySelector('.notifications i');
    notifBell.addEventListener('click', function(e) {
        e.stopPropagation();
        
        // Remove any existing dropdown
        const existingDropdown = document.querySelector('.notification-dropdown');
        if (existingDropdown) {
            existingDropdown.remove();
            return;
        }
        
        // Create dropdown
        const dropdown = document.createElement('div');
        dropdown.className = 'notification-dropdown';
        dropdown.innerHTML = `
            <div class="notification-header">
                <h3>Notifications</h3>
                <span>5 New</span>
            </div>
            <div class="notification-list">
                <div class="notification-item">
                    <div class="notification-content">
                        <div class="notification-icon" style="background-color: rgba(16, 185, 129, 0.1); color: #10b981;">
                            <i class="fas fa-check-circle"></i>
                        </div>
                        <div class="notification-text">
                            <div class="notification-title">Order #ORD-9856 completed</div>
                            <div class="notification-subtitle">Ananya Sharma's order has been delivered</div>
                            <div class="notification-time">2 hours ago</div>
                        </div>
                    </div>
                </div>
                <div class="notification-item">
                    <div class="notification-content">
                        <div class="notification-icon" style="background-color: rgba(59, 130, 246, 0.1); color: #3b82f6;">
                            <i class="fas fa-user-plus"></i>
                        </div>
                        <div class="notification-text">
                            <div class="notification-title">New customer registered</div>
                            <div class="notification-subtitle">Vikash Mehta from Bengaluru has created an account</div>
                            <div class="notification-time">5 hours ago</div>
                        </div>
                    </div>
                </div>
                <div class="notification-item">
                    <div class="notification-content">
                        <div class="notification-icon" style="background-color: rgba(245, 158, 11, 0.1); color: #f59e0b;">
                            <i class="fas fa-exclamation-triangle"></i>
                        </div>
                        <div class="notification-text">
                            <div class="notification-title">Inventory alert</div>
                            <div class="notification-subtitle">SmartWatch Pro is running low on stock</div>
                            <div class="notification-time">1 day ago</div>
                        </div>
                    </div>
                </div>
                <div class="notification-item">
                    <div class="notification-content">
                        <div class="notification-icon" style="background-color: rgba(239, 68, 68, 0.1); color: #ef4444;">
                            <i class="fas fa-exclamation-circle"></i>
                        </div>
                        <div class="notification-text">
                            <div class="notification-title">Payment failed</div>
                            <div class="notification-subtitle">Order #ORD-7832 payment was declined</div>
                            <div class="notification-time">1 day ago</div>
                        </div>
                    </div>
                </div>
                <div class="notification-item">
                    <div class="notification-content">
                        <div class="notification-icon" style="background-color: rgba(67, 97, 238, 0.1); color: #4361ee;">
                            <i class="fas fa-chart-line"></i>
                        </div>
                        <div class="notification-text">
                            <div class="notification-title">Sales milestone reached</div>
                            <div class="notification-subtitle">You've surpassed ₹10,00,000 in monthly sales!</div>
                            <div class="notification-time">2 days ago</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="notification-footer">
                <a href="#" class="view-all-notifications">View All Notifications</a>
            </div>
        `;
        
        document.body.appendChild(dropdown);
        
        // Position dropdown
        const rect = notifBell.getBoundingClientRect();
        dropdown.style.top = (rect.bottom + 10) + 'px';
        dropdown.style.right = (window.innerWidth - rect.right) + 'px';
        
        // Hide notification badge
        const badge = document.querySelector('.badge');
        badge.style.display = 'none';
        
        // Add click handlers to notification items
        dropdown.querySelectorAll('.notification-item').forEach(item => {
            item.addEventListener('click', function() {
                const title = this.querySelector('.notification-title').textContent;
                showToast('Notification', `You clicked: ${title}`, 'info');
                this.style.backgroundColor = 'var(--bg-color)';
            });
        });
        
        // View all notifications link
        dropdown.querySelector('.view-all-notifications').addEventListener('click', function(e) {
            e.preventDefault();
            showToast('Notifications', 'Viewing all notifications', 'info');
            dropdown.remove();
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function closeDropdown(e) {
            if (!dropdown.contains(e.target) && !notifBell.contains(e.target)) {
                dropdown.remove();
                document.removeEventListener('click', closeDropdown);
            }
        });
    });
}

function setupTableInteractions() {
    const tableRows = document.querySelectorAll('.recent-activity tbody tr');
    
    tableRows.forEach(row => {
        // Make row clickable
        row.addEventListener('click', function(e) {
            if (!e.target.closest('.action-btn')) {
                const orderId = this.querySelector('td:first-child').textContent;
                const customer = this.querySelector('.customer-info p').textContent;
                showToast('Order Selected', `Viewing order ${orderId} for ${customer}`, 'info');
            }
        });
        
        // Action button click
        const actionBtn = row.querySelector('.action-btn');
        if (actionBtn) {
            actionBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                const orderId = row.querySelector('td:first-child').textContent;
                const customer = row.querySelector('.customer-info p').textContent;
                showToast('Order Details', `Viewing details for ${orderId} (${customer})`, 'info');
            });
        }
    });
    
    // "View All" button
    const viewAllBtn = document.querySelector('.recent-activity .view-all-btn');
    if (viewAllBtn) {
        viewAllBtn.addEventListener('click', function() {
            showToast('Orders', 'Viewing all recent orders', 'info');
        });
    }
}

function setupProductCards() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        // View details button
        const viewBtn = card.querySelector('.view-product-btn');
        if (viewBtn) {
            viewBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                const productName = card.querySelector('h4').textContent;
                const price = card.querySelector('.price').textContent.split(' ')[0];
                showToast('Product', `Viewing details for ${productName} (${price})`, 'info');
            });
        }
        
        // Make card clickable
        card.addEventListener('click', function(e) {
            if (!e.target.closest('.view-product-btn')) {
                const productName = this.querySelector('h4').textContent;
                showToast('Product Selected', `Viewing ${productName}`, 'info');
            }
        });
    });
    
    // "View All" button
    const viewAllBtn = document.querySelector('.trending-products .view-all-btn');
    if (viewAllBtn) {
        viewAllBtn.addEventListener('click', function() {
            showToast('Products', 'Viewing all trending products', 'info');
        });
    }
}

function setupScrollToTop() {
    // Create scroll to top button
    const scrollBtn = document.createElement('div');
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(scrollBtn);
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        if (document.querySelector('.main-content').scrollTop > 300) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    });
    
    // Scroll to top on click
    scrollBtn.addEventListener('click', function() {
        document.querySelector('.main-content').scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Also trigger scroll event on main content
    document.querySelector('.main-content').addEventListener('scroll', function() {
        if (this.scrollTop > 300) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    });
}

function setupDarkMode() {
    // Check for saved preference
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }
    
    // Add a dark mode toggle button in the header
    const profileSection = document.querySelector('.user-profile');
    const darkModeBtn = document.createElement('div');
    darkModeBtn.className = 'dark-mode-toggle';
    darkModeBtn.innerHTML = '<i class="fas fa-moon"></i>';
    darkModeBtn.setAttribute('data-tooltip', 'Toggle Dark Mode');
    darkModeBtn.style.cursor = 'pointer';
    darkModeBtn.style.marginRight = '10px';
    darkModeBtn.style.fontSize = '1.2rem';
    darkModeBtn.style.color = 'var(--text-secondary)';
    
    profileSection.insertBefore(darkModeBtn, profileSection.firstChild);
    
    // Toggle dark mode on click
    darkModeBtn.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
        
        // Update icon
        if (document.body.classList.contains('dark-mode')) {
            this.innerHTML = '<i class="fas fa-sun"></i>';
            this.setAttribute('data-tooltip', 'Switch to Light Mode');
        } else {
            this.innerHTML = '<i class="fas fa-moon"></i>';
            this.setAttribute('data-tooltip', 'Switch to Dark Mode');
        }
        
        // Add a small animation
        this.classList.add('pulse');
        setTimeout(() => {
            this.classList.remove('pulse');
        }, 1000);
    });
    
    // Set correct initial icon
    if (document.body.classList.contains('dark-mode')) {
        darkModeBtn.innerHTML = '<i class="fas fa-sun"></i>';
        darkModeBtn.setAttribute('data-tooltip', 'Switch to Light Mode');
    }
}

function showToast(title, message, type = 'info') {
    // Create toast container if it doesn't exist
    const container = document.querySelector('.toast-container') || (() => {
        const cont = document.createElement('div');
        cont.className = 'toast-container';
        document.body.appendChild(cont);
        return cont;
    })();
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    // Set icon based on type
    let icon;
    switch (type) {
        case 'success':
            icon = 'check-circle';
            break;
        case 'error':
            icon = 'exclamation-circle';
            break;
        case 'warning':
            icon = 'exclamation-triangle';
            break;
        default:
            icon = 'info-circle';
    }
    
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="fas fa-${icon}"></i>
        </div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
        <div class="toast-close">
            <i class="fas fa-times"></i>
        </div>
    `;
    
    container.appendChild(toast);
    
    // Add close functionality
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
        toast.style.opacity = '0';
        setTimeout(() => {
            toast.remove();
        }, 300);
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 5000);
    
    // Animate in
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
        toast.style.opacity = '1';
    }, 10);
}
