
const apiUrl = "https://flownotesapi.speer.ai";

const fetchApi = async (endpoint, method, body, token) => {
  const url = `${apiUrl}${endpoint}`;
  const headers = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method,
    headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json();
};

export default {
  async login(email, password) {
    return fetchApi('/login', 'POST', { email, password });
  },

  async signup(email, password) {
    return fetchApi('/signup', 'POST', { email, password });
  },

  async deleteNote(noteid, userid) {
    return fetchApi('/delete', 'POST', { noteid, userid });
  },

  async pinNote(noteid, pinbool, userid) {
    return fetchApi(`/pin/${userid}`, 'POST', { noteid, pinbool });
  },

  async getNotes(userid, token) {
    return fetchApi(`/notes/${userid}`, 'GET', null, token);
  },

  async getPins(userid) {
    return fetchApi(`/pin/${userid}`, 'GET');
  },

  async saveNote(newNote) {
    return fetchApi('/compose', 'POST', newNote);
  },

  async searchNotes(query, userid) {
    const queryUrl = encodeURIComponent(query);
    return fetchApi(`/search/${userid}/?query=${queryUrl}`, 'GET');
  },

  async getTagNotes(tag, userid) {
    return fetchApi(`/notes/${userid}/hashtag/${tag}`, 'GET');
  },

  async wakeServer() {
    return fetchApi('/redoc', 'GET');
  }
};
