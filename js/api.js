const API_BASE_URL = 'https://linkroad-tms-backend.onrender.com';
const API_SECRET_KEY = 'linkroad-secure-key-2026';

const api = {
  async get(endpoint) {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: { 'X-API-Key': API_SECRET_KEY }
    });
    if (!res.ok) throw new Error(`GET ${endpoint} failed: ${res.statusText}`);
    return res.json();
  },

  async post(endpoint, data) {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_SECRET_KEY
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(`POST ${endpoint} failed: ${res.statusText}`);
    return res.json();
  },

  async delete(endpoint) {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: { 'X-API-Key': API_SECRET_KEY }
    });
    if (!res.ok) throw new Error(`DELETE ${endpoint} failed: ${res.statusText}`);
    return res.json();
  }
};