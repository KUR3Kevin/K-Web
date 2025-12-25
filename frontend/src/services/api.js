// API service for all backend communications
const API_BASE = '/api';

// Helper function for fetch with error handling
async function fetchAPI(url, options = {}) {
  try {
    const response = await fetch(url, {
      ...options,
      credentials: 'include', // Include cookies for session-based auth
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Articles API
export const articlesAPI = {
  getAll: () => fetchAPI(`${API_BASE}/articles`),
  getPending: () => fetchAPI(`${API_BASE}/articles/pending`),
  approve: (id) => fetchAPI(`${API_BASE}/articles/${id}/approve`, { method: 'PATCH' }),
  delete: (id) => fetchAPI(`${API_BASE}/articles/${id}`, { method: 'DELETE' }),
};

// Blog API
export const blogAPI = {
  getAll: () => fetchAPI(`${API_BASE}/blog`),
  getById: (id) => fetchAPI(`${API_BASE}/blog/${id}`),
  create: (data) => fetchAPI(`${API_BASE}/blog`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => fetchAPI(`${API_BASE}/blog/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  delete: (id) => fetchAPI(`${API_BASE}/blog/${id}`, { method: 'DELETE' }),
};

// Admin API
export const adminAPI = {
  login: (credentials) => fetchAPI(`${API_BASE}/admin/login`, {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  logout: () => fetchAPI(`${API_BASE}/admin/logout`, { method: 'POST' }),
  status: () => fetchAPI(`${API_BASE}/admin/status`),
  dashboard: () => fetchAPI(`${API_BASE}/admin/dashboard`),
  fetchNews: () => fetchAPI(`${API_BASE}/admin/fetch-news`, { method: 'POST' }),
};
