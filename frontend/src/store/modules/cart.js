import apiClient from '../../services/axios.js';

export default {
  namespaced: true,
  state: () => ({
    items: []
  }),
  getters: {
    cartItems(state) {
      return state.items;
    }
  },
  mutations: {
    SET_CART(state, cartItems) {
      state.items = cartItems;
    },
    // Upsert (update or insert) a cart item:
    // If the product already exists, update its quantity; otherwise, add it.
    UPSERT_CART_ITEM(state, product) {
      const existing = state.items.find(item => item.id === product.id);
      if (existing) {
          // Update the quantity to match what the backend returns.
          existing.quantity = product.quantity;
      } else {
          state.items.push(product);
      }
    },
    // Remove an item from the cart.
    REMOVE_ITEM(state, product) {
        // Find the index of the item in the state.
        const index = state.items.findIndex(item => item.id === product.id);
        if (index !== -1) {
          // If the item's quantity is 2 or more, decrement the quantity.
          if (state.items[index].quantity >= 2) {
            state.items[index].quantity -= 1;
          } else {
            // Otherwise, remove the item completely.
            state.items.splice(index, 1);
          }
        }
    }
  },
  actions: {
    // Fetch the current cart from the backend.
    async fetchCart({ commit }) {
      try {
        const response = await apiClient.get('/cart');
        commit('SET_CART', response.data.products);
      } catch (error) {
        console.error('Failed to fetch cart:', error);
      }
    },
    async addToCart({ commit }, product) {
      try {
        const response = await apiClient.post('/cart', {
          productId: product.id
        });


        commit('UPSERT_CART_ITEM', response.data.product);
      } catch (error) {
        console.error('Error adding to cart:', error);
      }
    },
    // Remove an item from the cart on the backend.
    async removeFromCart({ commit, state }, product) {
      // Check if the product exists in the cart.
      const productExists = state.items.some(item => item.id === product.id);
  
      if (!productExists) {
        alert(`Product ${product.id} not found in cart. No removal performed.`);
        return;
      }

      try {
        const response = await apiClient.delete(`/cart`, { data: {
            productId: product.id
        }});
        commit('REMOVE_ITEM', response.data.product);
      } catch (error) {
        console.error('Error removing from cart:', error);
      }
    }
  }
}
