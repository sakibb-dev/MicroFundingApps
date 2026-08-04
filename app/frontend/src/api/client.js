import axios from 'axios';

const TOKEN_KEY = 'auth_token';

// sessionStorage (not localStorage/cookie) so each browser tab can hold a
// different role's session at once — see MICROINVEST_CONTEXT.md section 5.5.
export function getToken() {
  return sessionStorage.getItem(TOKEN_KEY);
}
export function setToken(token) {
  sessionStorage.setItem(TOKEN_KEY, token);
}
export function clearToken() {
  sessionStorage.removeItem(TOKEN_KEY);
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: { Accept: 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

function emitApiEvent(detail) {
  window.dispatchEvent(new CustomEvent('api-error', { detail }));
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      emitApiEvent({ type: 'network' });
      return Promise.reject(error);
    }

    const { status, data } = error.response;

    switch (status) {
      case 422:
        // Field-level validation — let the calling form handle `errors` inline.
        break;
      case 401:
        clearToken();
        emitApiEvent({ type: 'unauthorized' });
        break;
      case 403:
        emitApiEvent({ type: 'forbidden' });
        break;
      case 404:
        emitApiEvent({ type: 'not_found' });
        break;
      case 429:
        emitApiEvent({ type: 'rate_limited' });
        break;
      default:
        if (status >= 500) {
          emitApiEvent({ type: 'server_error' });
        } else if (data?.code) {
          emitApiEvent({ type: 'business_error', message: data.message });
        }
    }

    return Promise.reject(error);
  }
);

export default api;
