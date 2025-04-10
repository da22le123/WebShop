// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../views/LoginPage.vue'
import CataloguePage from '../views/CataloguePage.vue'
import CheckoutPage from '../views/CheckoutPage.vue'

const routes = [
  {
    path: '/',
    name: 'Landing',
    // Redirect based on authentication status
    redirect: () => {
      return localStorage.getItem('token')
        ? { name: 'Catalogue' }
        : { name: 'Login' }
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage
  },
  {
    path: '/catalogue',
    name: 'Catalogue',
    component: CataloguePage,
    meta: { requiresAuth: true }
  },
  {
    path: '/checkout',
    name: 'CheckoutPage',
    component: CheckoutPage,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Global navigation guard to protect routes requiring authentication
router.beforeEach((to, from, next) => {
  const isLoggedIn = !!localStorage.getItem('token')
  
  // If the route requires auth and the user is not logged in, redirect to Login
  if (to.meta.requiresAuth && !isLoggedIn) {
    next({ name: 'Login' })
  }
  // If the user is already logged in and tries to access the Login page, redirect them
  else if (to.name === 'Login' && isLoggedIn) {
    next({ name: 'Catalogue' })
  }
  else {
    next()
  }
})

export default router