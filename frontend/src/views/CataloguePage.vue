<template>
    <div class="catalogue">
    <!-- Header with the catalogue title and "My Cart" button -->
    <header class="catalogue-header">
      <h2>Product Catalogue</h2>
      <button class="cart-button" @click="goToCart">
        <img src="../assets/cart_image.png" alt="Cart Icon" class="cart-icon" />
        My Cart
      </button>
    </header>
    
    <!-- Grid of Product Cards -->
    <div class="product-grid">
      <ProductCard
        v-for="product in products"
        :key="product.id"
        :product="product"
        @add-to-cart="addToCart"
      />
    </div>
  </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import apiClient from '../services/axios.js'
  import ProductCard from '../views/reusable/ProductCard.vue'
  import { useRouter } from 'vue-router'
  
  const products = ref([])

  const router = useRouter()

  const fetchProducts = async () => {
    try {
        const response = await apiClient.get('/products')
        products.value = response.data
    } catch (err) {
        console.error('Failed to fetch products:', err)
    }
  }

  const goToCart = () => {
    router.push({ name: 'Cart' })
  }
  
  // Handle adding a product to the cart (this is just a simple console log,
  // but you could update a store or a local cart array)
  const addToCart = (product) => {
    console.log('Adding to cart:', product)
    // e.g., update a cart store or local state
  }

  onMounted(() => {
    fetchProducts()
  })

  </script>
  
  <style scoped>
  .catalogue {
    max-width: 1280px;
    margin: 0 auto;
    padding: 2rem;
    text-align: center;
  }

  .catalogue-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem; /* Added margin to create space below the header */
  }
  
  .product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
  }

  .cart-button {
    background-color: #007bff;      /* A bright blue background */
    border: 1px solid #0056b3;      /* A darker blue border for contrast */
    border-radius: 4px;             /* Rounded corners for a modern look */
    color: #fff;                    /* White text for clarity */
    display: flex;                  /* Flexbox layout for vertical and horizontal alignment */
    align-items: center;            /* Center children vertically */
    gap: 0.5rem;                  /* Space between the icon and the text */
    padding: 0.5rem 1rem;           /* Adequate padding for a clickable area */
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s ease, border-color 0.3s ease;
  }

  .cart-button:hover {
    background-color: #0056b3;      /* Darker background on hover */
    border-color: #003f7f;          /* Even darker border on hover */
  }

  button.cart-button img.cart-icon {
    width: 24px;
    height: 24px;
    object-fit: contain;
  }
  </style>
  