import test from 'node:test';import assert from 'node:assert/strict';
import {createContentCache} from '../src/lib/contentCache.js';import {projectCoverImages} from '../src/lib/projectCovers.js';
test('concurrent consumers and language rerenders share one request; expiry and save invalidation refetch',async()=>{
 let time=0,calls=0;const cache=createContentCache(300,()=>time),load=async()=>({request:++calls});
 const [a,b]=await Promise.all([cache.get('/skills',load),cache.get('/skills',load)]);assert.strictEqual(a,b);assert.equal(calls,1);
 await cache.get('/skills',load);assert.equal(calls,1);time=301;await cache.get('/skills',load);assert.equal(calls,2);
 cache.clear('/skills');await cache.get('/skills',load);assert.equal(calls,3);
 cache.clear();await cache.get('/skills',load);assert.equal(calls,4);
});
test('failed requests can retry without poisoning cache',async()=>{const cache=createContentCache();await assert.rejects(cache.get('x',()=>Promise.reject(Error('offline'))));assert.equal(await cache.get('x',()=>42),42);});
test('legacy, empty, duplicate and ordered multi-cover projects',()=>{assert.deepEqual(projectCoverImages({}),[]);assert.deepEqual(projectCoverImages({cover_image:'a'}),['a']);assert.deepEqual(projectCoverImages({cover_image:'a',covers:[{image:'b'},{image:'a'},{image:'c'}]}),['b','a','c']);assert.deepEqual(projectCoverImages({covers:[{image:'c'},{image:'b'}]}),['c','b']);});
