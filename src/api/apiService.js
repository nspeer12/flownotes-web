import axios from 'axios';

class ApiService {
  constructor() {
    this.baseUrl = 'http://localhost:5003';
  }

  async loginRequest(email, password) {
    const url = this.baseUrl + '/login';
    const response = await axios.post(url, { email, password });

    // Ensure the response contains a userid
    if (response.data && response.data.userid) {
      return response.data;
    } else {
      throw new Error('Userid not found in response');
    }
  }

  async signupRequest(email, password) {
    const url = this.baseUrl + '/signup';
    return axios.post(url, { email, password });
  }

  async getNotesRequest(userId, token) {
    const url = this.baseUrl + '/notes/' + userId + '/';
  
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Access-Control-Allow-Headers': 'Authorization',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error retrieving notes:', error);
      throw error;
    }
  }

  async saveNoteRequest(userId, note) {
    const url = this.baseUrl + '/compose/' + userId;
    return axios.post(url, note);
  }

  async deleteNoteRequest(noteId, userId) {
    const url = this.baseUrl + '/delete';
    return axios.post(url, { noteId, userId });
  }

  async pinNoteRequest(noteId, pinBool, userId) {
    const url = this.baseUrl + '/pin/' + userId;
    return axios.post(url, { noteId, pin: Boolean(pinBool) });
  }

  async getTagNotesRequest(userId, tag) {
    const url = this.baseUrl + '/notes/' + userId + '/hashtag/' + tag;
    return axios.get(url);
  }

  async getPinsRequest(userId) {
    const url = this.baseUrl + '/pin/' + userId;
    return axios.get(url);
  }

  async searchNotesRequest(userId, query) {
    const url = this.baseUrl + '/search/' + userId + '?query=' + encodeURIComponent(query);
    return axios.get(url);
  }

  async wakeServerRequest() {
    const url = this.baseUrl + '/redoc';
    return axios.get(url);
  }
}

export default new ApiService();
