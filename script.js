// ===== MAIN SCRIPT FILE =====
// This file contains the core functionality of the website
// It handles: product display, search, sort, themes, and order management

// ===== DOM ELEMENTS =====
// Cache all frequently used DOM elements for better performance

// Product and UI Elements
const productsContainer = document.getElementById('products-container');
const orderModal = document.getElementById('orderModal');
const closeModal = document.querySelector('.close-modal');
const orderForm = document.getElementById('orderForm');
const productQuantity = document.getElementById('product-quantity');

// Order Action Buttons
const whatsappOrderBtn = document.getElementById('whatsapp-order');
const emailOrderBtn = document.getElementById('email-order');

// Navigation Elements
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');

// Search and Sort Elements
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const sortSelect = document.getElementById('sortSelect');

// Theme Elements
const themeToggleNav = document.getElementById('themeToggleNav');
const themeSelectorNav = document.getElementById('themeSelectorNav');
const themeOptions = document.querySelectorAll('.theme-option');

// Scroll to Top Element
const scrollToTop = document.getElementById('scrollToTop');

// Order Summary Elements
const summaryProduct = document.getElementById('summary-product');
const summaryPrice = document.getElementById('summary-price');
const summaryQuantity = document.getElementById('summary-quantity');
const summaryTotal = document.getElementById('summary-total');

// ===== GLOBAL VARIABLES =====
let currentProduct = null;      // Currently selected product for ordering
let filteredProducts = [...products]; // Copy of products for filtering

// ===== INITIALIZATION FUNCTION =====
/**
 * Initializes the website when DOM is fully loaded
 * Sets up all event listeners and initial state
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('Website initialized - DOM fully loaded');
    
    // Load and display products
    loadProducts(products);
    
    // Set up event listeners for modal
    setupModalEvents();
    
    // Set up event listeners for navigation
    setupNavigationEvents();
    
    // Set up event listeners for search and sort
    setupSearchAndSortEvents();
    
    // Set up event listeners for themes
    setupThemeEvents();
    
    // Set up event listeners for scrolling
    setupScrollEvents();
    
    // Load saved theme from localStorage
    loadSavedTheme();
});

// ===== MODAL MANAGEMENT FUNCTIONS =====

/**
 * Sets up event listeners for the order modal
 */
function setupModalEvents() {
    // Close modal when X is clicked
    closeModal.addEventListener('click', closeOrderModal);
    
    // Close modal when clicking outside
    window.addEventListener('click', outsideModalClick);
    
    // Update order summary when quantity changes
    productQuantity.addEventListener('change', updateOrderSummary);
    
    // Order placement buttons
    whatsappOrderBtn.addEventListener('click', placeWhatsAppOrder);
    emailOrderBtn.addEventListener('click', placeEmailOrder);  // ← THIS SHOULD BE placeEmailOrder
}
/**
 * Opens the order modal for a specific product
 * @param {number} productId - ID of the product to order
 */
function openOrderModal(productId) {
    console.log('Opening order modal for product ID:', productId);
    
    // Find the product by ID
    currentProduct = products.find(p => p.id === productId);
    
    if (currentProduct) {
        // Update the order summary with product details
        updateOrderSummary();
        
        // Show the modal and disable body scrolling
        orderModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        console.log('Modal opened for:', currentProduct.name);
    } else {
        console.error('Product not found with ID:', productId);
    }
}

/**
 * Closes the order modal and resets the form
 */
function closeOrderModal() {
    console.log('Closing order modal');
    orderModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    orderForm.reset();
    productQuantity.value = 1;
    currentProduct = null;
}

/**
 * Handles clicks outside the modal to close it
 * @param {Event} e - The click event
 */
function outsideModalClick(e) {
    if (e.target === orderModal) {
        closeOrderModal();
    }
}

/**
 * Updates the order summary based on current product and quantity
 */
function updateOrderSummary() {
    if (!currentProduct) {
        console.warn('No current product selected for order summary');
        return;
    }
    
    const quantity = parseInt(productQuantity.value) || 1;
    const total = currentProduct.price * quantity;
    
    // Update summary elements
    summaryProduct.textContent = `Product: ${currentProduct.name}`;
    summaryPrice.textContent = `Unit Price: PKR ${currentProduct.price.toLocaleString()}`;
    summaryQuantity.textContent = `Quantity: ${quantity}`;
    summaryTotal.textContent = `Total Amount: PKR ${total.toLocaleString()}`;
    
    console.log('Order summary updated - Quantity:', quantity, 'Total:', total);
}

// ===== PRODUCT MANAGEMENT FUNCTIONS =====

/**
 * Loads and displays products in the products grid
 * @param {Array} productsToLoad - Array of product objects to display
 */
