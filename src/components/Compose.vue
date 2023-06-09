<template>
  <div class="compose card bg-dark px-2 py-2" :class="{ 'full-width': !fullWidth }">
    <Context :context="this.context" />

    <editor-content class="editor compose-input bg-dark" :editor="editor" />

    <div class="action-toolbar row">
      <div v-if="editor" class="editor-toolbar col-lg-6" role="toolbar" aria-label="Toolbar with button groups">
        <div class="btn-group me-2" role="group" aria-label="Second group">
          <button class="btn btn-outline-light bi bi-type-bold" @click="editor.chain().focus().toggleBold().run()"
            :disabled="!editor.can().chain().focus().toggleBold().run()"
            :class="{ 'is-active': editor.isActive('bold') }"></button>
          <button class="btn btn-outline-light bi bi-type-italic" @click="editor.chain().focus().toggleItalic().run()"
            :disabled="!editor.can().chain().focus().toggleItalic().run()"
            :class="{ 'is-active': editor.isActive('italic') }"></button>
          <button class="btn btn-outline-light bi bi-type-strikethrough"
            @click="editor.chain().focus().toggleStrike().run()"
            :disabled="!editor.can().chain().focus().toggleStrike().run()"
            :class="{ 'is-active': editor.isActive('strike') }"></button>
          <button class="btn btn-outline-light bi bi-code-slash" @click="editor.chain().focus().toggleCode().run()"
            :disabled="!editor.can().chain().focus().toggleCode().run()"
            :class="{ 'is-active': editor.isActive('code') }"></button>
          <button class="btn btn-outline-light bi bi-type-h1"
            @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
            :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"></button>
          <button class="btn btn-outline-light bi bi-type-h2"
            @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
            :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"></button>
          <button class="btn btn-outline-light bi bi-type-h3"
            @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
            :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"></button>
          <button class="btn btn-outline-light bi bi-list-ul" @click="editor.chain().focus().toggleBulletList().run()"
            :class="{ 'is-active': editor.isActive('bulletList') }"></button>
          <button class="btn btn-outline-light bi bi-list-ol" @click="editor.chain().focus().toggleOrderedList().run()"
            :class="{ 'is-active': editor.isActive('orderedList') }"></button>
          <button class="btn btn-outline-light bi bi-arrow-counterclockwise" @click="editor.chain().focus().undo().run()"
            :hidden="!editor.can().chain().focus().undo().run()"></button>
          <button class="btn btn-outline-light bi bi-arrow-clockwise" @click="editor.chain().focus().redo().run()"
            :hidden="!editor.can().chain().focus().redo().run()"></button>
        </div>
      </div>
      <div class="btn-toolbar col-6 justify-content-end" role="toolbar" aria-label="Toolbar with button groups">
        <div class="me-2" role="group">
          <button class="btn-action btn btn-outline-secondary btn-sm" @click="toggleWidthHandler"
            v-if="visibleActions.toggleWidth"><i
              :class="fullWidth ? 'bi bi-arrow-bar-right' : 'bi bi-arrow-bar-left'"></i></button>
          <button class="btn-action btn btn-sm mic-btn"
            :class="{ 'recording': isRecording, 'not-recording': !isRecording }" @click="toggleRecording"
            v-if="visibleActions.recordAudio"><i class="bi bi-mic"> mic</i></button>
          <button class="btn-action btn btn-success btn-sm" @click="playAudio"
            v-if="recordedSomething && visibleActions.playAudio"><i class="bi bi-play-circle"></i></button>
          <button class="btn-action btn btn-info btn-sm" v-on:click="gptComplete" v-if="visibleActions.gptComplete"><i
              class="bi bi-chat-right-dots"> complete</i></button>
          <button class="btn-action btn btn-info btn-sm" v-on:click="gptChat" v-if="visibleActions.gptChat"><i
              class="bi bi-chat-left-quote"> chat</i></button>
          <button class="btn-action btn btn-primary btn-sm" id="save" v-on:click="saveNote" v-if="visibleActions.saveNote"><i
              class="bi bi-sd-card"> save</i></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Note from './Note.vue'
import Context from './Context.vue'
import { onMounted } from 'vue'
import { marked } from 'marked'
import apiService from '../api/apiService'
import { storage } from '../api/firebaseService';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
// firebase uses the ref function, fml
// import { ref } from 'vue';
import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Focus from '@tiptap/extension-focus'
import Placeholder from '@tiptap/extension-placeholder'

