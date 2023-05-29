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
      apiUrl: "https://flownotesapi.speer.ai",
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
        const res = await axios.post(reqUrl, user);

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
    async handleLogout() {
      sessionStorage.removeItem('token');
      this.userid = null;
      console.log('Logged out');
    },
    async handleUserLoggedIn(userid) {
      this.userid = userid;
    },
    async handleSignup(email, password) {
      console.log('Sign up');
      const reqUrl = `${this.apiUrl}/signup`;

      try {
        const response = await axios.post(reqUrl, { email, password });

        if (response.data.success) {
          console.log('Signup successful');

          // Store userid and token in local storage or another secure place
          localStorage.setItem('userid', response.data.userid);
          localStorage.setItem('token', response.data.token);

          // Redirect to the Notebook view
          this.$router.push({ name: 'Notebook' });
        } else {
          console.error('Signup failed:', response.data.message);
          // Handle failed signup (e.g., show error message)
        }
      } catch (error) {
        console.error('Error during signup:', error);
        // Handle other errors (e.g., network errors)
      }
    },
    async deleteNote(noteid) {
      const reqUrl = `${this.apiUrl}/delete`;
      const req = { noteid, userid: this.userid };

      try {
        await axios.post(reqUrl, req);

        this.getNotes();
      } catch (error) {
        console.log('Delete note error:', error);
      }
    },
    async pinNote(noteid, pinbool) {
      const params = new URLSearchParams();
      params.append('noteid', noteid);
      params.append('pin', Boolean(pinbool));

      const reqUrl = `${this.apiUrl}/pin/${this.userid}/?${params}`;

      try {
        const response = await axios.post(reqUrl);
        console.log(response.data);
      } catch (error) {
        console.log('Pin note error:', error);
      }
    },
    async getNotes() {
      console.log('Get Notes');

      try {
        const reqUrl = `${this.apiUrl}/notes/${this.userid}/`;
        const response = await axios.get(reqUrl, {
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        });

        this.notes = response.data.notes;
        this.taglist = response.data.taglist;
      } catch (error) {
        console.log('Get notes error:', error);
      }
    },

    async getPins() {
      const reqUrl = `${this.apiUrl}/pin/${this.userid}`;

      try {
        const response = await axios.get(reqUrl);
        console.log('getpins', response.data);

        this.notes = response.data.notes;
      } catch (error) {
        console.log('Get pins error:', error);
      }
    },
    async saveNote(newNote) {
      const reqUrl = `${this.apiUrl}/compose`;

      this.notes.push(newNote);

      try {
        await axios.post(reqUrl, newNote);

        this.getNotes();
      } catch (error) {
        console.log('Save note error:', error);
      }
    },
    searchNotes(query) {
      const queryurl = encodeURIComponent(query);
      const reqUrl = `${this.apiUrl}/search/${this.userid}/?query=${queryurl}`;

      axios.get(reqUrl)
        .then(response => {
          this.notes = response.data.notes;
          this.taglist = response.data.taglist;
        })
        .catch(error => {
          console.log('Search notes error:', error);
        });
    },
    async getTagNotes(tag) {
      const reqUrl = `${this.apiUrl}/notes/${this.userid}/hashtag/${tag}`;

      try {
        const response = await axios.get(reqUrl);
        this.notes = response.data.notes;
        this.taglist = response.data.taglist;
      } catch (error) {
        console.log('Get tag notes error:', error);
      }
    },
    toggleWidth() {
      this.fullWidth = !this.fullWidth;
    }
  },
  async created() {
    if (localStorage.getItem("token") && localStorage.getItem("userid")) {
      this.token = localStorage.getItem("token");
      this.userid = localStorage.getItem("userid");
    } else {
      console.log('Not signed in');
    }
  },
  watch: {
    userid(newUserid) {
      console.log('userid changed', newUserid);
    },
    fullWidth(oldToggle, newToggle) {
      console.log('width changed: ', oldToggle, newToggle);
    }
  }
}
</script>

<style>
/* Your Styles... */
</style>
