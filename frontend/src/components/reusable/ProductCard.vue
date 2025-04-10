<template>
    <div class="product-card">
      <div class="product-details">
        <h3 class="product-title">{{ product.name }}</h3>
        <div class="product-footer">
          <span class="product-price">${{ product.price }}</span>
          <button @click="handleAddToCart" class="btn add-to-cart">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>

  const props = defineProps({
    product: {
      type: Object,
      required: true
    }
  })
  
  // Define an emitter to send out an event when the product is added to the cart.
  const emit = defineEmits(['add-to-cart'])
  
  // This function is called when the "Add to Cart" button is pressed.
  const handleAddToCart = () => {
    // Emit the "add-to-cart" event with the product data.
    emit('add-to-cart', props.product)
  }
  </script>
  
  <style scoped>
  .product-card {
  border: 1px solid #555;            /* Darker border for contrast */
  border-radius: 8px;
  background-color: #2c2c2c;           /* Dark background */
  padding: 16px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  color: #e0e0e0;                    /* Light text color for readability */
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
  color: #fff;                       /* Ensure title is in white */
}

.product-footer {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
}

.product-price {
  font-size: 1.2rem;
  font-weight: bold;
}

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
  </style>
  