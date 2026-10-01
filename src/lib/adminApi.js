import { localAdminRequest } from './localPreview';
const TOKEN_KEY = 'desone-admin-session';
let memoryToken=null;
export const getAdminToken = () => {try{return sessionStorage.getItem(TOKEN_KEY)||memoryToken;}catch{return memoryToken;}};
export const saveAdminToken = token => {memoryToken=token;try{sessionStorage.setItem(TOKEN_KEY,token);}catch{/* Restricted browser storage. */}};
export const clearAdminToken = () => {memoryToken=null;try{sessionStorage.removeItem(TOKEN_KEY);}catch{/* Restricted browser storage. */}};

async function prepareForm(form, headers) {
  const data = {};
  for (const [name, value] of form.entries()) {
    let prepared = name === 'keep_image_ids' ? JSON.parse(value) : name === 'level' && value === '' ? null : value;
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
  const { remoteOnly = false, ...requestOptions } = options;
  options = requestOptions;
  const headers = new Headers(options.headers);
  const token = getAdminToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);
  const local=remoteOnly?null:await localAdminRequest(url,options,path=>fetch(window.API_BASE_URL+path,{headers}));
  if(local)return local;
  let body = options.body;
  if (body instanceof FormData) {
    body = await prepareForm(body, headers);
    headers.set('Content-Type', 'application/json');
  }
  let response;
  try {response=await fetch(url,{...options,body,headers});}
  catch(error){window.dispatchEvent(new CustomEvent('admin-request-error',{detail:error.message}));throw error;}
  if (response.status === 401) {
    clearAdminToken();
    window.location.reload();
  }
  if (!response.ok) {
    const data = await response.clone().json().catch(()=>({}));
    const message = data.error || data.detail || Object.entries(data).map(([key,value])=>key+': '+(Array.isArray(value)?value.join(' '):String(value))).join(' · ') || `Request failed (${response.status})`;
    window.dispatchEvent(new CustomEvent('admin-request-error',{detail:message}));
    if (!options.method || options.method==='GET') throw new Error(message);
  }
  return response;
}
