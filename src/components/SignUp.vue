<template>
  <div class="signup">
    <div class="signup-content">
      <h2>Sign Up</h2>
      <div>
        <input type="text" id="username" v-model="username" placeholder="Username" required>
      </div>
      <div>
        <input type="email" id="email" v-model="email" placeholder="Email" required>
      </div>
      <div>
        <input type="password" id="password" v-model="password" placeholder="Password" required>
      </div>
      <button type="submit" @click="submitForm">Sign Up</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      email: '',
      password: '',
    };
  },
  methods: {
    submitForm() {
      this.$emit('signup', { 
        username: this.username, 
        email: this.email, 
        password: this.password
      });
    },
  },
};
</script>
  
  <style scoped>
  .signup {
    width: 300px;
    margin: 0 auto;
  }
  
  .form-group {
    margin-bottom: 1em;
  }
  
  label {
    display: block;
    margin-bottom: 0.5em;
  }
  
  input {
    width: 100%;
    padding: 0.5em;
    margin-bottom: 0.5em;
  }
  
  button {
    padding: 0.5em 1em;
    background-color: #007BFF;
    color: white;
    border: none;
    cursor: pointer;
  }
  </style>
  