function loadProducts(productsToLoad) {
    console.log('Loading products:', productsToLoad.length);
    
    // Clear existing products
    productsContainer.innerHTML = '';
    
    // Check if there are products to display
    if (productsToLoad.length === 0) {
        productsContainer.innerHTML = '<p class="no-products">No products found matching your criteria.</p>';
        console.log('No products to display');
        return;
    }
    
    // Create and append product cards
    productsToLoad.forEach(product => {
        const productCard = createProductCard(product);
        productsContainer.appendChild(productCard);
    });
    
    // Add event listeners to buy buttons
    setupBuyButtonEvents();
    
    console.log('Products loaded successfully');
}

/**
 * Creates a product card HTML element
 * @param {Object} product - Product object
 * @returns {HTMLElement} Product card element
 */
function createProductCard(product) {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    productCard.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="product-img" 
             onerror="this.src='assets/images/placeholder-icon.png';">
        <div class="product-info">
            <h3 class="product-title">${product.name}</h3>
            <p class="product-category">${product.category}</p>  <!-- ✅ ADDED CATEGORY -->
            <p class="product-description">${product.description}</p>  <!-- ✅ ADDED DESCRIPTION -->
            <p class="product-price">PKR ${product.price.toLocaleString()}</p>
            <button class="buy-now" data-id="${product.id}">Buy Now</button>
        </div>
    `;
    return productCard;
}

/**
 * Sets up event listeners for all buy buttons
 */
function setupBuyButtonEvents() {
    const buyButtons = document.querySelectorAll('.buy-now');
    console.log('Setting up events for', buyButtons.length, 'buy buttons');
    
    buyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            console.log('Buy button clicked for product ID:', productId);
            openOrderModal(productId);
        });
    });
}

// ===== NAVIGATION FUNCTIONS =====

/**
 * Sets up navigation event listeners
 */
function setupNavigationEvents() {
    // Mobile menu toggle
    menuToggle.addEventListener('click', toggleMobileMenu);
    
    // Smooth scrolling for navigation links
    setupSmoothScrolling();
}

/**
 * Toggles the mobile navigation menu
 */
function toggleMobileMenu() {
    mainNav.classList.toggle('active');
    console.log('Mobile menu toggled:', mainNav.classList.contains('active'));
}

/**
 * Sets up smooth scrolling for navigation links
 */
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
                
                // Close mobile menu after clicking a link (mobile only)
                if (window.innerWidth <= 768) {
                    mainNav.classList.remove('active');
                    themeSelectorNav.classList.remove('active');
                }
                
                console.log('Smooth scroll to:', targetId);
            }
        });
    });
}

// ===== SEARCH AND SORT FUNCTIONS =====

/**
 * Sets up event listeners for search and sort functionality
 */
function setupSearchAndSortEvents() {
    // Search functionality
    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    // Sort functionality
    sortSelect.addEventListener('change', performSort);
}

/**
 * Performs search based on input value
 */
function performSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    console.log('Performing search for:', searchTerm);
    
    if (searchTerm === '') {
        // If search is empty, show all products
        filteredProducts = [...products];
    } else {
        // Filter products based on search term
        filteredProducts = products.filter(product => 
            product.name.toLowerCase().includes(searchTerm) || 
            product.description.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm)
        );
    }
    
    console.log('Search results:', filteredProducts.length, 'products found');
    
    // Apply current sort to filtered results
    performSort();
}

/**
 * Performs sorting based on selected sort option
 */
function performSort() {
    const sortValue = sortSelect.value;
    let sortedProducts = [...filteredProducts];
    
    console.log('Performing sort:', sortValue);
    
    switch(sortValue) {
        case 'price-low':
            sortedProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            sortedProducts.sort((a, b) => b.price - a.price);
            break;
        case 'name':
            sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        default:
            // Default sorting (by original order)
            sortedProducts = [...filteredProducts];
    }
    
    // Load sorted products
    loadProducts(sortedProducts);
}

// ===== THEME MANAGEMENT FUNCTIONS =====

/**
 * Sets up event listeners for theme functionality
 */
function setupThemeEvents() {
    // Mobile theme toggle
    themeToggleNav.addEventListener('click', function(e) {
        e.preventDefault();
        // ✅ Works on both mobile AND desktop
        themeSelectorNav.classList.toggle('active');
        console.log('Theme selector toggled');
});
    
    // Theme selection
    themeOptions.forEach(option => {
        option.addEventListener('click', function() {
            const theme = this.getAttribute('data-theme');
            console.log('Theme selected:', theme);
            changeTheme(theme);
            
            // Close mobile theme selector if open
            if (window.innerWidth <= 768) {
                themeSelectorNav.classList.remove('active');
            }
        });
    });
}

/**
 * Changes the website theme
 * @param {string} themeName - Name of the theme to apply
 */
function changeTheme(themeName) {
    // Remove all theme classes and add the selected one
    document.body.className = `${themeName}-theme`;
    
    // Update active state in theme selector
    themeOptions.forEach(option => {
        if (option.getAttribute('data-theme') === themeName) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });
    
    // Save theme preference to localStorage
    localStorage.setItem('hhmi-theme', themeName);
    
    console.log('Theme changed to:', themeName);
}

/**
 * Loads saved theme from localStorage
 */
function loadSavedTheme() {
    const savedTheme = localStorage.getItem('hhmi-theme') || 'default';
    console.log('Loading saved theme:', savedTheme);
    changeTheme(savedTheme);
}

// ===== SCROLL MANAGEMENT FUNCTIONS =====

/**
 * Sets up event listeners for scroll functionality
 */
function setupScrollEvents() {
    // Scroll to top button
    scrollToTop.addEventListener('click', scrollToTopFunction);
    window.addEventListener('scroll', toggleScrollToTop);
}

/**
 * Toggles visibility of scroll to top button
 */
function toggleScrollToTop() {
    if (window.pageYOffset > 300) {
        scrollToTop.classList.add('show');
    } else {
        scrollToTop.classList.remove('show');
    }
}

/**
 * Scrolls the page to the top smoothly
 */
function scrollToTopFunction() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    console.log('Scrolling to top');
}

// ===== ORDER PLACEMENT FUNCTIONS =====

/**
 * Places order via WhatsApp
 */
function placeWhatsAppOrder() {
    console.log('Placing order via WhatsApp');
    
    if (!validateForm()) return;
    
    const orderData = getOrderData();
    const message = formatOrderMessage(orderData);
    const phone = "923429438436"; // No + sign for WhatsApp
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    
    console.log('WhatsApp URL:', url);
    window.open(url, '_blank');
    closeOrderModal();
}


/**
 * Places order via Email
//  */

/**
 * Places order via Email - WORKING VERSION
 */
function placeEmailOrder() {
    console.log('Placing order via Email');
    
    if (!validateForm()) {
        console.warn('Form validation failed for Email order');
        return;
    }
    
    const orderData = getOrderData();
    const email = "hhmibrothers@gmail.com";
    const subject = `NEW ORDER - HHMI Brothers - ${orderData.product}`;
    const body = formatOrderMessage(orderData);
    
    // Create the email content with clear instructions
    const emailContent = `${body}

---
ORDER SUMMARY:
• Product: ${orderData.product}
• Size: ${orderData.size}  
• Quantity: ${orderData.quantity}
• Total: PKR ${orderData.total.toLocaleString()}
• Customer: ${orderData.name}
• Phone: ${orderData.phone}
• Address: ${orderData.address}
${orderData.email ? `• Email: ${orderData.email}` : ''}
${orderData.instructions ? `• Instructions: ${orderData.instructions}` : ''}

Thank you for your order! We'll contact you within 24 hours. 📦`;
    
    // Show copy instructions to user
    showEmailCopyInstructions(emailContent, email, subject);
}

