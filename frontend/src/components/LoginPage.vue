<template>
    <div class="login-container">
      <h2>Login</h2>
      <form @submit.prevent="login">
        <div class="form-group">
          <label for="username">Username</label>
          <input
            type="text"
            id="username"
            v-model="username"
            placeholder="Enter your username"
            required
          />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            v-model="password"
            placeholder="Enter your password"
            required
          />
        </div>
        <button 
        type="submit"
        v-bind:disabled="username.length === 0 || password.length === 0"
        >
        Login
      </button>
      </form>
      <p v-if="error" class="error">{{ error }}</p>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  // Define reactive properties for the login credentials and error message.
  const username = ref('');
  const password = ref('');
  const error = ref('');
  
  // A simple login function that validates the credentials.
  // Replace the hardcoded logic with real authentication as needed.
  const login = () => {
    if (username.value === 'admin' && password.value === 'password') {
      // Handle successful login (e.g., redirect, set token, etc.)
      alert('Login successful!');
      error.value = '';
    } else {
      // Display an error message if credentials do not match.
      error.value = 'Invalid username or password.';
    }
  };
  </script>
  
  <style scoped>
  .login-container {
    max-width: 400px;
    margin: 50px auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-family: Arial, sans-serif;
  }
  
  h2 {
    text-align: center;
    margin-bottom: 20px;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }
  
  .form-group input {
    width: 100%;
    padding: 8px;
    box-sizing: border-box;
  }
  
  button {
    width: 100%;
    padding: 10px;
    background-color: #007bff;
    border: none;
    border-radius: 3px;
    color: #fff;
    font-size: 16px;
    cursor: pointer;
  }

  button:disabled {
    background-color: #888686;
    cursor: not-allowed;
  }
  
  button:hover {
    background-color: #0056b3;
  }
  
  .error {
    color: red;
    margin-top: 10px;
    text-align: center;
  }
  </style>
  