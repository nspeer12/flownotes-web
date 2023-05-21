<template>
    <div class="">
        <div class="notes">
            <div v-for="note in notes" :key="note.noteid">
                <Note @pin-notes="$emit('pin-note', note.noteid, note.pin)" 
                      @delete-notes="$emit('delete-note', note.noteid)" 
                      v-on:getTagNotes="getTags(tag)"
                      :note="note" />
            </div>
        </div>    
    </div>
    
</template>

<script>

import Note from './Note.vue'

export default {
    name: 'Notes',
    props: {
        notes: {
            type: Array,
            default: () => []
        }
    },
    components: {
        Note
    },
    methods: {
        getTags(tag)
        {
            console.log('getTagNotes', tag)
            this.$emit('getTagNotes', tag)
        }
    }
}
</script>

<style scope>


</style>