/**
 * Shows instructions to copy and send email
 */
function showEmailCopyInstructions(emailContent, email, subject) {
    // Create a modal popup
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        padding: 20px;
    `;
    
    modal.innerHTML = `
        <div style="background: white; padding: 30px; border-radius: 10px; max-width: 500px; width: 100%; max-height: 80vh; overflow-y: auto;">
            <h3 style="color: #e74c3c; margin-bottom: 20px; text-align: center;">📧 Send Your Order via Email</h3>
            
            <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 20px; border-left: 4px solid #e74c3c;">
                <h4 style="margin: 0 0 10px 0; color: #2c3e50;">Instructions:</h4>
                <ol style="margin: 0; padding-left: 20px; color: #555;">
                    <li>Copy the order details below</li>
                    <li>Open your email app (Gmail, Outlook, etc.)</li>
                    <li>Create new email to: <strong>${email}</strong></li>
                    <li>Paste the order details and send</li>
                </ol>
            </div>
            
            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 8px; font-weight: bold; color: #2c3e50;">Order Details (Click to copy):</label>
                <textarea id="emailOrderText" style="width: 100%; height: 200px; padding: 12px; border: 2px solid #bdc3c7; border-radius: 5px; font-family: monospace; font-size: 12px; resize: vertical;" readonly>${emailContent}</textarea>
            </div>
            
            <div style="display: flex; gap: 10px; justify-content: center;">
                <button onclick="copyEmailOrderText()" style="background: #27ae60; color: white; border: none; padding: 12px 20px; border-radius: 5px; cursor: pointer; font-weight: bold;">
                    📋 Copy Text
                </button>
                <button onclick="closeEmailModal()" style="background: #e74c3c; color: white; border: none; padding: 12px 20px; border-radius: 5px; cursor: pointer; font-weight: bold;">
                    ✓ I've Sent It
                </button>
            </div>
            
            <div style="margin-top: 15px; text-align: center;">
                <a href="https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailContent)}" 
                   target="_blank" 
                   style="color: #3498db; text-decoration: none; font-size: 14px;">
                   ✨ Open Gmail directly (if available)
                </a>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add global functions for the buttons
    window.copyEmailOrderText = function() {
        const textarea = document.getElementById('emailOrderText');
        textarea.select();
        document.execCommand('copy');
        
        // Show copied message
        const button = event.target;
        const originalText = button.textContent;
        button.textContent = '✅ Copied!';
        button.style.background = '#2ecc71';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '#27ae60';
        }, 2000);
    };
    
    window.closeEmailModal = function() {
        modal.remove();
        closeOrderModal();
    };
}

