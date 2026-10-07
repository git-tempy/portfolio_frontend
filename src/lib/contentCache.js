export function createContentCache(ttl=300000,now=()=>Date.now()) {
 const entries=new Map();
 return {
  clear(path){path?entries.delete(path):entries.clear();},
  get(path,load){const cached=entries.get(path);if(cached&&now()-cached.time<ttl)return cached.promise;
   const promise=Promise.resolve().then(load);entries.set(path,{promise,time:now()});
   promise.catch(()=>{if(entries.get(path)?.promise===promise)entries.delete(path);});return promise;
  }
 };
}
