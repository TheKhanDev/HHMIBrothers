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
    emailOrderBtn.addEventListener('click', placeEmailOrder);
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
        if (window.innerWidth <= 768) {
            themeSelectorNav.classList.toggle('active');
            console.log('Mobile theme selector toggled');
        }
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
    
    if (!validateForm()) {
        console.warn('Form validation failed for WhatsApp order');
        return;
    }
    
    const orderData = getOrderData();
    const message = formatOrderMessage(orderData);
    const phone = "+923441092910";
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    
    // Open WhatsApp in new tab
    window.open(url, '_blank');
    closeOrderModal();
    
    console.log('WhatsApp order initiated');
}

/**
 * Places order via Email
 */
function placeEmailOrder() {
    console.log('Placing order via Email');
    
    if (!validateForm()) {
        console.warn('Form validation failed for Email order');
        return;
    }
    
    const orderData = getOrderData();
    const subject = `NEW ORDER - HHMI Brothers`;
    const body = formatOrderMessage(orderData);
    const email = "waqaskhank128@gmail.com";
    const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Open default email client
    window.location.href = url;
    closeOrderModal();
    
    console.log('Email order initiated');
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
    return `NEW ORDER - HHMI Brothers

ORDER DETAILS:
────────────────
Product: ${data.product}
Unit Price: PKR ${data.price.toLocaleString()}
Quantity: ${data.quantity}
Total Amount: PKR ${data.total.toLocaleString()}

CUSTOMER INFORMATION:
────────────────
Full Name: ${data.name}
Phone: ${data.phone}
Email: ${data.email}
Delivery Address: ${data.address}
Size: ${data.size}

SPECIAL INSTRUCTIONS:
────────────────
${data.instructions || 'None'}

────────────────
Order placed via HHMI Brothers Website
Order Time: ${data.time}
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
    
    // Check required fields
    if (!name || !phone || !email || !address || !size) {
        alert('Please fill in all required fields.');
        return false;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address.');
        return false;
    }
    
    console.log('Form validation passed');
    return true;
}

// Debug: Log initialization complete
console.log('Script.js loaded and initialized successfully');