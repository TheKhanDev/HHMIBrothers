// ===== PRODUCTS DATA MODULE =====
// This file contains all product data and is loaded first
// before other JavaScript files that depend on this data

/**
 * Array of product objects containing all jacket information
 * Each product has: id, name, price, image, description, and category
 */
const products = [
    {
        id: 1,
        name: "Men's Winter Parka Jacket",
        price: 5499,
        image: "assets/images/products/jacket1.jpeg",
        description: "Warm and stylish winter parka with hood and multiple pockets",
        category: "winter"
    },
    {
        id: 2,
        name: "Women's Faux Leather Jacket",
        price: 4299,
        image: "assets/images/products/jacket2.jpeg",
        description: "Elegant faux leather jacket perfect for casual and formal occasions",
        category: "leather"
    },
    {
        id: 3,
        name: "Men's Denim Jacket",
        price: 3299,
        image: "assets/images/products/jacket3.jpeg",
        description: "Classic denim jacket with a modern fit and comfortable feel",
        category: "denim"
    },
    {
        id: 4,
        name: "Women's Puffer Jacket",
        price: 4799,
        image: "assets/images/products/jacket4.jpeg",
        description: "Lightweight yet warm puffer jacket with water-resistant finish",
        category: "winter"
    },
    {
        id: 5,
        name: "Men's Bomber Jacket",
        price: 3999,
        image: "assets/images/products/jacket5.jpeg",
        description: "Classic bomber jacket with ribbed cuffs and comfortable fit",
        category: "casual"
    },
    {
        id: 6,
        name: "Women's Trench Coat",
        price: 5999,
        image: "assets/images/products/jacket3.jpeg",
        description: "Elegant trench coat perfect for formal occasions and rainy days",
        category: "formal"
    },
    {
        id: 7,
        name: "Men's Hooded Jacket",
        price: 3799,
        image: "assets/images/products/jacket1.jpeg",
        description: "Comfortable hooded jacket for everyday wear",
        category: "casual"
    },
    {
        id: 8,
        name: "Women's Windbreaker",
        price: 3499,
        image: "assets/images/products/jacket.jpeg",
        description: "Lightweight windbreaker perfect for windy days",
        category: "casual"
    }
];

// Debug: Log products to console to verify data is loaded
console.log('Products data loaded:', products.length, 'products found');