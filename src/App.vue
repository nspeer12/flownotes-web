<script setup>

</script>

<template>
  <div class="">
    <Navbar class="mb-5" :query="query" v-on:search="searchNotes" :apiUrl="apiUrl" @login="handleLogin" @user-logged-in="handleUserLoggedIn"
      @logout="handleLogout" />
    <div class="pt-5">
      
      <div class="row">
        <div class="col-1">
          <Sidebar v-on:pins="getPins" @getTagNotes="getTagNotes" :taglist="taglist" />
        </div>
        <div class="col-11">
          <div class="mx-5 pt-3">
            <Compose v-on:note-saved="saveNote" :userid="userid" :apiUrl="apiUrl" :fullWidth="fullWidth" @toggleWidth="toggleWidth" />
            <Notes @pin-note="pinNote" @delete-note="deleteNote" @getTagNotes="getTagNotes" :notes="notes" :fullWidth="fullWidth" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>


import Header from './components/Header.vue'
import Notes from './components/Notes.vue'
import Navbar from './components/Navbar.vue'
import Tagbar from './components/Tagbar.vue'
import Sidebar from './components/Sidebar.vue'
import Compose from './components/Compose.vue'
import axios from 'axios';

export default {
  name: 'App',
  components: {
    Header,
    Notes,
    Navbar,
    Tagbar,
    Sidebar,
    Compose
  },
  data() {
    return {
      userid: String(''),
      notes: Array(),
      taglist: Array(),
      query: String(),
      apiUrl: 'https://flownotesapi.speer.ai',
      token: null,
      fullWidth: false,
    }
  },
  methods: {
    async handleLogin(email, password) {
      console.log('App login', email);

      const reqUrl = `${this.apiUrl}/login`;

      const user = {
        "email": email,
        "password": password
      }
      
      this.email = email;

      try {
        const res = await axios.post(reqUrl, user, {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });

        if (res.status === 200) {
          
          console.log(res);

          const { userid, token } = res.data;

          // Store the token in session storage
          sessionStorage.setItem('token', token);

          // Update the user ID in the component's data
          this.userid = userid;

          // Proceed with other actions or redirects after successful login
          axios.defaults.headers.common['Authorization'] = `Bearer ${sessionStorage.getItem('token')}`;

        } else {
          console.log('Login failed');
          // Handle the failed login scenario (e.g., display an error message to the user)
        }
      } catch (error) {
        console.log('Login error:', error);
        // Handle any network or other errors that occurred during the login process
      }
    },

    logout() {
      // Clear the token from session storage
      sessionStorage.removeItem('token');

      // Clear the user ID from the component's data
      this.userid = null;

      console.log('Logged out');
    },
    handleUserLoggedIn(userid, username) {
      this.userid = userid;
      this.username = username;
    },
    handleLogout() {
      this.userid = '';
      this.username = '';
      localStorage.removeItem('token');
    },

    async deleteNote(noteid) {
      const reqUrl = `${this.apiUrl}/delete`

      const req = {
        noteid: noteid,
        userid: this.userid
      }

      try {
        const res = await axios.post(reqUrl, req, {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });

        const data = res.data;

        this.getNotes(this.userid)
      } catch (error) {
        console.log('Delete note error:', error);
      }
    },

    pinNote(noteid, pinbool) {

      console.log('pinNote', noteid, pinbool)

      // encode noteid and userid as query parameters
      const params = new URLSearchParams()
      params.append('noteid', noteid)
      params.append('pin', Boolean(pinbool))

      const reqUrl = `${this.apiUrl}/pin/${this.userid}/?${params}`

      fetch(reqUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Allow-Control-Allow-Origin': '*'
        }
      }).then(res => res.json())
        .then(data => {
          console.log(data)
        })
    },

    async getNotes(userid) {
      const reqUrl = `${this.apiUrl}/notes/${userid}`

      try {
        const res = await axios.get(reqUrl, {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });

        const data = res.data;

        this.notes = Array.from(data.notes)
        this.taglist = data.taglist
      } catch (error) {
        console.log('Get notes error:', error);
      }
    },

    async getPins() {

      console.log('getPins', this.userid)

      const reqUrl = `${this.apiUrl}/pin/${this.userid}`

      const res = await fetch(reqUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Allow-Control-Allow-Origin': '*'
        }
      })
      const data = await res.json();
      console.log('getpins', data);

      this.notes = Array.from(data.notes);
    },
    
    async saveNote(newNote) {
      const reqUrl = `${this.apiUrl}/compose`;

      this.notes.push(newNote);

      try {
        const res = await axios.post(reqUrl, newNote, {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });

        const data = res.data;

        this.getNotes(this.userid);
        this.message = '';
      } catch (error) {
        console.log('Save note error:', error);
      }
    },

    searchNotes(query) {

      console.log(`searching for: ${query}`)

      const queryurl = encodeURIComponent(query)

      const reqUrl = `${this.apiUrl}/search/${this.userid}/?query=${queryurl}`

      fetch(reqUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Allow-Control-Allow-Origin': '*'
        }
      }).then(res => res.json())
        .then(data => {
          console.log(data)
          this.notes = Array.from(data.notes)
          this.taglist = Array.from(data.taglist)
        })
    },

    getTagNotes(tag) {
      console.log('getTagNotes', tag)

      // make a fetch call to the following url
      const reqUrl = `${this.apiUrl}/notes/${this.userid}/hashtag/${tag}`

      fetch(reqUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Allow-Control-Allow-Origin': '*'
        }
      }).then(res => res.json())
        .then(data => {
          console.log(data)
          this.notes = Array.from(data.notes)
          this.taglist = Array.from(data.taglist)
        })

    },

    recordVoice() {
      console.log('recording voice... not yet implemented')
      // TODO: recorder.js

      // recorder = new Recorder(source, [,config])
    },
    toggleWidth() {
      this.fullWidth = !this.fullWidth;
    }
  },

  // this is where data comes in and is passed along to be rendered
  async created() {

    // check for login

    if (localStorage.getItem("token"))
    {
      this.token = localStorage.getItem("token");
    }
      


    if (this.userid != '') {
      // get the notes
      await this.getNotes(this.userid);
    }

  },
  watch: {
    userid: function (newUserid, oldUserid) {
      console.log('userid changed', newUserid);
      this.getNotes(newUserid);
    },
    fullWidth: function (oldToggle, newToggle) {
      console.log('width changed: ', oldToggle, newToggle);
    }
  }
}

</script>

<style></style>
