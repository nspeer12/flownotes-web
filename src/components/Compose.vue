<template>
  <div class="compose card bg-dark my-2 px-3 py-2" :class="{ 'full-width': !fullWidth }">
    <div class="compose-box" >
      <div id="markdown">
      </div>
      <textarea v-bind:rows="rows" v-on:input="updateData" v-on:keyup.shift.enter="saveMessage" id="compose-input"
        class="compose-input bg-dark" placeholder="What's on your mind?" :style="{ fontSize: fontSize }"></textarea>


    </div>

    <div class="image-preview">
      <!-- if image url, show image, if not do not display -->
      <img v-bind:src="imageUrl ? imageUrl : ''" alt="" />
    </div>

    <div class="actions">

      <button type="button" class="btn btn-secondary btn-sm mx-1" @click="toggleWidthHandler">
            <i :class="fullWidth ? 'bi bi-arrow-bar-right' : 'bi bi-arrow-bar-left'"></i>
          </button>

      <button type="button" class="btn btn-secondary btn-sm mx-1" @click="decreaseFontSize"><i
          class="bi bi-fonts">-</i></button>

      <button type="button" class="btn btn-secondary btn-sm mx-1" @click="increaseFontSize"><i
          class="bi bi-fonts">+</i></button>


      <button type="button" class="btn btn-danger btn-sm mx-1"
        :class="{ 'recording': isRecording, 'not-recording': !isRecording }" @click="toggleRecording">
        <i class="bi bi-mic"></i>
      </button>


      <button type="button" class="btn btn-success btn-sm mx-1" @click="playAudio">
        <i class="bi bi-play-circle"></i>
      </button>

      <!-- <button type="button" class="btn btn-secondary btn-sm mx-1"><i class="bi bi-image"></i></button>

            <button type="button" class="btn btn-secondary btn-sm mx-1" v-on:click="dalle" ><i class="bi bi-palette"></i></button> -->

      <button type="button" class="btn btn-light btn-sm mx-1" @click="convertMarkdown"><i
          class="bi bi-file-earmark-font"></i></button>

      <button type="button" class="btn btn-info btn-sm mx-2"><i class="bi bi-chat-right-dots"
          v-on:click="gptComplete"></i></button>

      <button id="save" type="button" class="btn btn-primary btn-sm mx-1" v-on:click="saveMessage"><i
          class="bi bi-sd-card"></i>
      </button>
    </div>
  </div>
</template>
  
<script>

import Note from './Note.vue'

import { onMounted, ref } from 'vue'
import { marked } from 'marked'

