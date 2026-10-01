const key='desone-local-profile-preview';
export const localPreviewEnabled=import.meta.env.DEV && ['127.0.0.1','localhost'].includes(location.hostname) && localStorage.getItem('desone-preview-published')!=='true';
function database(){return new Promise((resolve,reject)=>{
  const request=indexedDB.open('desone-local-preview',1);
  request.onupgradeneeded=()=>request.result.createObjectStore('profiles');
  request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);
});}
export async function localProfile(data) {
  if(!localPreviewEnabled)return data;
  try{
    const db=await database();
    const saved=await new Promise((resolve,reject)=>{const request=db.transaction('profiles').objectStore('profiles').get('about');request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);});db.close();
    return {...data,...(saved||JSON.parse(localStorage.getItem(key)||'{}'))};
  }catch{return data;}
}
export async function saveLocalProfile(data) {
  let image=data.image;
  if(image instanceof Blob)image=await new Promise((resolve,reject)=>{
    const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=()=>reject(new Error('Could not prepare local preview.'));reader.readAsDataURL(image);
  });
  const db=await database();
  try{await new Promise((resolve,reject)=>{const tx=db.transaction('profiles','readwrite');tx.objectStore('profiles').put({...data,image},'about');tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error||new Error('Local save failed.'));});}
  finally{db.close();}
  try{localStorage.setItem(key+'-version',String(Date.now()));}catch{/* Same-tab refresh still works if storage notifications are blocked. */}
  window.dispatchEvent(new Event('portfolio-preview-change'));
}

const collections=/^\/api\/(experiences|education|skills|traits|certificates|portfolio\/categories|portfolio\/projects)\/(?:([^/]+)\/)?$/;
async function readCollection(path){
  const db=await database();
  try{return await new Promise((resolve,reject)=>{const r=db.transaction('profiles').objectStore('profiles').get(path);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});}finally{db.close();}
}
export async function localContent(path,data){
  if(!localPreviewEnabled)return data;
  if(path==='/api/about/')return localProfile(data);
  const match=path.match(collections);if(!match)return data;
  const saved=await readCollection('/api/'+match[1]+'/');
  return saved===undefined?data:match[2]?saved.find(item=>String(item.id)===match[2])??data:saved;
}
export async function localAdminRequest(url,options,remoteRead){
  if(!localPreviewEnabled)return null;
  const path=new URL(url,location.origin).pathname,match=path.match(collections);
  if(!match)return null;
  const base='/api/'+match[1]+'/',method=(options.method||'GET').toUpperCase();
  let items=await readCollection(base);
  if(method==='GET'){
    if(items===undefined)return null;
    return Response.json(match[2]?items.find(item=>String(item.id)===match[2]):items);
  }
  if(items===undefined){const res=await remoteRead(base);if(!res.ok)throw new Error('Could not load existing content.');items=await res.json();}
  if(!Array.isArray(items))throw new Error('Invalid content list.');
  let result=null;
  if(method==='DELETE')items=items.filter(item=>String(item.id)!==match[2]);
  else{
    const data={};
    if(options.body instanceof FormData){for(const [name,value] of options.body.entries()){
      const prepared=value instanceof Blob?await new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=()=>reject(r.error);r.readAsDataURL(value);}):value;
      if(name==='images')(data.images||=[]).push({image:prepared});else data[name]=prepared;
    }}else Object.assign(data,JSON.parse(options.body||'{}'));
    result={...(items.find(item=>String(item.id)===match[2])||{}),...data,id:match[2]?items.find(item=>String(item.id)===match[2])?.id??match[2]:Date.now()};
    items=match[2]?items.map(item=>String(item.id)===match[2]?result:item):[...items,result];
  }
  const db=await database();try{await new Promise((resolve,reject)=>{const tx=db.transaction('profiles','readwrite');tx.objectStore('profiles').put(items,base);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error);});}finally{db.close();}
  localStorage.setItem(key+'-version',String(Date.now()));window.dispatchEvent(new Event('portfolio-preview-change'));
  return method==='DELETE'?new Response(null,{status:204}):Response.json(result);
}


// Publish only records explicitly saved in this local preview. Existing remote records are never deleted.
export async function publishLocalPreview(remoteRequest, onProgress) {
  const db=await database();
  const records=await new Promise((resolve,reject)=>{
    const tx=db.transaction('profiles');const store=tx.objectStore('profiles');
    const keys=store.getAllKeys(),values=store.getAll();
    tx.oncomplete=()=>resolve(keys.result.map((key,i)=>[key,values.result[i]]));
    tx.onerror=()=>reject(tx.error);
  });
  db.close();
  async function persist(key,value){
    const connection=await database();
    try{await new Promise((resolve,reject)=>{const tx=connection.transaction('profiles','readwrite');tx.objectStore('profiles').put(value,key);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);});}
    finally{connection.close();}
  }
  async function submit(path,item,method){
    const form=new FormData();
    for(const [field,value] of Object.entries(item)){
      if(['id','imageRemoved','imageName','images','projects_count','category_id'].includes(field)||value==null)continue;
      if(field==='level'&&value===''){form.append(field,'');continue;}
      if(typeof value==='string'&&value.startsWith('data:')){
        const blob=await (await fetch(value)).blob();
        form.append(field,new File([blob],`preview.${blob.type.split('/')[1]||'bin'}`,{type:blob.type}));
      }else if(['image','logo','file','cover_image','resume_pdf'].includes(field)){
        if(value===''&&field==='image'&&item.imageRemoved)form.append(field,'');
      }else if(typeof value!=='object')form.append(field,String(value));
    }
    const response=await remoteRequest(window.API_BASE_URL+path,{method,body:form,remoteOnly:true});
    if(!response.ok){const error=await response.json();throw new Error(JSON.stringify(error));}
    return response.json();
  }
  let count=0;
  for(const [key,value] of records){
    if(key==='about'){
      onProgress('Profil va rasm bazaga saqlanmoqda…');
      const result=await submit('/api/about/',value,'POST');await persist(key,result);count++;continue;
    }
    if(!collections.test(key)||!Array.isArray(value))continue;
    // Projects require category/image mapping; do not silently lose their gallery.
    if(key.includes('portfolio/')&&value.length)throw new Error('Loyihalarni ko‘chirish uchun kategoriya va galereya moslashtirilishi kerak.');
    const updated=[...value];
    for(let i=0;i<value.length;i++){
      const item=value[i];onProgress(`${key}: ${i+1}/${value.length}`);
      const existing=Number(item.id)<1000000000000;
      updated[i]=await submit(existing?`${key}${item.id}/`:key,item,existing?'PUT':'POST');
      await persist(key,updated);count++;
    }
  }
  window.dispatchEvent(new Event('portfolio-preview-change'));
  localStorage.setItem('desone-preview-published','true');
  return count;
}
