<template>
  <div>
    <Navbar :query="query" :fullWidth="fullWidth" :loggedIn="loggedIn" :userid="userid" 
            @search="searchNotes" @login="handleLogin" @user-logged-in="handleUserLoggedIn" 
            @logout="handleLogout" />

    <div class="pt-5">
      <div class="row">
        <div class="col-md-1 d-none d-md-block">
          <Sidebar @pins="getPins" @getTagNotes="getTagNotes" :taglist="taglist" 
                   :loggedIn="loggedIn" :userid="userid" @login="handleLogin" @logout="handleLogout" />
        </div>
        <div class="col-12 col-md-11">
          <router-view :userid="userid" :notes="notes" :fullWidth="fullWidth" :loggedIn="loggedIn" 
                       @save-note="saveNote" @toggle-width="toggleWidth" @pin-note="pinNote" 
                       @delete-note="deleteNote" @get-tag-notes="getTagNotes" @login="handleLogin" 
                       @user-logged-in="handleUserLoggedIn" @logout="handleLogout" @signup="handleSignup" />
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import Navbar from './components/Navbar.vue'
import Sidebar from './components/Sidebar.vue'
import Notebook from './components/Notebook.vue'
import apiService from './api/apiService'
import AOS from 'aos';

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
      token: '',
      fullWidth: window.innerWidth <= 768 ? true : false,
      loggedIn: false,
      resizeHandler: null
    }
  },
  methods: {
    async handleLogin(email, password) {
      try {
        const { userid, token } = await apiService.loginRequest(email, password);
        sessionStorage.setItem('token', token);
        this.userid = userid;
        this.loggedIn = true;
        this.$router.push({ name: 'Notebook' });
      } catch (error) {
        console.log('Login error:', error);
      }
    },
    async handleLogout() {
      console.log('Logging out');
      sessionStorage.removeItem('token');
      this.userid = '';
      this.loggedIn = false;
      console.log('Logged out');
      this.$router.push({ name: 'Login' });
    },
    async handleUserLoggedIn(userid) {
      this.userid = userid;
    },
    async handleSignup(email, password) {
      try {
        const { userid, token } = await apiService.signupRequest(email, password);
        localStorage.setItem('userid', userid);
        localStorage.setItem('token', token);
        this.userid = userid;
        this.token = token;
        this.loggedIn = true;
        this.$router.push({ name: 'Notebook' });
      } catch (error) {
        console.error('Error during signup:', error);
      }
    },
    async deleteNote(noteid) {
      try {
        await apiService.deleteNoteRequest(noteid, this.userid);
        this.getNotes();
      } catch (error) {
        console.log('Delete note error:', error);
      }
    },
    async pinNote(noteid, pinbool) {
      try {
        await apiService.pinNoteRequest(noteid, pinbool, this.userid);
      } catch (error) {
        console.log('Pin note error:', error);
      }
    },
    async getNotes() {
      try {
        console.log(this.userid, this.token);
        const data = await apiService.getNotesRequest(this.userid, this.token);
        console.log('awaiting response');
        if (data && data.notes) {
          this.notes = data.notes;
          this.taglist = data.taglist;
        } else {
          // Handle the case when data.notes is undefined or null
          this.notes = [];
          this.taglist = [];
        }
      } catch (error) {
        console.log('Get notes error:', error);
      }
    },
    async getPins() {
      try {
        const data = await apiService.getPins(this.userid);
        this.notes = data.notes;
      } catch (error) {
        console.log('Get pins error:', error);
      }
    },
    async saveNote(newNote) {
      console.log('Saves notes handler');

      // add to the beggining of the array
      this.notes.unshift(newNote);

      try {
        await apiService.saveNoteRequest(this.userid, newNote);
        // this.getNotes();
      } catch (error) {
        console.log('Save note error:', error);
      }
    },
    async searchNotes(query) {
      try {
        const data = await apiService.searchNotesRequest(query, this.userid);
        this.notes = data.notes;
        this.taglist = data.taglist;
      } catch (error) {
        console.log('Search notes error:', error);
      }
    },
    async getTagNotes(tag) {
      console.log('Get tag notes handler');

      try {
        const res = await apiService.getTagNotesRequest(tag, this.userid);
        this.notes = res.data.notes;
        console.log('notes:', data);
        this.taglist = res.data.taglist;
      } catch (error) {
        console.log('Get tag notes error:', error);
      }
    },
    toggleWidth() {
      this.fullWidth = !this.fullWidth;
    },
    async wakeServer() {
      try {
        await apiService.wakeServerRequest();
      } catch (error) {
        console.log('Error communicating with server:', error);
      }
    }
  },
  created() {
    this.wakeServer();

    this.resizeHandler = () => {
      this.fullWidth = window.innerWidth <= 768;
    }
    
    window.addEventListener('resize', this.resizeHandler);
    
    if (localStorage.getItem("token") && localStorage.getItem("userid")) {
      this.token = localStorage.getItem("token");
      this.userid = localStorage.getItem("userid");
      this.getNotes();
    } else {
      console.log('Not signed in');
      // push login to the router
      this.$router.push({ name: 'Login' });
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeHandler);
  },
  watch: {
    userid(newUserid) {
      console.log('userid changed', newUserid);
      this.getNotes();
    },
    fullWidth(oldToggle, newToggle) {
      console.log('width changed:', oldToggle, newToggle);
    }
  }
}

AOS.init();
</script>

<style>
</style>
