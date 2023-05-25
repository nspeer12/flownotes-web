<template>
    <div class="">
        <div class="notes">
            <div class="note-container" v-for="note in notes" :key="note.noteid" :class="{ 'full-width': !fullWidth }">
                <Note @pin-notes="$emit('pin-note', note.noteid, note.pin)"
                    @delete-notes="$emit('delete-note', note.noteid)" v-on:getTagNotes="getTags(tag)" :note="note" />
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
        },
        fullWidth: Boolean()
    },
    components: {
        Note
    },
    methods: {
        getTags(tag) {
            console.log('getTagNotes', tag)
            this.$emit('getTagNotes', tag)
        }
    }
}
</script>

<style scope>
.note-container {
    margin: 0 auto;
    max-width: 100%;
}
</style>