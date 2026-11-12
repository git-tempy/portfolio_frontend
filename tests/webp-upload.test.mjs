import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';

const sizing=()=>({width:2,height:2});
class UploadFile extends Blob {constructor(parts,name,options={}){super(parts,options);this.name=name;this.lastModified=options.lastModified||0;}}
const encoded=type=>new Blob([new Uint8Array(200)],{type});
const bitmap=()=>({width:2,height:2,close(){}});
const input=()=>new UploadFile(['x'],'design.png',{type:'image/png'});

async function fallback(type='image/webp'){
 const source=(await readFile(new URL('../src/lib/optimizeImage.js',import.meta.url),'utf8'))
   .replace(/^import .*;\r?\n/,'').replaceAll('export function','function').replaceAll('export async function','async function')
   .replace('new URL(\'./image.worker.js\',import.meta.url)','null');
 const context={imageDimensions:sizing,Blob,File:UploadFile,DOMException,setTimeout,clearTimeout,
   createImageBitmap:async()=>bitmap(),document:{createElement:()=>({getContext:()=>({drawImage(){}}),toBlob:cb=>cb(encoded(type))})}};
 vm.runInNewContext(source+';this.optimizeImage=optimizeImage;',context);
 return context.optimizeImage(input(),'gallery');
}
test('fallback keeps WebP even when a tiny PNG source is smaller',async()=>{
 const result=await fallback();assert.equal(result.file.type,'image/webp');assert.equal(result.file.name,'design.webp');assert.ok(result.file.size>input().size);
});
test('fallback rejects browsers silently encoding PNG instead of WebP',async()=>{
 await assert.rejects(fallback('image/png'),/cannot create WebP/);
});
test('worker always emits a real WebP derivative',async()=>{
 const source=(await readFile(new URL('../src/lib/image.worker.js',import.meta.url),'utf8')).replace(/^import .*;\r?\n/,'');
 let result;const self={postMessage:data=>result=data};
 class Canvas{getContext(){return{drawImage(){}}}async convertToBlob(){return encoded('image/webp')}}
 vm.runInNewContext(source,{self,imageDimensions:sizing,createImageBitmap:async()=>bitmap(),OffscreenCanvas:Canvas});
 await self.onmessage({data:{file:input(),kind:'gallery'}});assert.equal(result.blob.type,'image/webp');assert.ok(result.blob.size>input().size);
});
