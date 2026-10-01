const TOKEN_KEY = 'desone-admin-session';
export const getAdminToken = () => sessionStorage.getItem(TOKEN_KEY);
export const saveAdminToken = token => sessionStorage.setItem(TOKEN_KEY, token);
export const clearAdminToken = () => sessionStorage.removeItem(TOKEN_KEY);

async function prepareForm(form, headers) {
  const data = {};
  for (const [name, value] of form.entries()) {
    let prepared = value;
    if (value instanceof File) {
      if (!value.size) continue;
      const response = await fetch(window.API_BASE_URL + '/api/uploads/presign/', {
        method: 'POST', headers: { Authorization: headers.get('Authorization'), 'Content-Type': 'application/json' },
        body: JSON.stringify({ content_type: value.type, size: value.size }),
      });
      const upload = await response.json();
      if (!response.ok) throw new Error(upload.error || 'Could not prepare file upload.');
      const result = await fetch(upload.url, { method: 'PUT', headers: { 'Content-Type': value.type }, body: value });
      if (!result.ok) throw new Error('File upload failed. Please try again.');
      prepared = { upload: upload.receipt };
    }
    if (name === 'images') {
      (data.images ||= []).push(prepared);
    } else {
      data[name] = prepared;
    }
  }
  return JSON.stringify(data);
}

export async function adminFetch(url, options = {}) {
  const headers = new Headers(options.headers);
  const token = getAdminToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);
  let body = options.body;
  if (body instanceof FormData) {
    body = await prepareForm(body, headers);
    headers.set('Content-Type', 'application/json');
  }
  const response = await fetch(url, { ...options, body, headers });
  if (response.status === 401) {
    clearAdminToken();
    window.location.reload();
  }
  return response;
}
