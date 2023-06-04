import axios from 'axios';

class ApiService {
  constructor() {
    // this.baseUrl = 'http://localhost:5003';
    this.baseUrl = process.env.API_URL;
    console.log('API_URL:', this.baseUrl);
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
    const response = await axios.post(url, { email, password });

    // Ensure the response contains a userid
    if (response.data && response.data.userid) {
      return response.data;
    } else {
      throw new Error('Signup Error: Userid not found in response');
    }

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
    return axios.post(url, { "noteid": noteId, "userid": userId });
  }

  async pinNoteRequest(noteId, pinBool, userId) {
    const url = this.baseUrl + '/pin/' + userId;
    return axios.post(url, { noteId, pin: Boolean(pinBool) });
  }

  async getTagNotesRequest(tag, userId) {
    const url = this.baseUrl + '/notes/' + userId + '/hashtag/' + tag;
    return axios.get(url);
  }

  async getPinsRequest(userId) {
    const url = this.baseUrl + '/pin/' + userId;
    const data = axios.get(url).data;
    return data;
  }

  async searchNotesRequest(userId, query) {
    const url = this.baseUrl + '/search/' + userId + '?query=' + encodeURIComponent(query);
    return axios.get(url);
  }

  async wakeServerRequest() {
    const url = this.baseUrl + '/redoc';
    return axios.get(url);
  }

  async gptCompleteRequest(prompt) {
    console.log('gpt_complete', prompt)
  
    const query = encodeURIComponent(prompt)
    console.log(query);

    const endpoint = `${this.baseUrl}/complete/?prompt=${query}`; // use encoded query here
    console.log(endpoint);
  
    try {
      const response = await axios.get(endpoint, {
        headers: {
          'Content-Type': 'application/json',
          'Allow-Control-Allow-Origin': '*'
        }
      })
      
      const data = response.data;
      console.log(data);
      const completion = data.gpt;
      console.log(completion);
      return completion;

    } catch(error) {
      console.error(error);
    }
  }
  
}
export default new ApiService();
