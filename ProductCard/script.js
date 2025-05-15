document.addEventListener('DOMContentLoaded', function() {
    // Color selection functionality
    const colorOptions = document.querySelectorAll('.color-option');
    const productImage = document.querySelector('.product-tumb img');
    
    // Sample image URLs for different colors
    const colorImages = {
        'black': 'https://via.placeholder.com/350x350/333333/FFFFFF',
        'silver': 'https://via.placeholder.com/350x350/c0c0c0/FFFFFF',
        'rose-gold': 'https://via.placeholder.com/350x350/b76e79/FFFFFF'
    };
    
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove active class from all options
            colorOptions.forEach(opt => opt.classList.remove('active'));
            
            // Add active class to selected option
            this.classList.add('active');
            
            // Change product image based on color selection
            const colorName = this.getAttribute('data-color');
            if (colorImages[colorName]) {
                productImage.style.opacity = '0';
                setTimeout(() => {
                    productImage.src = colorImages[colorName];
                    productImage.style.opacity = '1';
                }, 200);
            }
        });
    });
    
    // Quantity selector functionality
    const minusBtn = document.querySelector('.qty-btn.minus');
    const plusBtn = document.querySelector('.qty-btn.plus');
    const qtyInput = document.querySelector('.qty-input');
    
    minusBtn.addEventListener('click', function() {
        let currentValue = parseInt(qtyInput.value);
        if (currentValue > 1) {
            qtyInput.value = currentValue - 1;
        }
    });
    
    plusBtn.addEventListener('click', function() {
        let currentValue = parseInt(qtyInput.value);
        if (currentValue < 10) {
            qtyInput.value = currentValue + 1;
        }
    });
    
    qtyInput.addEventListener('change', function() {
        let currentValue = parseInt(this.value);
        if (isNaN(currentValue) || currentValue < 1) {
            this.value = 1;
        } else if (currentValue > 10) {
            this.value = 10;
            showToast('Maximum 10 items allowed per order');
        }
    });
    
    qtyInput.addEventListener('input', function() {
        let val = this.value;
        if (val === '' || isNaN(val)) {
            this.value = 1;
        }
    });
    
    // Add to cart functionality
    const addToCartBtn = document.querySelector('.add-to-cart');
    
    addToCartBtn.addEventListener('click', function() {
        const quantity = parseInt(qtyInput.value);
        showToast(`Added ${quantity} item${quantity > 1 ? 's' : ''} to your cart`);
    });
    
    // Buy now functionality
    const buyNowBtn = document.querySelector('.buy-now');
    
    buyNowBtn.addEventListener('click', function() {
        showToast('Proceeding to checkout...');
        // In a real app, this would redirect to checkout page
    });
    
    // Wishlist, Compare, and Share functionality
    const wishlistBtn = document.querySelector('.wishlist-btn');
    const compareBtn = document.querySelector('.compare-btn');
    const shareBtn = document.querySelector('.share-btn');
    
    wishlistBtn.addEventListener('click', function() {
        this.classList.toggle('active');
        if (this.classList.contains('active')) {
            this.querySelector('i').classList.remove('far');
            this.querySelector('i').classList.add('fas');
            this.style.color = '#f44336';
            showToast('Added to your wishlist');
        } else {
            this.querySelector('i').classList.remove('fas');
            this.querySelector('i').classList.add('far');
            this.style.color = '';
            showToast('Removed from your wishlist');
        }
    });
    
    compareBtn.addEventListener('click', function() {
        showToast('Added to comparison list');
    });
    
    shareBtn.addEventListener('click', function() {
        // Create a share dialog (simplified version)
        const shareOptions = ['Facebook', 'Twitter', 'Email', 'Copy Link'];
        const shareText = 'Check out this amazing Ultra HD Smart Watch Pro!';
        
        alert(`Share via: ${shareOptions.join(', ')}\n\n${shareText}`);
        // In a real app, this would open a share dialog or use Web Share API
    });
    
    // Quick view and quick wishlist functionality
    const quickViewBtn = document.querySelector('.quick-view');
    const quickWishlistBtn = document.querySelector('.quick-wishlist');
    
    quickViewBtn.addEventListener('click', function() {
        showToast('Quick view coming soon');
    });
    
    quickWishlistBtn.addEventListener('click', function() {
        this.classList.toggle('active');
        if (this.classList.contains('active')) {
            this.style.backgroundColor = '#ffebee';
            this.querySelector('i').style.color = '#f44336';
            showToast('Added to wishlist');
        } else {
            this.style.backgroundColor = '';
            this.querySelector('i').style.color = '';
            showToast('Removed from wishlist');
        }
    });
    
    // Tab switching functionality
    const tabs = document.querySelectorAll('.tab');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs and panes
            tabs.forEach(t => t.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Activate corresponding pane
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Size selection functionality
    const sizeOptions = document.querySelectorAll('.size-option');
    
    sizeOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove active class from all options
            sizeOptions.forEach(opt => opt.classList.remove('active'));
            
            // Add active class to selected option
            this.classList.add('active');
            
            // Show toast with selected size
            const size = this.textContent;
            showToast(`Size ${size} selected`);
        });
    });
    
    // Image zoom effect on hover
    const productThumb = document.querySelector('.product-tumb');
    
    if (window.innerWidth > 768) {  // Only on desktop
        productThumb.addEventListener('mousemove', function(e) {
            const { left, top, width, height } = this.getBoundingClientRect();
            const x = (e.clientX - left) / width;
            const y = (e.clientY - top) / height;
            
            productImage.style.transformOrigin = `${x * 100}% ${y * 100}%`;
            productImage.style.transform = 'scale(1.15)';
        });
        
        productThumb.addEventListener('mouseleave', function() {
            productImage.style.transform = 'scale(1)';
        });
    }
    
    // Add animated hover effects to buttons
    const allButtons = document.querySelectorAll('button');
    
    allButtons.forEach(button => {
        button.addEventListener('mousedown', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const circle = document.createElement('span');
            circle.classList.add('ripple-effect');
            circle.style.left = `${x}px`;
            circle.style.top = `${y}px`;
            
            this.appendChild(circle);
            
            setTimeout(() => {
                circle.remove();
            }, 500);
        });
    });
    
    // Feature to show how many people are viewing this product
    function addViewersIndicator() {
        const randomViewers = Math.floor(Math.random() * 10) + 5;  // 5-15 viewers
        
        const viewersElement = document.createElement('div');
        viewersElement.className = 'viewers-indicator';
        viewersElement.innerHTML = `<i class="fas fa-eye"></i> ${randomViewers} people are viewing this product`;
        
        const productMeta = document.querySelector('.product-meta');
        productMeta.parentNode.insertBefore(viewersElement, productMeta.nextSibling);
        
        // Add animation to make it pulse occasionally
        setInterval(() => {
            viewersElement.classList.add('pulse');
            setTimeout(() => {
                viewersElement.classList.remove('pulse');
            }, 1000);
        }, 5000);
    }
    
    // Call this function with a slight delay
    setTimeout(addViewersIndicator, 2000);
    
    // Toast notification function
    function showToast(message) {
        // Remove existing toast if any
        const existingToast = document.querySelector('.toast');
        if (existingToast) {
            existingToast.remove();
        }
        
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 400);
        }, 3000);
    }
    
    // Add CSS for new elements
    const style = document.createElement('style');
    style.textContent = `
        .ripple-effect {
            position: absolute;
            background: rgba(255,255,255,0.3);
            border-radius: 50%;
            width: 100px;
            height: 100px;
            pointer-events: none;
            transform: translate(-50%, -50%) scale(0);
            animation: ripple 0.5s ease-out;
        }
        
        @keyframes ripple {
            to {
                transform: translate(-50%, -50%) scale(3);
                opacity: 0;
            }
        }
        
        .viewers-indicator {
            margin: 10px 0;
            font-size: 13px;
            color: #666;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .viewers-indicator i {
            color: var(--primary-color);
        }
        
        .pulse {
            animation: pulse 1s ease-in-out;
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(style);
});
