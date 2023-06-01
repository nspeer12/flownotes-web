import axios from "axios";

class ApiService {
  constructor() {
    this.baseUrl = process.env.VUE_APP_API_BASE_URL || "https://flownotesapi.speer.ai";
  }

  async login(email, password) {
    const response = await axios.post(`${this.baseUrl}/login`, { email, password });
    return response.data;
  }

  async signup(email, password) {
    const response = await axios.post(`${this.baseUrl}/signup`, { email, password });
    return response.data;
  }

  async getNotes(userid, token) {
    const options = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
    const response = await axios.get(`${this.baseUrl}/notes/${userid}`, options);
    return response.data;
  }

  async deleteNote(noteid, userid, token) {
    const options = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
    const response = await axios.delete(`${this.baseUrl}/delete/${noteid}`, options);
    return response.data;
  }

  async pinNote(noteid, pinbool, userid, token) {
    const options = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
    const response = await axios.put(`${this.baseUrl}/pin/${noteid}`, { pin: pinbool, userid }, options);
    return response.data;
  }

  async searchNotes(query, userid, token) {
    const options = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
    const response = await axios.get(`${this.baseUrl}/search/${userid}?query=${query}`, options);
    return response.data;
  }

  async saveNote(newNote, userid, token) {
    const options = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
    const response = await axios.post(`${this.baseUrl}/compose`, { ...newNote, userid }, options);
    return response.data;
  }

  async getPins(userid, token) {
    const options = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
    const response = await axios.get(`${this.baseUrl}/pin/${userid}`, options);
    return response.data;
  }

  async getTagNotes(tag, userid, token) {
    const options = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
    const response = await axios.get(`${this.baseUrl}/notes/${userid}/hashtag/${tag}`, options);
    return response.data;
  }

  async wakeServer() {
    const response = await axios.get(`${this.baseUrl}/redoc`);
    return response.data;
  }
}

export default new ApiService();
