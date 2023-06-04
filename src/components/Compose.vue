<template>
  <div class="compose card bg-dark my-2 px-3 py-4 pt-sm-5 pt-md-3"  :class="{ 'full-width': !fullWidth }">
    <Context :context="this.context" />
    <div class="compose-box">
      <div id="markdown"></div>
      <!-- <div id="context">{{  this.context }}</div> -->
      
      <textarea id="compose-input" class="compose-input bg-dark" :style="{ fontSize: fontSize }" v-bind:rows="rows" v-on:input="updateData" v-on:keyup.shift.enter="saveNote" placeholder="What's on your mind?"></textarea>
    </div>
    <div class="image-preview">
      <img v-bind:src="imageUrl ? imageUrl : ''" alt="" />
    </div>
    <div class="actions">
      <button class="btn btn-secondary btn-sm mx-1" @click="toggleWidthHandler" v-if="visibleActions.toggleWidth"><i :class="fullWidth ? 'bi bi-arrow-bar-right' : 'bi bi-arrow-bar-left'"></i></button>
      <button class="btn btn-secondary btn-sm mx-1" @click="decreaseFontSize" v-if="visibleActions.changeFontSize && !fullWidth"><i class="bi bi-fonts">-</i></button>
      <button class="btn btn-secondary btn-sm mx-1" @click="increaseFontSize" v-if="visibleActions.changeFontSize && !fullWidth"><i class="bi bi-fonts">+</i></button>
      <button class="btn btn-danger btn-sm mx-1" :class="{ 'recording': isRecording, 'not-recording': !isRecording }" @click="toggleRecording" v-if="visibleActions.recordAudio"><i class="bi bi-mic"> mic</i></button>
      <button class="btn btn-success btn-sm mx-1" @click="playAudio" v-if="recordedSomething && visibleActions.playAudio"><i class="bi bi-play-circle"></i></button>
      <button class="btn btn-light btn-sm mx-1" @click="convertMarkdown" v-if="visibleActions.convertMarkdown && !fullWidth"><i class="bi bi-file-earmark-font"> md</i></button>
      <button class="btn btn-info btn-sm mx-2" v-on:click="gptComplete" v-if="visibleActions.gptComplete"><i class="bi bi-chat-right-dots"> complete</i></button>
      <button class="btn btn-info btn-sm mx-2" v-on:click="gptChat" v-if="visibleActions.gptChat"><i class="bi bi-chat-left-quote"> chat</i></button>
      <button class="btn btn-primary btn-sm mx-1" id="save" v-on:click="saveNote" v-if="visibleActions.saveNote"><i class="bi bi-sd-card"></i></button>
    </div>
    
  </div>
</template>

<script>
import Note from './Note.vue'
import Context from './Context.vue'
import { onMounted, ref } from 'vue'
import { marked } from 'marked'
import apiService from '../api/apiService'

export default {
  components: {
    Note,
    Context
  },
  data() {
    return {
      message: '',
      markdown: '',
      //context: [{"role": "system", "content": "Hello, I am FlowNotes AI. I am here to help you to capture your ideas, express your creativity, and find mental clarity through notetaking."}],
      context: [],
      rows: 6,
      imageUrl: '',
      isRecording: false,
      mediaRecorder: null,
      audioUrl: null,
      audioChunks: [],
      fontSize: '1.2em',
      recordedSomething: false,
      visibleActions: {
        toggleWidth: true,
        changeFontSize: true,
        recordAudio: true,
        playAudio: true,
        convertMarkdown: true,
        gptComplete: false,
        gptChat: true,
        saveNote: true,
      },
    }
  },
  name: 'Compose',
  props: {
    userid: {
      type: String,
    },
    fullWidth: {
      type: Boolean,
    },
  },
  methods: {
    updateData(event) {
      this.rows = Math.max(6, event.target.value.split('\n').length);
      this.message = event.target.value;
    },
    saveNote() {
      this.markdown = marked(this.message);

      let newNote = {
        userid: this.userid,
        text: this.message,
        markdown: this.markdown,
        imageUrl: this.imageUrl,
      };

      this.$emit('save-note', newNote);

      this.resetFields();
    },
    resetFields() {
      this.message = '';
      this.imageUrl = '';
      this.markdown = '';
      document.getElementById('compose-input').value = '';
    },
    toggleWidthHandler() {
      this.$emit('toggleWidth');
    },
    async gptComplete() {
      await this.gptRequest('gptCompleteRequest');
    },
    async gptChat() {
      this.context.push({"role": "user", "content": this.message});

      // reset message
      this.message = ''
      document.getElementById('compose-input').value = ' ';

      const completion = await apiService.gptChatRequest(this.context);

      this.context.push({"role": "system", "content": completion})

      // await this.typeCompletion(completion);
    },
    async gptRequest(requestType) {
      const completion = await apiService[requestType](this.context);

      await this.typeCompletion(completion);

      // this.rows = Math.max(6, composeInput.value.split('\n').length);
    },
    async typeCompletion(completion) {
      const words = completion.split(' ');
      for (const word of words) {
        await new Promise(resolve => setTimeout(resolve, 100));
        this.markdown += word + ' ';
      }
    },
    convertMarkdown() {
      this.markdown = marked(this.message);
      document.getElementById('markdown').innerHTML = this.markdown;
    },
    renderMarkdown() {
      document.getElementById('markdown').innerHTML = marked(this.markdown);
    },
    dalle() {
      const prompt = encodeURIComponent(this.message);
      const endpoint = `${this.apiUrl}/dalle/${this.userid}query=${prompt}`;

      fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      })
        .then(res => res.json())
        .then(data => {
          if (data.dalle) {
            this.imageUrl = data.dalle;
          }
        });
    },
    removeImg() {
      this.imageUrl = '';
    },
    startRecording() {
      if (!window.MediaRecorder) {
        alert("Your browser does not support audio recording");
        return;
      }

      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          this.mediaRecorder = new MediaRecorder(stream);

          this.mediaRecorder.addEventListener("dataavailable", event => {
            this.audioChunks.push(event.data);
          });

          this.mediaRecorder.addEventListener("stop", () => {
            this.audioUrl = URL.createObjectURL(new Blob(this.audioChunks));
            this.recordedSomething = true;
          });

          this.mediaRecorder.start();
          this.isRecording = true;
        })
        .catch(err => console.error(err));
    },
    stopRecording() {
      if (this.mediaRecorder) {
        this.mediaRecorder.stop();
        this.isRecording = false;
      }
    },
    toggleRecording() {
      this.isRecording ? this.stopRecording() : this.startRecording();
    },
    playAudio() {
      if (this.audioUrl) {
        new Audio(this.audioUrl).play();
      }
    },
    increaseFontSize() {
      this.fontSize = (parseFloat(this.fontSize) + 0.1) + 'em';
    },
    decreaseFontSize() {
      let currentSize = parseFloat(this.fontSize);
      if (currentSize > 0.1) {
        this.fontSize = (currentSize - 0.1) + 'em';
      }
    },
  },
  watch: {
    markdown: function (val) {
      this.renderMarkdown();
    }
  }
}
</script>
<style scope>
.compose-input {
  width: 100%;
  color: #f8f9fa;
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