import test from 'node:test';
import assert from 'node:assert/strict';
import handler from '../api/image-source.js';
const allowed = 'https://br-cold-sun-b1ney4xj.storage.c-5.eu-central-1.aws.neon.tech/portfolio-media/uploads/1/test.webp';
const request = (url, method='GET') => ({query:{url}, method});
function result() {return {headers:{},setHeader(k,v){this.headers[k]=v;},status(code){this.code=code;return this;},end(){return this;},send(body){this.body=body;return this;}};}
test('rejects other hosts, protocols, paths, credentials, ports and methods without fetching', async()=>{
 const original=global.fetch; global.fetch=()=>{throw Error('unexpected fetch');};
 try {for(const url of ['http://127.0.0.1/a','https://example.com/a',allowed.replace('/uploads/','/private/'),allowed.replace('https://','https://user@'),allowed.replace('.tech/','.tech:8443/')]) {const res=result();await handler(request(url),res);assert.equal(res.code,400);}const res=result();await handler(request(allowed,'POST'),res);assert.equal(res.code,405);}finally{global.fetch=original;}
});
test('returns approved image bytes without caching and blocks nonimages or oversized bodies',async()=>{
 const original=global.fetch;
 try {global.fetch=async()=>new Response(new Uint8Array([1,2,3]),{headers:{'content-type':'image/webp'}});const res=result();await handler(request(allowed),res);assert.equal(res.code,200);assert.deepEqual([...res.body],[1,2,3]);assert.equal(res.headers['Cache-Control'],'no-store');
 global.fetch=async()=>new Response('html',{headers:{'content-type':'text/html'}});const invalid=result();await handler(request(allowed),invalid);assert.equal(invalid.code,502);
 global.fetch=async()=>new Response('x',{headers:{'content-type':'image/png','content-length':String(41*1024*1024)}});const big=result();await handler(request(allowed),big);assert.equal(big.code,413);
 }finally{global.fetch=original;}
});
