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
            <router-link v-if="!isLoggedIn" to="/login" class="btn btn-primary">Login</router-link>
            <button v-if="isLoggedIn" @click="logout" class="btn btn-danger">Logout</button>
          </div>
          <div class="col-3">
            <router-link v-if="!isLoggedIn" to="/signup" class="btn btn-success">Sign Up</router-link>
          </div>
        </div>
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
      default: 'Flownotes.io'
    },
    apiUrl: {
      type: String
    }
  },
  data() {
    return {
      query: String(),
      isLoggedIn: false // Add a new data property for tracking login status
    };
  },
  methods: {
    search() {
      this.$emit('search', this.query);
    },
    logout() {
      // Perform logout actions here (e.g., clear token, redirect, etc.)
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
/* Navbar styles.. */
</style>
