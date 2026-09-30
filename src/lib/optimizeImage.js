import { imageDimensions } from './imageSizing';
export function validateImage(file) {
  if(!['image/jpeg','image/png','image/webp'].includes(file.type))throw new Error('Choose a JPG, PNG or WebP image.');
  if(file.size>40*1024*1024)throw new Error('Each image must be smaller than 40 MB.');
  if(!file.size)throw new Error('The selected file is empty.');
}
async function fallback(file,kind,signal) {
  const bitmap=await createImageBitmap(file,{imageOrientation:'from-image'});
  try {
    if(signal?.aborted)throw new DOMException('Cancelled','AbortError');
    const {width,height}=imageDimensions(bitmap.width,bitmap.height,kind);
    const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;
    await new Promise(resolve=>setTimeout(resolve,0));
    if(signal?.aborted)throw new DOMException('Cancelled','AbortError');
    canvas.getContext('2d').drawImage(bitmap,0,0,width,height);
    let blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/webp',.85));
    if(!blob)throw new Error('This browser could not optimize the image.');
    if(blob.size>=file.size&&width===bitmap.width&&height===bitmap.height)blob=file;
    return {blob,width,height,originalSize:file.size};
  }finally{bitmap.close();}
}
export async function optimizeImage(file,kind,signal) {
  validateImage(file);
  if(signal?.aborted)throw new DOMException('Cancelled','AbortError');
  let result;
  if(typeof Worker!=='undefined'&&typeof OffscreenCanvas!=='undefined'&&typeof createImageBitmap!=='undefined') {
    result=await new Promise((resolve,reject)=>{
      const worker=new Worker(new URL('./image.worker.js',import.meta.url),{type:'module'});
      let timer;
      const cleanup=()=>{worker.terminate();signal?.removeEventListener('abort',abort);clearTimeout(timer);};
      const abort=()=>{cleanup();reject(new DOMException('Cancelled','AbortError'));};
      signal?.addEventListener('abort',abort,{once:true});
      worker.onmessage=({data})=>{cleanup();data.error?reject(new Error(data.error)):resolve(data);};
      worker.onerror=()=>{cleanup();reject(new Error('Image processing failed. Please try a smaller image.'));};
      timer=setTimeout(()=>{cleanup();reject(new Error('Image processing timed out. Please try a smaller image.'));},30000);
      worker.postMessage({file,kind});
    });
  } else result=await fallback(file,kind,signal);
  if(signal?.aborted)throw new DOMException('Cancelled','AbortError');
  const extension=result.blob.type==='image/webp'?'.webp':file.name.match(/\.[^.]+$/)?.[0]||'.png';
  return {...result,file:new File([result.blob],file.name.replace(/\.[^.]+$/,'')+extension,{type:result.blob.type,lastModified:file.lastModified})};
}
