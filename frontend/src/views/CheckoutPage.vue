<template>
    <div class="checkout-container">
      <div class="checkout-left">
        <div class="summary-section">
          <h2>Order Summary</h2>
          <p class="summary-detail">Total Price: {{ formattedTotalPrice }}</p>
          <p class="summary-detail">Total Products: {{ totalQuantity }}</p>
        </div>
  
        <form class="checkout-form" @submit.prevent="placeOrder">
          <h3>Checkout Details</h3>
  
          <div class="form-group">
            <label for="name">Name</label>
            <input 
              type="text" 
              id="name" 
              v-model="name" 
              placeholder="Enter your name" 
              required 
            />
            <div v-if="errors.name" class="error-message">{{ errors.name }}</div>
          </div>
  
          <div class="form-group">
            <label for="address">Address</label>
            <input 
              type="text" 
              id="address" 
              v-model="address" 
              placeholder="Enter your address" 
              required 
            />
            <div v-if="errors.address" class="error-message">{{ errors.address }}</div>
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input 
              type="text" 
              id="email" 
              v-model="email" 
              placeholder="Enter your email" 
              required 
            />
            <div v-if="errors.email" class="error-message">{{ errors.email }}</div>
          </div>
  
          <button type="submit" class="btn place-order-btn">Place Order</button>
        </form>
      </div>
  
      <div class="checkout-right">
        <h2>Cart Items</h2>
        <div class="cart-items">
          <ProductCard
            v-for="item in cartItems"
            :key="item.id"
            :product="item"
            :cartQuantity="item.quantity"
            @increment="incrementQuantity"
            @decrement="decrementQuantity"
          />
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useStore } from 'vuex';
  import ProductCard from '../views/reusable/ProductCard.vue';
  
  const store = useStore();
  
  const name = ref('');
  const address = ref('');
  const email = ref('');

  const errors = ref({});
  
  const cartItems = computed(() => store.getters['cart/cartItems']);
  const totalPrice = computed(() =>
    cartItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
  );
  const totalQuantity = computed(() =>
    cartItems.value.reduce((sum, item) => sum + item.quantity, 0)
  );
  
  const formattedTotalPrice = computed(() => totalPrice.value.toFixed(2));
  
  onMounted(() => {
    store.dispatch('cart/fetchCart');
  });

  const validateForm = () => {
    errors.value = {};
    
    if (!name.value.trim()) {
        errors.value.name = 'Name is required.';
    }
    if (!address.value.trim()) {
        errors.value.address = 'Address is required.';
    }
    if (!email.value.trim()) {
        errors.value.email = 'Email is required.';
    } else {
        const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
        if (!emailRegex.test(email.value)) {
        errors.value.email = 'Please enter a valid email address.';
        }
    }
    
    return Object.keys(errors.value).length === 0;
  };
  
  const placeOrder = () => {
    if (!validateForm()) {
        return;
    }
    
    alert(`Order placed for ${name.value} at ${address.value}!`);
    name.value = '';
    address.value = '';
    email.value = '';
};
  
  const incrementQuantity = (product) => {
    store.dispatch('cart/updateQuantity', {
      productId: product.id,
      quantity: product.quantity + 1
    });
  };
  
  const decrementQuantity = (product) => {
    store.dispatch('cart/removeFromCart', product);
  };
  </script>
  
  <style scoped>
  .checkout-container {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 2rem;
    max-width: 1200px;
    margin: 0 auto;
    padding: 1.5rem;
  }
  
  .checkout-left {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .summary-section {
    padding: 1rem;
    border: 1px solid #ccc;
    border-radius: 6px;
  }
  .summary-detail {
    margin: 0.25rem 0;
  }
  
  .checkout-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    border: 1px solid #ccc;
    border-radius: 6px;
  }
  
  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }
  .form-group label {
    font-weight: bold;
  }
  .form-group input {
    padding: 0.5rem;
    border: 1px solid #aaa;
    border-radius: 4px;
  }
  
  .checkout-right {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  .cart-items {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .cart-item {
    padding: 1rem;
    border: 1px solid #ccc;
    border-radius: 6px;
    background-color: #fff;
  }
  .cart-item-info {
    display: flex;
    justify-content: space-between;
  }
  .item-name {
    font-weight: bold;
  }
  
  .btn {
    cursor: pointer;
  }
  .place-order-btn {
    background-color: #28a745;
    color: #fff;
    border: 1px solid #1f7f34;
    padding: 0.6rem;
    border-radius: 4px;
    transition: background-color 0.3s ease;
  }
  .place-order-btn:hover {
    background-color: #1f7f34;
  }
  </style>
  