export default {
  name: 'Compose',
  data() {
    return {
      message: String(''),
      markdown: String(''),
      rows: 6,
      imageUrl: String(''),
      isRecording: false,
      mediaRecorder: null,
      audioUrl: null,
      audioChunks: [],
      fontSize: '1em',
    }
  },
  props: {
    userid: {
      type: String,
    },
    fullWidth: Boolean(),
    apiUrl: {
      type: String,
    },
  },
  components: {
    Note
  },
  methods: {
    updateData(event) {
      this.rows = (6 > event.target.value.split('\n').length) ? 6 : event.target.value.split('\n').length
      this.message = event.target.value
    },
    saveMessage() {

      // Emit the message value

      this.markdown = marked(this.message)

      let newNote = {
        userid: this.userid,
        text: this.message,
        markdown: this.markdown,
        imageUrl: this.imageUrl
      }
      this.$emit('note-saved', newNote);

      this.message = String('')
      this.imageUrl = String('')
      this.markdown = String('')
      document.getElementById('compose-input').value = ''

    },
    toggleWidthHandler() {
      this.$emit('toggleWidth');
    },
    gptComplete() {
      console.log('gpt_complete', this.message)

      // encode the prompt
      const prompt = encodeURIComponent(this.message)

      console.log(`${this.apiUrl}/complete/${this.userid}/?query=${prompt}`)
      // make a fetch call to the following url
      const endpoint = `${this.apiUrl}/complete/${this.userid}/?query=${prompt}`


      // while waiting for the data, set the message to 'loading...'
      document.getElementById('compose-input').value += '\n' + '...'

      fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Allow-Control-Allow-Origin': '*'
        }
      }).then(res => res.json())
        .then(data => {
          console.log(data)

          if (data.gpt.length > 0) {
            this.message = String(data.gpt[0])
          }

          // update the value of the text area with the message


          document.getElementById('compose-input').value = document.getElementById('compose-input').value.replace('...', '')

          // update the text with a cool typing effect

          // loop through each token in this.message
          for (let i = 0; i < this.message.length; i++) {
            // add the token to the text area

            setTimeout(() => { document.getElementById('compose-input').value += this.message[i], 1000 })
          }

          // document.getElementById('compose-input').value += this.message

          // update the rows to the number of lines in the text area
          this.rows = (6 > document.getElementById('compose-input').value.split('\n').length) ? 6 : document.getElementById('compose-input').value.split('\n').length
          // this.message = String('test')
        })
    },
    convertMarkdown() {
      this.markdown = marked(this.message)
      console.log(this.markdown)
      document.getElementById('markdown').innerHTML = this.markdown

    },
    dalle() {
      console.log('dalle')

      const prompt = encodeURIComponent(this.message)
      const endpoint = this.apiUrl + "/dalle/" + this.userid + "query=" + prompt

      console.log(endpoint)

      fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }).then(res => res.json())
        .then(data => {
          console.log(data)

          // check if dalle is a property in the response
          if (data.dalle) {
            // if it is, set the message to the value of the dalle property
            this.imageUrl = data.dalle
          }

        })

    },
    removeImg() {
      this.imageUrl = String('')
    },
    startRecording() {
      // Check if user's browser supports MediaRecorder
      if (!window.MediaRecorder) {
        alert("Your browser does not support audio recording");
        return;
      }

      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          this.mediaRecorder = new MediaRecorder(stream);

          const audioChunks = []; // Declare audioChunks array here
          this.mediaRecorder.addEventListener("dataavailable", event => {
            this.audioChunks.push(event.data);
          });

          this.mediaRecorder.addEventListener("stop", () => {
            const audioBlob = new Blob(audioChunks);
            const audioUrl = URL.createObjectURL(audioBlob);
            this.audioUrl = audioUrl; // Save the audio URL
          });

          this.mediaRecorder.start();
          this.isRecording = true;
        })
        .catch(err => console.error(err));
    },
    stopRecording() {
      if (!this.mediaRecorder) {
        return;
      }
      this.mediaRecorder.addEventListener("stop", () => {
        const audioBlob = new Blob(this.audioChunks);
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        this.audioUrl = audioUrl; // Save the audio URL

        // Do something with the audio here. You can send it to your server, play it, etc.
      });

      this.mediaRecorder.stop();
      this.isRecording = false;
    },
    toggleRecording() {
      if (this.isRecording) {
        this.stopRecording();
      } else {
        this.startRecording();
      }
    },
    playAudio() {
      if (this.audioUrl) {
        const audio = new Audio(this.audioUrl);
        audio.play();
      }
    },
    increaseFontSize() {
      let currentSize = parseFloat(this.fontSize);
      this.fontSize = (currentSize + 0.1) + 'em';
    },
    decreaseFontSize() {
      let currentSize = parseFloat(this.fontSize);
      if (currentSize > 0.1) {
        this.fontSize = (currentSize - 0.1) + 'em';
      }
    }
  }
}
</script>
  
<style scope>
.compose-input {
  width: 100%;
  /* background-color: rgb(38, 42, 46); */
  color: #f8f9fa;
  /* font-size: 1.1rem; */
  /* padding: 1rem; */
  border: none;
  outline: none;
}

.actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.recording {
  background-color: red;
}

.compose {
  margin: 0 auto;
  max-width: 100%;
}

.full-width {
  max-width: none;
  width: 80%;
}


</style>