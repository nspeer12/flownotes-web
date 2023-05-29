<template>
  <div>
    <Navbar :query="query" :apiUrl="apiUrl" @search="searchNotes" />
    <div class="pt-5">
      <div class="row">
        <div class="col-1">
          <Sidebar @pins="getPins" @getTagNotes="getTagNotes" :taglist="taglist" />
        </div>
        <div class="col-11">
          <router-view :userid="userid" :apiUrl="apiUrl" :notes="notes" :fullWidth="fullWidth" @note-saved="saveNote"
            @toggle-width="toggleWidth" @pin-note="pinNote" @delete-note="deleteNote" @get-tag-notes="getTagNotes"
            @login="handleLogin" @user-logged-in="handleUserLoggedIn" @logout="handleLogout" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue'
import Sidebar from './components/Sidebar.vue'
import Notebook from './components/Notebook.vue'
import axios from 'axios';

export default {
  name: 'App',
  components: {
    Navbar,
    Sidebar,
    Notebook,
  },
  data() {
    return {
      userid: '',
      notes: [],
      taglist: [],
      query: '',
      apiUrl: 'https://flownotesapi.speer.ai',
      token: null,
      fullWidth: false,
    }
  },
  methods: {
    async handleLogin(email, password) {
      console.log('Handling Login in App');
      const reqUrl = `${this.apiUrl}/login`;
      const user = { email, password };
      this.email = email;

      try {
        const res = await axios.post(reqUrl, user, {
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });

        if (res.status === 200) {
          console.log('Login Successful');
          const { userid, token } = res.data;
          sessionStorage.setItem('token', token);
          this.userid = userid;
          axios.defaults.headers.common['Authorization'] = `Bearer ${sessionStorage.getItem('token')}`;
          this.$router.push({ name: 'Notebook' });
          this.getNotes()

        } else {
          console.log('Login failed');
        }
      } catch (error) {
        console.log('Login error:', error);
      }
    },
    handleLogout() {
      sessionStorage.removeItem('token');
      this.userid = null;
      console.log('Logged out');
    },
    handleUserLoggedIn(userid) {
      this.userid = userid;
    },
    async deleteNote(noteid) {
      const reqUrl = `${this.apiUrl}/delete`;
      const req = { noteid, userid: this.userid };

      try {
        await axios.post(reqUrl, req, {
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });

        this.getNotes();
      } catch (error) {
        console.log('Delete note error:', error);
      }
    },
    pinNote(noteid, pinbool) {
      const params = new URLSearchParams();
      params.append('noteid', noteid);
      params.append('pin', Boolean(pinbool));

      const reqUrl = `${this.apiUrl}/pin/${this.userid}/?${params}`;

      fetch(reqUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      }).then(res => res.json())
        .then(data => { console.log(data); });
    },
    async getNotes() {
      console.log('Get Notes');
      const reqUrl = "https://flownotes.io/notes/388036";

      try {
        const response = await fetch(reqUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        this.notes = data.notes;
        this.taglist = data.taglist;
      } catch (error) {
        console.log('Get notes error:', error);
      }
    },

    async getPins() {
      const reqUrl = `${this.apiUrl}/pin/${this.userid}`;

      const res = await fetch(reqUrl, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
      const data = await res.json();
      console.log('getpins', data);

      this.notes = data.notes;
    },
    async saveNote(newNote) {
      const reqUrl = `${this.apiUrl}/compose`;

      this.notes.push(newNote);

      try {
        await axios.post(reqUrl, newNote, {
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });

        this.getNotes();
      } catch (error) {
        console.log('Save note error:', error);
      }
    },
    searchNotes(query) {
      const queryurl = encodeURIComponent(query);
      const reqUrl = `${this.apiUrl}/search/${this.userid}/?query=${queryurl}`;

      fetch(reqUrl, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      }).then(res => res.json())
        .then(data => {
          this.notes = data.notes;
          this.taglist = data.taglist;
        });
    },
    async getTagNotes(tag) {
      const reqUrl = `${this.apiUrl}/notes/${this.userid}/hashtag/${tag}`;

      fetch(reqUrl, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      }).then(res => res.json())
        .then(data => {
          this.notes = data.notes;
          this.taglist = data.taglist;
        });
    },
    toggleWidth() {
      this.fullWidth = !this.fullWidth;
    }
  },
  async created() {
    if (localStorage.getItem("token")) {
      this.token = localStorage.getItem("token");
    }
    if (this.userid != '') {
      await this.getNotes();
    }
  },
  watch: {
    userid: function (newUserid) {
      console.log('userid changed', newUserid);
    },
    fullWidth: function (oldToggle, newToggle) {
      console.log('width changed: ', oldToggle, newToggle);
    }
  }
}
</script>

<style>
/* Your Styles... */
</style>
