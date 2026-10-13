const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/+$/, '');

/**
 * Common request helper with error parsing
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  };

  try {
    const res = await fetch(url, config);
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const errorMsg = data.message || `Request failed with status ${res.status}`;
      const err = new Error(errorMsg);
      err.status = res.status;
      err.data = data;
      throw err;
    }

    return data;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error(`Unable to reach backend API at ${API_BASE_URL}. Ensure the server is online and CORS is configured.`);
    }
    throw error;
  }
}

export const studentAPI = {
  getBaseUrl: () => API_BASE_URL,

  checkHealth: async () => {
    return request('/health');
  },

  getAll: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.department) query.append('department', params.department);
    const qs = query.toString() ? `?${query.toString()}` : '';
    return request(`/api/students${qs}`);
  },

  getById: async (id) => {
    return request(`/api/students/${encodeURIComponent(id)}`);
  },

  create: async (studentData) => {
    return request('/api/students', {
      method: 'POST',
      body: JSON.stringify(studentData)
    });
  },

  update: async (id, studentData) => {
    return request(`/api/students/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(studentData)
    });
  },

  delete: async (id) => {
    return request(`/api/students/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
  },

  getStats: async () => {
    return request('/api/students/stats/summary');
  }
};
