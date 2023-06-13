<template>
    <div class="col" >
        <div class="note card bg-dark my-2 py-2 px-3">

        <div class="card-body" data-aos="fade-in" data-aos-delay="500">
            <!-- {{ note }} -->
            <div class="markdown-preview" v-on:click="editNote(noteid)">
                <div class="note-text" v-html="note.markdown ? note.markdown : note.text"></div>
            </div>
            
            <!-- <p class="fs-6 note-text">{{ note.text }}</p> -->

            <div class="tags mb-3">
                <span @click="getTagNotes(hashtag)" v-for="hashtag in note.hashtags" :key="hashtag" class="badge bg-success me-2">#{{ hashtag }}</span>
            </div>
            
            
            <div class="tags mb-3">
                <span @click="getTagNotes(tag)" v-for="tag in note.autotags" :key="tag" class="badge bg-primary me-2">{{ tag }}</span>
            </div>

            <div class="tags mb-3">
                <span v-for="keyword in note.keywords" :key="keyword" class="badge bg-info me-2">{{ keyword }}</span>
            </div>

            <div v-if="'tokens' in note" class="tags mb-3">
                <span v-for="token in note.tokens" :key="token" class="badge bg-secondary me-2">{{ token }}</span>
            </div>

            <div class="tags mb-3">
                <span v-for="category in note.categories" :key="category" class="badge bg-secondary me-2">{{ category }}</span>
            </div>


            <div v-if="note.recordingurl" class="audio-preview">
                <audio controls>
                    <source :src="note.recordingurl" type="audio/mpeg">
                    Your browser does not support the audio element.
                </audio>
            </div>

            <p class="fa-2x text-muted" v-if="note.timestamp">
                <i class="bi bi-clock me-2"></i>
                <span>{{ convertTimestamp(note.timestamp) }}</span>
            </p>



            <!-- display the imageUrl if it exists -->
            <!-- TODO: Authorize OpenAI Image -->
            <div class="image-preview">
                <img v-bind:src="note.imageUrl ? note.imageUrl : '' " alt="" />
            </div> 


            <!-- <p class="fa-2x text-muted">
                <i class="bi bi-person me-2"></i>
                <span>{{ note.userid }}</span>
            </p>
            <p class="fa-2x text-muted">
                <i class="bi bi-tag me-2"></i>
                <span>{{ note.noteid }}</span>
            </p> -->


        </div>

        <div class="card-footer">
            <i class="bi bi-pencil-square me-2"></i>
            <span>
                <i @click="onPin(note.noteid, note.pin)"  v-bind:class="[note.pin ? 'bi-pin-fill me-2' : 'bi-pin me-2']"></i>
            </span>
            <!-- <i class="bi bi-share me-2"></i> -->
            <i @click="onDelete(note.noteid)" class="bi bi-x me-2"></i>
            <!-- <i class="bi bi-three-dots-vertical"></i> -->
        </div>

        </div>
    </div>

</template>

<script>

export default {
    name: 'Note',
    props: {
        note: {
            type: Object,
            default: () => {}
        }
    },
    data () {
        return {
            pin: Boolean(false),
            noteid: String('')
        }
    },
    methods : {
        onPin(noteid, pinbool) {
            this.note.pin = !this.note.pin
            this.$emit('pin-notes', noteid, pinbool)
            console.log('pin', noteid, pinbool)
        },
        onDelete(noteid) {
            this.$emit('delete-notes', noteid)
            console.log('delete', noteid)
        },
        convertTimestamp(timestamp) {
            // convert unix timestamp to local time
            var date = new Date(timestamp * 1000)

            // get the time
            var hours = date.getHours()
            var minutes = "0" + date.getMinutes()
            var seconds = "0" + date.getSeconds()

            // get the date
            var day = date.getDate()
            var month = date.getMonth() + 1;
            var year = date.getFullYear()

            // format the time
            var formattedTime = day + '/' + month + '/' + year + ' ' + hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2)

            // check for NaN in the date and return null
            if (day == NaN) {
                return null;
            }

            return formattedTime
        },
        getTagNotes(tag) {
            console.log(tag)
            this.$emit('getTags', tag)
        },
        editNote(noteid) {
            console.log('edit', this.noteid)
        }
    }
}
</script>

<style scope>

.note-text {
    font-size: 1.0rem;
    color: #fff;
}


.full-width {
  max-width: none;
  width: 80%;
}


</style>