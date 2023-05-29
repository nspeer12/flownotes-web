<template>
    <div class="signup">
      <div class="signup-content">
        <h2>Welcome to Flownotes</h2>
        <div>
          <input v-model="email" type="email" placeholder="Email" />
        </div>
        <div>
          <input v-model="password" type="password" placeholder="Password" />
        </div>
        <div>
          <input v-model="confirmPassword" type="password" placeholder="Confirm Password" />
        </div>
        <button @click="signup">Sign Up</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        email: '',
        password: '',
        confirmPassword: '',
      };
    },
    methods: {
      signup() {
        if(this.password === this.confirmPassword) {
          console.log(`signup ${this.email}`)
          this.$emit('signup', this.email, this.password);
        } else {
          console.log('Passwords do not match!');
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .signup {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .signup-content {
    background-color: #333;
    padding: 20px;
    border-radius: 5px;
    color: #fff;
  }
  
  .signup-content h2 {
    color: #fff;
  }
  
  .signup-content input {
    background-color: #444;
    color: #fff;
    border: none;
    padding: 10px;
    margin-bottom: 10px;
    width: 100%; /* Make the input fields stretch to the width of their parent div */
    box-sizing: border-box; /* Include padding and border in the element's total width and height */
  }
  
  .signup-content button {
    background-color: #555;
    color: #fff;
    border: none;
    padding: 10px 20px;
    cursor: pointer;
  }
  
  .signup-content button:hover {
    background-color: #666;
  }
  </style>
  