<template>
    <div class="login-popup">
      <div class="login-popup-content">
        <h2>Welcome back</h2>
        <div>
            <input v-model="email" type="text" placeholder="Email" />
        </div>
        <div>
            <input v-model="password" type="password" placeholder="Password" />
        </div>
        
       
        <button @click="login(email, password)">Login</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        email: '',
        password: ''
      };
    },
    methods: {
      login(email, password) {
        console.log(`login ${email}`)
        this.$emit('login', email, password);
      }
    }
  };
  </script>
  
  <style scoped>
  .login-popup {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8); /* Make the popup background darker */
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .login-popup-content {
    background-color: #333; /* Dark background for the content */
    padding: 20px;
    border-radius: 5px;
    color: #fff; /* White color for the text */
  }
  
  .login-popup-content h2 {
    color: #fff; /* White color for the heading */
  }
  
  .login-popup-content input {
    background-color: #444; /* Darker background for the inputs */
    color: #fff; /* White color for the input text */
    border: none; /* Remove the default border */
    padding: 10px; /* Add some padding */
    margin-bottom: 10px; /* Add some margin */
  }
  
  .login-popup-content button {
    background-color: #555; /* Darker background for the button */
    color: #fff; /* White color for the button text */
    border: none; /* Remove the default border */
    padding: 10px 20px; /* Add some padding */
    cursor: pointer; /* Add a pointer cursor on hover */
  }
  
  .login-popup-content button:hover {
    background-color: #666; /* Add a darker background on hover */
  }
  </style>
  