<template>
    <div class="catalogue">
      <h2>Product Catalogue</h2>
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
  import ProductCard from '../components/reusable/ProductCard.vue'
  
  const products = ref([])

  const fetchProducts = async () => {
    try {
        const response = await apiClient.get('/products')
        products.value = response.data
    } catch (err) {
        console.error('Failed to fetch products:', err)
    }
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
  
  .product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
  }
  </style>
  