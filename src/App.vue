<script setup>

</script>

<template>
  <div class="">
    <Navbar class="mb-5" :query="query" v-on:search="searchNotes" :apiUrl="apiUrl" @user-logged-in="handleUserLoggedIn"
      @logout="handleLogout" />
    <div class="pt-5">
      <div class="row">
        <div class="col-1">
          <Sidebar v-on:pins="getPins" @getTagNotes="getTagNotes" :taglist="taglist" />
        </div>
        <div class="col-11">
          <div class="mx-5 pt-3">
            <Compose v-on:note-saved="saveNote" :userid="userid" :apiUrl="apiUrl" />
            <Notes @pin-note="pinNote" @delete-note="deleteNote" @getTagNotes="getTagNotes" :notes="notes" />
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
      userid: String('1'),
      notes: Array(),
      taglist: Array(),
      query: String(),
      apiUrl: 'http://localhost:8000',
      token: null,
    }
  },
  methods: {
    async login(email, password) {

      console.log('login', email);

      const reqUrl = `${this.apiUrl}/login`;

      user = {
        email: email,
        password: password
      }
      
      try {
        const res = await fetch(reqUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(user),
        });

        if (res.ok) {
          const { userid, token } = await res.json();

          // Store the token in session storage
          sessionStorage.setItem('token', token);

          // Update the user ID in the component's data
          this.userid = userid;

          // Proceed with other actions or redirects after successful login
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
    deleteNote(noteid) {
      console.log('deleteNote', noteid)

      const reqUrl = `${this.apiUrl}/delete`

      // encode the noteid and userid as body parameters
      const req = {
        noteid: noteid,
        userid: this.userid
      }

      // use the fetch function to make a json request
      fetch(reqUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Allow-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(req)
      }).then(res => res.json())
        .then(data => {
          console.log(data)
          this.getNotes(this.userid)
        })
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
      // use the fetch function to make a json request
      const res = await fetch(reqUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Allow-Control-Allow-Origin': '*'
        }
      })

      // convert the response to json
      const data = await res.json()

      console.log('getnotes', data)
      this.notes = Array.from(data.notes)
      this.taglist = data.taglist
      console.log('getnotes', this.taglist)
      // return the data
      return data

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
      const data = await res.json()
      console.log('getpins', data)

      this.notes = Array.from(data.notes)
    },

    saveNote(newNote) {

      const reqUrl = `${this.apiUrl}/compose`
      const data = newNote

      fetch(reqUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Allow-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(data)
      }).then(res => res.json())
        .then(data => {
          this.getNotes(this.userid)

          // reset the message
          this.message = ''
        })
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
    }
  },

  // this is where data comes in and is passed along to be rendered
  async created() {

    // check for login

    if (localStorage.getItem("token"))
    {
      this.token = localStorage.getItem("token");
    }
      


    if (this.userid) {
      // get the notes
      await this.getNotes(this.userid);
    }

  },
  watch: {
    userid: function (newUserid, oldUserid) {
      console.log('userid changed', newUserid, oldUserid)
      this.getNotes(newUserid);
    }
  }
}

</script>

<style></style>