/**
 * Alternative: Try to open Gmail directly
 */
function placeEmailOrderGmail() {
    console.log('Placing order via Gmail');
    
    if (!validateForm()) {
        console.warn('Form validation failed for Email order');
        return;
    }
    
    const orderData = getOrderData();
    const subject = `NEW ORDER - HHMI Brothers - ${orderData.product}`;
    const body = formatOrderMessage(orderData);
    const email = "hhmibrothers@gmail.com";
    
    // Try Gmail direct URL
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Try to open Gmail
    const opened = window.open(gmailUrl, '_blank');
    
    if (!opened || opened.closed || typeof opened.closed == 'undefined') {
        // Gmail failed, fallback to clipboard method
        console.log('Gmail blocked, falling back to clipboard');
        copyOrderToClipboard(body, subject);
    } else {
        closeOrderModal();
    }
}

/**
 * Collects order data from the form
 * @returns {Object} Order data object
 */
function getOrderData() {
    const quantity = parseInt(productQuantity.value) || 1;
    const total = currentProduct.price * quantity;
    const now = new Date();
    const orderTime = now.toLocaleString();
    
    return {
        product: currentProduct.name,
        price: currentProduct.price,
        quantity: quantity,
        total: total,
        name: document.getElementById('customer-name').value,
        phone: document.getElementById('customer-phone').value,
        email: document.getElementById('customer-email').value,
        address: document.getElementById('customer-address').value,
        size: document.getElementById('product-size').value,
        instructions: document.getElementById('special-instructions').value,
        time: orderTime
    };
}

/**
 * Formats the order message for WhatsApp/Email
 * @param {Object} data - Order data
 * @returns {string} Formatted message
 */

function formatOrderMessage(data) {
    // ✅ SIMPLIFIED MESSAGE FORMAT
    return `🛍️ NEW ORDER - HHMI Brothers

📦 ORDER DETAILS:
Product: ${data.product}
Price: PKR ${data.price.toLocaleString()}
Quantity: ${data.quantity}
Total: PKR ${data.total.toLocaleString()}
Size: ${data.size}

👤 CUSTOMER INFO:
Name: ${data.name}
Phone: ${data.phone}
${data.email ? `Email: ${data.email}` : ''}
Address: ${data.address}

📝 INSTRUCTIONS:
${data.instructions || 'None'}
⏰ Order Time: ${data.time};
───────────────────────
Order placed via HHMI Brothers Website
Please process this order and contact the customer for confirmation.`;
}

/**
 * Validates the order form
 * @returns {boolean} True if form is valid
 */
function validateForm() {
    const name = document.getElementById('customer-name').value;
    const phone = document.getElementById('customer-phone').value;
    const email = document.getElementById('customer-email').value;
    const address = document.getElementById('customer-address').value;
    const size = document.getElementById('product-size').value;
    
    console.log('Form validation - Fields:', { name, phone, email, address, size }); // Debug
    
    // Check required fields
    if (!name || !phone || !address || !size) {
        alert('Please fill in all required fields (Name, Phone, Address, Size).');
        return false;
    }
    
    // ✅ MAKE EMAIL OPTIONAL or basic validation
    if (email && !isValidEmail(email)) {
        alert('Please enter a valid email address or leave it empty.');
        return false;
    }
    
    console.log('Form validation passed');
    return true;
}

// ✅ ADD HELPER FUNCTION FOR EMAIL VALIDATION
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Debug: Log initialization complete
console.log('Script.js loaded and initialized successfully');