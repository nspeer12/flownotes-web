<template>
    <div class="mx-5 pt-3">
        <Compose @save-note="$emit('save-note', $event)" :userid="userid" :fullWidth="fullWidth" @toggleWidth="$emit('toggle-width')" />
        <Notes @pin-note="$emit('pin-note', $event)" @delete-note="$emit('delete-note', $event)" @getTagNotes="$emit('get-tag-notes', $event)" :notes="notes" :fullWidth="fullWidth" />
    </div>
  </template>
  
  <script>
  import Compose from './Compose.vue'
  import Notes from './Notes.vue'
  
  export default {
    name: 'Notebook',
    components: {
      Compose,
      Notes
    },
    props: {
      userid: {
        type: String,
        required: true
      },
      notes: {
        type: Array,
        required: true
      },
      fullWidth: {
        type: Boolean,
        required: true
      },
    },
  }
  </script>
  
  <style>
  /* Your Styles... */
  </style>
  