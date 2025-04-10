<template>
  <div class="product-card">
    <div class="product-details">
      <h3 class="product-title">{{ product.name }}</h3>
      <div class="product-footer">
        <!-- If product is already in cart (cartQuantity > 0), show quantity controls -->
        <template v-if="cartQuantity > 0">
          <button class="quantity-btn" @click="decrement">
            <img src="../../assets/minus.png" alt="Minus" />
          </button>
          <span class="quantity-counter">{{ cartQuantity }}</span>
          <button class="quantity-btn" @click="increment">
            <img src="../../assets/plus.png" alt="Plus" />
          </button>
        </template>
        <!-- Otherwise, show the price and the "Add to Cart" button -->
        <template v-else>
          <span class="product-price">${{ product.price }}</span>
          <button class="btn add-to-cart" @click="handleAddToCart">
            Add to Cart
          </button>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  product: {
    type: Object,
    required: true
  },
  // The parent should pass the current quantity of the product in the cart.
  cartQuantity: {
    type: Number,
    default: 0
  }
});

// Emit events so the parent component can react (e.g., by dispatching Vuex actions)
const emit = defineEmits(['add-to-cart', 'increment', 'decrement']);

const handleAddToCart = () => {
  emit('add-to-cart', props.product);
};

const increment = () => {
  emit('increment', props.product);
};

const decrement = () => {
  emit('decrement', props.product);
};
</script>

<style scoped>
.product-card {
  border: 1px solid #555;
  border-radius: 8px;
  background-color: #2c2c2c;
  padding: 16px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  color: #e0e0e0;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.product-details {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.product-title {
  font-size: 1.2rem;
  margin-bottom: 8px;
  color: #fff;
}

.product-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 12px;
}

.product-price {
  font-size: 1.2rem;
  font-weight: bold;
}

/* Standard Add to Cart button styling */
.btn.add-to-cart {
  padding: 8px 16px;
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  color: #fff;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s ease;
}

.btn.add-to-cart:hover {
  background-color: #0056b3;
}

/* Styling for quantity control buttons (circular) */
.quantity-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  background-color: #007bff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  transition: background-color 0.3s ease;
}

.quantity-btn:hover {
  background-color: #0056b3;
}

.quantity-btn img {
  width: 16px;
  height: 16px;
  object-fit: contain;
}

.quantity-counter {
  font-size: 1rem;
  min-width: 24px;
  text-align: center;
  color: #fff;
}
</style>
