<template>
  <div>
    <Navbar :query="query" :apiUrl="apiUrl" @search="searchNotes" />
    <div class="pt-5">
      <div class="row">
        <div class="col-1">
          <Sidebar @pins="getPins" @getTagNotes="getTagNotes" :taglist="taglist" />
        </div>
        <div class="col-11">
          <router-view :userid="userid" :apiUrl="apiUrl" :notes="notes" :fullWidth="fullWidth" :loggedIn="loggedIn" @note-saved="saveNote"
            @toggle-width="toggleWidth" @pin-note="pinNote" @delete-note="deleteNote" @get-tag-notes="getTagNotes"
            @login="handleLogin" @user-logged-in="handleUserLoggedIn" @logout="handleLogout" @signup="handleSignup" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue'
import Sidebar from './components/Sidebar.vue'
import Notebook from './components/Notebook.vue'

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
      apiUrl: "https://flownotesapi.speer.ai",
      token: null,
      fullWidth: false,
      loggedIn: false,
    }
  },
  methods: {
    async handleLogin(email, password) {
      console.log('Handling Login in App');
      const reqUrl = this.apiUrl + "/login";
      const user = { email, password };
      this.email = email;

      try {
        const response = await fetch(reqUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify(user),
        });

        if (response.ok) {
          console.log('Login Successful');
          const data = await response.json();
          const { userid, token } = data;
          sessionStorage.setItem('token', token);
          this.userid = userid;
          this.loggedIn = true;
          this.$router.push({ name: 'Notebook' });
          this.getNotes();

        } else {
          console.log('Login failed');
        }
      } catch (error) {
        console.log('Login error:', error);
      }
    },
    async handleLogout() {
      sessionStorage.removeItem('token');
      this.userid = null;
      this.loggedIn = false;
      console.log('Logged out');
      this.$router.push({ name: 'Login' });
    },
    async handleUserLoggedIn(userid) {
      this.userid = userid;
    },
    async handleSignup(email, password) {
      console.log('Sign up');
      const reqUrl = this.apiUrl + "/signup";

      try {
        const response = await fetch(reqUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
          console.log('Signup successful');
          const data = await response.json();
          localStorage.setItem('userid', data.userid);
          localStorage.setItem('token', data.token);
          this.loggedIn = true;
          this.$router.push({ name: 'Notebook' });
        } else {
          console.error('Signup failed');
        }
      } catch (error) {
        console.error('Error during signup:', error);
      }
    },

    async deleteNote(noteid) {
      const reqUrl = this.apiUrl + "/delete";
      const req = { noteid, userid: this.userid };

      try {
        await fetch(reqUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify(req),
        });

        this.getNotes();
      } catch (error) {
        console.log('Delete note error:', error);
      }
    },
    async pinNote(noteid, pinbool) {
      const params = new URLSearchParams();
      params.append('noteid', noteid);
      params.append('pin', Boolean(pinbool));

      const reqUrl = this.apiUrl + "pin/" + this.userid + "/?" + params;

      try {
        const response = await fetch(reqUrl, {
          method: 'POST',
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
        });

        console.log(response);
      } catch (error) {
        console.log('Pin note error:', error);
      }
    },
    async getNotes() {
      console.log('Get Notes');

      try {
        const reqUrl = `${this.apiUrl}/notes/${this.userid}/`;
        const response = await fetch(reqUrl, {
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Access-Control-Allow-Origin': '*',
          },
        });

        if (response.ok) {
          const data = await response.json();
          this.notes = data.notes;
          this.taglist = data.taglist;
        } else {
          console.log('Get notes failed');
        }
      } catch (error) {
        console.log('Get notes error:', error);
      }
    },

    async getPins() {
      const reqUrl = this.apiUrl + "/pin/" + this.userid;

      try {
        const response = await fetch(reqUrl, {
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log('getpins', data);
          this.notes = data.notes;
        } else {
          console.log('Get pins failed');
        }
      } catch (error) {
        console.log('Get pins error:', error);
      }
    },
    async saveNote(newNote) {
      const reqUrl = this.apiUrl + "/compose";

      this.notes.push(newNote);

      try {
        await fetch(reqUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify(newNote),
        });

        this.getNotes();
      } catch (error) {
        console.log('Save note error:', error);
      }
    },
    searchNotes(query) {
      const queryurl = encodeURIComponent(query);
      const reqUrl = this.apiUrl + "/search/" + this.userid + "/?query=" + queryurl;

      fetch(reqUrl)
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Search notes request failed');
          }
        })
        .then(data => {
          this.notes = data.notes;
          this.taglist = data.taglist;
        })
        .catch(error => {
          console.log('Search notes error:', error);
        });
    },
    async getTagNotes(tag) {
      const reqUrl = this.apiUrl + "/notes/" + this.userid + "/hashtag/" + tag;

      try {
        const response = await fetch(reqUrl, {
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
        });

        if (response.ok) {
          const data = await response.json();
          this.notes = data.notes;
          this.taglist = data.taglist;
        } else {
          console.log('Get tag notes failed');
        }
      } catch (error) {
        console.log('Get tag notes error:', error);
      }
    },
    toggleWidth() {
      this.fullWidth = !this.fullWidth;
    },
    async wakeServer() {
      // make a get request to apiUrl /redoc
      const reqUrl = this.apiUrl + "/redoc";

      try {
        const response = await fetch(reqUrl);
      } catch (error) {
        console.log('Error communicating with server:', error);
      }
    }
  },
  async created() {
    this.wakeServer();

    if (localStorage.getItem("token") && localStorage.getItem("userid")) {
      this.token = localStorage.getItem("token");
      this.userid = localStorage.getItem("userid");
      this.getNotes();
    } else {
      console.log('Not signed in');
    }
  },
  watch: {
    userid(newUserid) {
      console.log('userid changed', newUserid);
    },
    fullWidth(oldToggle, newToggle) {
      console.log('width changed:', oldToggle, newToggle);
    }
  }
}
</script>

<style>
</style>
