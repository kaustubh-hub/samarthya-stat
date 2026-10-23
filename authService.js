// Client for accounts, progress tracking and the MoSPI admin API.
// Sessions live in an HttpOnly cookie set by the server — nothing secret is kept in JS or localStorage.

async function request(method, path, body, opts = {}) {
  let res;
  try {
    res = await fetch(`/api${path}`, {
      method,
      credentials: 'same-origin',
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      keepalive: Boolean(opts.keepalive)
    });
  } catch {
    throw new Error('Cannot reach the server. Please check your connection and try again.');
  }
  if (opts.raw) return res;
  let data = null;
  try {
    data = await res.json();
  } catch {
    /* non-JSON */
  }
  if (!res.ok) {
    const err = new Error(data?.error || `Request failed (HTTP ${res.status})`);
    err.status = res.status;
    throw err;
  }
  return data;
}

export const register = (form) => request('POST', '/auth/register', form);
export const login = (email, password, role) => request('POST', '/auth/login', { email, password, role });
export const demoLogin = (id) => request('POST', '/auth/demo', { id });
export const logout = () => request('POST', '/auth/logout', {}).catch(() => null);
export const getMe = () => request('GET', '/auth/me').catch(() => null);
export const getHealth = () => request('GET', '/health').catch(() => ({}));
export const saveProgress = (snapshot) => request('PUT', '/me/progress', snapshot, { keepalive: true });

export const getAdminSummary = () => request('GET', '/admin/summary');
export const getAdminUsers = () => request('GET', '/admin/users');
export const getAdminUser = (id) => request('GET', `/admin/users/${encodeURIComponent(id)}`);

export async function downloadAdminCsv() {
  const res = await request('GET', '/admin/export.csv', null, { raw: true });
  if (!res.ok) throw new Error('Export failed. Please sign in again.');
  const url = URL.createObjectURL(await res.blob());
  const a = document.createElement('a');
  a.href = url;
  a.download = 'mospi-officer-progress.csv';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