export default {
  components: {
    Note,
    Context,
    EditorContent,
  },
  data() {
    return {
      text: '',
      markdown: '',
      html: '',
      //context: [{"role": "system", "content": "Hello, I am Flownotes AI. I am here to help you to capture your ideas, maximize your creativity, and find mental clarity through journaling."}],
      context: [],
      imageUrl: '',
      isRecording: false,
      mediaRecorder: null,
      audioUrl: '',
      recordingUrl: '',
      audioChunks: [],
      recordedSomething: false,
      editor: null,
      visibleActions: {
        toggleWidth: true,
        recordAudio: true,
        playAudio: true,
        convertMarkdown: true,
        gptComplete: false,
        gptChat: true,
        saveNote: true,
      }
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
    saveNote() {
      this.text = this.editor.getText();
      this.html = this.editor.getHTML();

      let newNote = {
        userid: this.userid,
        text: this.text,
        context: this.context,
        markdown: this.markdown,
        html: this.html,
        imageUrl: this.imageUrl,
        recordingurl: this.recordingUrl,
      };

      this.editor.commands.clearContent();
      this.text = '';
      this.context = [];

      this.$emit('save-note', newNote);

      this.resetFields();
    },
    resetFields() {
      this.imageUrl = '';
      this.markdown = '';
      this.context = [];
      this.text = '';
      this.html = '';
    },
    toggleWidthHandler() {
      this.$emit('toggleWidth');
    },
    async gptComplete() {
      await this.gptRequest('gptCompleteRequest');
    },
    async gptChat() {
      this.text = this.editor.getText();
      this.context.push({ "role": "user", "content": this.text });
      const completion = await apiService.gptChatRequest(this.context);
      this.context.push({ "role": "assistant", "content": completion })

    },
    async gptRequest(requestType) {
      const completion = await apiService[requestType](this.context);
      await this.typeCompletion(completion);

    },
    async typeCompletion(completion) {
      const words = completion.split(' ');
      for (const word of words) {
        await new Promise(resolve => setTimeout(resolve, 100));
        this.markdown += word + ' ';
      }
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
            this.recordingUrl = URL.createObjectURL(new Blob(this.audioChunks));
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

        // Upload the audio after recording is stopped
        this.uploadAudio(this.userid, this.audioChunks)
          .then(downloadURL => {
            this.recordingUrl = downloadURL;
            this.recordedSomething = true;
          })
          .catch(error => {
            console.error('Failed to upload audio:', error);
          });
      }
    },
    async uploadAudio(userId, audioChunks) {
      // Create a Blob from the audio chunks
      var blob = new Blob(audioChunks);

      // Create a unique filename for this audio
      var timestamp = Date.now();
      var filename = `${userId}_${timestamp}.m4a`;

      // Create a storage reference
      var storageRef = ref(storage, `recordings/${userId}/${filename}`);

      // Upload the Blob
      var uploadTask = uploadBytesResumable(storageRef, blob);

      return new Promise((resolve, reject) => {
        uploadTask.on('state_changed',
          (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
          },
          (error) => {
            // Handle unsuccessful uploads
            console.log('Upload failed:', error);
            reject(error);
          },
          () => {
            // Handle successful uploads on complete
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              console.log('File available at', downloadURL);
              resolve(downloadURL);
            });
          }
        );
      });
    },
    toggleRecording() {
      this.isRecording ? this.stopRecording() : this.startRecording();
    },
    playAudio() {
      if (this.recordingUrl) {
        new Audio(this.recordingUrl).play();
      }
    }
  },
  watch: {
    markdown: function (val) {
      this.renderMarkdown();
    }
  },

  mounted() {
    this.editor = new Editor({
      extensions: [
        StarterKit,
        Focus.configure({
          classname: 'has-focus',
          mode: 'all',
        }),
        Placeholder.configure({
          placeholder: "What's on your mind?",
        })
      ],
      autofocus: true,
    })
  },

  beforeUnmount() {
    this.editor.destroy()
  }
}
</script>
<style scope>

.ProseMirror p.is-editor-empty:first-child::before {
  color: #cfcdcd;
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}

.ProseMirror:focus {
    outline: none;
}

.actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.mic-btn {
  color: #f8f9fa;
}

.recording {
  background-color: red;
}

.not-recording {
  background-color: rgb(13, 124, 81);
}

.compose {
  margin: 0 auto;
  max-width: 100%;
}

.full-width {
  max-width: none;
  width: 80%;
}

.editor {
  min-height: 20vh;
}

.ProseMirror p {
  padding-top: 0.5em;
  margin: 1em 1em;
  min-height: 3em;
}

.btn-action {
  margin: 0 0.3em;
}



</style>