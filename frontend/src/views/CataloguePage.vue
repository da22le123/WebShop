<template>
    <div class="catalogue">
    <header class="catalogue-header">
      <h2>Product Catalogue</h2>
      <button class="checkout-button" @click="goToCheckout">
        <img src="../assets/cart_image.png" alt="Cart Icon" class="cart-icon" />
        Checkout
      </button>
    </header>

    <div class="filter-row">
      <div class="search-container">
        <input 
          v-model="searchTerm" 
          type="text" 
          placeholder="Search products..." 
          class="search-input" 
        />
      </div>
      <div class="sort-container">
        <label for="sortOrder">Sort by:</label>
        <select id="sortOrder" v-model="sortOrder" class="sort-select">
          <option value="">None</option>
          <option value="priceAsc">Price: Low to High</option>
          <option value="priceDesc">Price: High to Low</option>
        </select>
      </div>
    </div>
    
    <div class="product-grid">
      <ProductCard
        v-for="product in sortedProducts"
        :key="product.id"
        :product="product"
        :cartQuantity="getCartQuantity(product.id)"
        @add-to-cart="addToCart"
        @increment="incrementQuantity"
        @decrement="decrementQuantity"
      />
    </div>
  </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed, watch } from 'vue'
  import { useStore } from 'vuex';
  import apiClient from '../services/axios.js'
  import ProductCard from '../views/reusable/ProductCard.vue'
  import { useRouter } from 'vue-router'
  
  const products = ref([])
  const store = useStore();
  const router = useRouter()

  const searchTerm = ref('')
  let debounceTimeout = null;

  const sortOrder = ref('')


  const cartItems = computed(() => store.getters['cart/cartItems'])

  const fetchProducts = async (query = '') => {
    try {
      const response = await apiClient.get('/products', {
        params: { search: query }
      })
        products.value = response.data
    } catch (err) {
        console.error('Failed to fetch products:', err)
    }
  }

  watch(searchTerm, (newQuery) => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    debounceTimeout = setTimeout(() => {
      fetchProducts(newQuery);
    }, 300);
  });

  const sortedProducts = computed(() => {
    let sorted = [...products.value]
    if (sortOrder.value === 'priceAsc') {
      sorted.sort((a, b) => a.price - b.price)
    } else if (sortOrder.value === 'priceDesc') {
      sorted.sort((a, b) => b.price - a.price)
    }
    return sorted
  })

  const getCartQuantity = (productId) => {
    const found = cartItems.value.find((item) => item.id === productId)
    return found ? found.quantity : 0
  }

  const incrementQuantity = (product) => {
    store.dispatch('cart/addToCart', product)
  }

  const decrementQuantity = (product) => {
    store.dispatch('cart/removeFromCart', product)
  }

  const goToCheckout = () => {
    router.push({ name: 'CheckoutPage' })
  }
  
  const addToCart = (product) => {
    console.log('Adding to cart:', product);
    store.dispatch('cart/addToCart', product);
  }

  onMounted(() => {
    fetchProducts()
    store.dispatch('cart/fetchCart');
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

  .checkout-button {
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

  .checkout-button:hover {
    background-color: #0056b3;      /* Darker background on hover */
    border-color: #003f7f;          /* Even darker border on hover */
  }

  button.checkout-button img.cart-icon {
    width: 24px;
    height: 24px;
    object-fit: contain;
  }

  .filter-row {
    position: relative;
    margin-bottom: 1.5rem;
  }

  .search-container {
    width: 100%;
    text-align: center;
  }

  .search-input {
    width: 100%;
    max-width: 400px;
    padding: 0.5rem;
    font-size: 1rem;
    border: 1px solid #aaa;
    border-radius: 4px;
  }

  .sort-container {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .sort-select {
    padding: 0.3rem;
    font-size: 1rem;
    border: 1px solid #aaa;
    border-radius: 4px;
  }
  </style>
  