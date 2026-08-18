const API_BASE_URL = 'https://linkroad-tms-backend.onrender.com';
const API_SECRET_KEY = 'linkroad-secure-key-2026';

function getHeaders(isJSON = true) {
  const token = localStorage.getItem('tms_token');
  const headers = {};
  if (isJSON) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  } else {
    // Fallback to API Key if no token is found
    headers['X-API-Key'] = API_SECRET_KEY;
  }
  return headers;
}

const api = {
  async login(username, password) {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString()
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: res.statusText }));
      throw new Error(err.detail || 'Login failed');
    }

    const data = await res.json();
    if (data.access_token) {
      localStorage.setItem('tms_token', data.access_token);
    }
    return data;
  },

  logout() {
    localStorage.removeItem('tms_token');
    window.location.reload();
  },

  async get(endpoint) {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: getHeaders(false)
    });
    if (res.status === 401) {
      localStorage.removeItem('tms_token');
    }
    if (!res.ok) throw new Error(`GET ${endpoint} failed: ${res.statusText}`);
    return res.json();
  },

  async post(endpoint, data) {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(data)
    });
    if (res.status === 401) {
      localStorage.removeItem('tms_token');
    }
    if (!res.ok) throw new Error(`POST ${endpoint} failed: ${res.statusText}`);
    return res.json();
  },

  async delete(endpoint) {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: getHeaders(false)
    });
    if (res.status === 401) {
      localStorage.removeItem('tms_token');
    }
    if (!res.ok) throw new Error(`DELETE ${endpoint} failed: ${res.statusText}`);
    return res.json();
  }
};