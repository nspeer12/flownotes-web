<template>
  <nav class="navbar navbar-dark bg-dark fixed-top mb-2">
    <div class="container-fluid">
      <a class="navbar-brand">
        {{ title }}
        <span class="badge bg-info">beta</span>
      </a>
      
      <div class="d-flex flex-column flex-md-row align-items-center">
        <div class="my-2 my-md-0 d-none d-md-block">
          <input v-model="query" class="form-control me-2 search-button" id="search" type="search" placeholder="" />
        </div>
        <div class="my-2 my-md-0 mx-md-2 d-none d-md-block">
          <button @click="search" class="btn btn-outline-success" type="button" >Search</button>
        </div>
        <!-- <div class="my-2 my-md-0 mx-md-2">
          <router-link v-if="!loggedIn" to="/login" class="btn btn-primary d-md-none btn-sm">Login</router-link>
          <router-link v-if="!loggedIn" to="/login" class="btn btn-primary d-none d-md-block">Login</router-link>
          <button v-if="loggedIn" @click="logout" class="btn btn-outline-danger d-md-none btn-sm">Logout</button>
          <button v-if="loggedIn" @click="logout" class="btn btn-outline-danger d-none d-md-block">Logout</button>
        </div>
        <div class="my-2 my-md-0 mx-md-2">
          <router-link v-if="!loggedIn" to="/signup" class="btn btn-success d-md-none btn-sm">Sign Up</router-link>
          <router-link v-if="!loggedIn" to="/signup" class="btn btn-success d-none d-md-block">Sign Up</router-link>
        </div> -->
      </div>
    </div>    
  </nav>
</template>



<script>
export default {
  name: 'Navbar',
  props: {
    title: {
      type: String,
      default: 'Flownotes.ai'
    },
    apiUrl: {
      type: String
    },
    loggedIn: {
      type: Boolean
    },
    userid: {
      type: String
    }
  },
  data() {
    return {
      query: String()
    };
  },
  methods: {
    search() {
      this.$emit('search', this.query);
    },
    logout() {
      // Perform logout actions here (e.g., clear token, redirect, etc.)
      console.log('Log out pressed');
      this.$emit('logout');
    }
  },
  created() {
    // Check if a token is present in the browser (adjust this condition based on your specific token storage mechanism)
    if (sessionStorage.getItem('token')) {
      this.isLoggedIn = true;
    }
  }
};
</script>

<style>
/* Navbar styles. */
</style>
