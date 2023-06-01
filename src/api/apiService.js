import axios from 'axios';

class ApiService {
    constructor() {
      this.baseUrl = 'https://flownotesapi.speer.ai';
    }
  
    async login(email, password) {
      const url = this.baseUrl + '/login';
      return axios.post(url, { email, password });
    }
  
    async signup(email, password) {
      const url = this.baseUrl + '/signup';
      return axios.post(url, { email, password });
    }
  
    async getNotes(userId, token) {
      const url = this.baseUrl + '/notes/' + userId;
      return axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
    }
  
    async saveNote(note) {
      const url = this.baseUrl + '/compose';
      return axios.post(url, note);
    }
  
    async deleteNote(noteId, userId) {
      const url = this.baseUrl + '/delete';
      return axios.post(url, { noteId, userId });
    }
  
    async pinNote(noteId, pinBool, userId) {
      const url = this.baseUrl + '/pin/' + userId;
      return axios.post(url, { noteId, pin: Boolean(pinBool) });
    }
  
    async getTagNotes(userId, tag) {
      const url = this.baseUrl + '/notes/' + userId + '/hashtag/' + tag;
      return axios.get(url);
    }
  
    async getPins(userId) {
      const url = this.baseUrl + '/pin/' + userId;
      return axios.get(url);
    }
  
    async searchNotes(userId, query) {
      const url = this.baseUrl + '/search/' + userId + '?query=' + encodeURIComponent(query);
      return axios.get(url);
    }
  
    async wakeServer() {
      const url = this.baseUrl + '/redoc';
      return axios.get(url);
    }
  }
  
  export default new ApiService();
  