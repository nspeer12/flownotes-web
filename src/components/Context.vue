<template>
    <div class="chat-context bg-dark">
      <div v-for="(entry, index) in context" :key="index" :class="['context-entry', entry.role]">
        <strong>{{ entry.role }}</strong>: {{ entry.content }}
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ChatContext',
    props: {
      context: {
        type: Array,
        required: true,
      },
    },
  }
  </script>
  
  <style scoped>
  .context-entry {
    margin-bottom: 1em;
    padding: 1em;
    border-radius: 0.5em;
  }
  
  .user {
    background-color: #4e4e4e9c;
  }
  
  .system {
    background-color: #414040b8;
  }
  </style>
  