<template>
  <div class="login my-3">
    <div class="login-content">
      <h2>Welcome back</h2>
      <div>
        <input v-model="email" type="text" placeholder="Email" required />
      </div>
      <div>
        <input v-model="password" type="password" placeholder="Password" required />
      </div>
      <button @click="login(email, password)">Login</button>
      <div class="signup-link pt-3">
        Not a member? 
        <router-link to="/signup" class="badge bg-primary">Sign up</router-link>
      </div>
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
      this.$emit('login', email, password);
    }
  }
};
</script>


<style scoped>
.login {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-content {
  background-color: #333; /* Dark background for the content */
  padding: 20px;
  border-radius: 5px;
  color: #fff; /* White color for the text */
}

.login-content h2 {
  color: #fff; /* White color for the heading */
}

.login-content input {
  background-color: #444; /* Darker background for the inputs */
  color: #fff; /* White color for the input text */
  border: none; /* Remove the default border */
  padding: 10px; /* Add some padding */
  margin-bottom: 10px; /* Add some margin */
}

.login-content button {
  background-color: #555; /* Darker background for the button */
  color: #fff; /* White color for the button text */
  border: none; /* Remove the default border */
  padding: 10px 20px; /* Add some padding */
  cursor: pointer; /* Add a pointer cursor on hover */
}

.login-content button:hover {
  background-color: #666; /* Add a darker background on hover */
}
</style>
