<template>
    <nav class="bg-dark mb-2">
      <div class="container-fluid">
        <span class="badge bg-primary me-2">test</span>
        <span v-for="tag in taglist" class="badge bg-primary me-2">{{ tag }}</span>

      </div>
    </nav>
  </template>
  
  <script>
  
  export default {
      name: 'Tagbar',
      props : {
          title: {
              type: String,
              default: "Flownotes"
          }
      }
  
  }
  </script>