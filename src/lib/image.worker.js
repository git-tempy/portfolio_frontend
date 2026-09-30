import { imageDimensions } from './imageSizing';
self.onmessage=async({data:{file,kind}})=>{
  let bitmap;
  try {
    bitmap=await createImageBitmap(file,{imageOrientation:'from-image'});
    const {width,height}=imageDimensions(bitmap.width,bitmap.height,kind);
    const canvas=new OffscreenCanvas(width,height);
    canvas.getContext('2d').drawImage(bitmap,0,0,width,height);
    const originalWidth=bitmap.width,originalHeight=bitmap.height;
    bitmap.close();bitmap=null;
    let blob=await canvas.convertToBlob({type:'image/webp',quality:.88});
    const target=kind==='cover'?450000:1800000;
    if(blob.size>target)blob=await canvas.convertToBlob({type:'image/webp',quality:.80});
    // Keep details rather than chasing an arbitrary file-size promise.
    if(blob.size>=file.size && width===originalWidth && height===originalHeight)blob=file;
    self.postMessage({blob,width,height,originalSize:file.size});
  }catch(error){self.postMessage({error:error.message||'This image could not be processed.'});}
  finally{bitmap?.close();}
};
