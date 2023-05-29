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
            <router-link to="/login" class="btn btn-primary">Login</router-link>
          </div>
          <div class="col-3">
            <router-link to="/signup" class="btn btn-success">Sign Up</router-link>
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
      default: 'Flownotes.ai'
    },
    apiUrl: {
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
    }
  }
};
</script>

<style>
/* Navbar styles... */
</style>
