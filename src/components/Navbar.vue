<template>
  <nav class="navbar navbar-dark bg-dark fixed-top">
    <div class="container-fluid">
      <a class="navbar-brand">{{ title }}</a>
      <div class="d-flex align-items-center">

        <div class="row">
          <div class="col-5">
            <input v-model="query" class="form-control me-2 search-button" id="search" type="search" placeholder="" />

          </div>
          <div class="col-2">
            <button @click="search" class="btn btn-outline-success" type="button">Search</button>
          </div>
          <div class="col-2">
            
            <div v-if="!isAuthenticated()" class="d-flex align-items-center">
              <button @click="showPopup = true" class="btn btn-primary" type="button">Login</button>
            </div>
          </div>

          <div class="col-3">
            <div v-if="!isAuthenticated()" class="d-flex align-items-center">
              <button @click="showPopup = true" class="btn btn-success" type="button">Sign Up</button>
            </div>

            <div v-else class="d-flex align-items-center">
              <div class="dropdown">
                <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton"
                  data-bs-toggle="dropdown" aria-expanded="false">
                  {{ username }}
                </button>
                <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                  <li><a class="dropdown-item" href="#">Profile</a></li>
                  <li><a class="dropdown-item" href="#">Settings</a></li>
                  <li><a class="dropdown-item" @click="logout" href="#">Logout</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div class="col-2">
            <LoginPopup v-if="showPopup" @login="handleLogin" />
          </div>
        </div>
      </div>
    </div>    
  </nav>
</template>

<script>
import LoginPopup from '@/components/LoginPopup.vue'; // Import the LoginPopup component

export default {
  name: 'Navbar',
  props: {
    title: {
      type: String,
      default: 'Flownotes'
    }
  },
  data() {
    return {
      query: '',
      showPopup: false,
      email: '',
      password: '',
      username: '',
      apiUrl: String()
    };
  },
  methods: {
    search() {
      this.$emit('search', this.query);
    },
    isAuthenticated() {
      // Check if the user is authenticated based on your authentication logic
      return !!localStorage.getItem('token') && !!this.username;
    },
    async handleLogin(email, password) {
      console.log(`email ${email} password ${password}`);

      this.email = email;
      this.password = password;

      // emit the login event
      this.$emit('login', email, password);
    },
    handleLogout() {
      // Reset other user-related data
      this.username = '';

      // Emit the logout event
      this.$emit('logout');
    }
  },
  components: {
    LoginPopup
  }
};
</script>

<style>
/* Navbar styles... */
</style>
