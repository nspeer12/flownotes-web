<template>
    <div>
      <input v-model="email" type="text" placeholder="email" />
      <input v-model="password" type="password" placeholder="Password" />
      <button @click="login">Login</button>
    </div>
  </template>
  
  <script>
  import { UserLogin } from '@/api/schemas'; // Import the UserLogin schema from your API schemas
  
  export default {
    data() {
      return {
        email: String(),
        password: String()
      };
    },
    methods: {
      async login() {

        console.log(`email: ${this.email}`);

        const user = new UserLogin({
          email: this.email,
          password: this.password
        });
  
        // Call your login API endpoint
        const apiUrl = 'http://0.0.0.0:5000/login';
  
        const res = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(user)
        });
  
        if (res.ok) {
          const data = await res.json();
  
          // Retrieve the token from the response
          const token = data.token;
            
          this.userid = data.userid;
          // Store the token in local storage
          localStorage.setItem('token', token);
  
          // Perform any necessary actions after successful login
          // For example, redirect to a different page or fetch user data
        } else {
          // Handle login failure
          console.error('Login failed');
        }
      }
    }
  };
  </script>
  