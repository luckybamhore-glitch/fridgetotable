const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

const getToken = () => localStorage.getItem('ftt_token') || '';

export async function apiFetch(path, { method = 'GET', body, formData = false, auth = true } = {}) {
  const headers = {};
  if (!formData) headers['Content-Type'] = 'application/json';
  if (auth && getToken()) headers['Authorization'] = `Bearer ${getToken()}`;

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: formData ? body : body ? JSON.stringify(body) : undefined
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (res.status === 401 && auth) {
    // Token invalid — clear session so ProtectedRoute redirects to login
    localStorage.removeItem('ftt_token');
    localStorage.removeItem('ftt_user');
    if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
      // Soft redirect only for protected pages; HomePage handles guest mode
      if (window.location.pathname.startsWith('/saved')) {
        window.location.assign('/login');
      }
    }
  }

  if (!res.ok) {
    const err = new Error(data?.message || `Request failed (${res.status})`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export const api = {
  get: (p, opts) => apiFetch(p, { ...opts, method: 'GET' }),
  post: (p, body, opts) => apiFetch(p, { ...opts, method: 'POST', body }),
  postForm: (p, form, opts) => apiFetch(p, { ...opts, method: 'POST', body: form, formData: true }),
  del: (p, opts) => apiFetch(p, { ...opts, method: 'DELETE' })
};

export { API_BASE };
