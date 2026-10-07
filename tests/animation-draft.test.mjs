import test from 'node:test';
import assert from 'node:assert/strict';
import {animationDraft} from '../src/lib/animationDraft.js';
test('draft reflects order/replacement and revokes only owned URLs',()=>{
 const revoked=[];let next=0;
 const api={createObjectURL:()=>`blob:${++next}`,revokeObjectURL:url=>revoked.push(url)};
 const draft=animationDraft([{id:7,image:'https://saved/7.png'},{key:'new',file:{}},{id:2,image:'https://saved/2.png'}],api);
 assert.deepEqual(draft.items.map(x=>x.image),['https://saved/7.png','blob:1','https://saved/2.png']);
 draft.dispose();assert.deepEqual(revoked,['blob:1']);
 const reordered=animationDraft([{id:2,image:'https://saved/2.png'},{key:'replacement',file:{}}],api);
 assert.deepEqual(reordered.items.map(x=>x.image),['https://saved/2.png','blob:2']);reordered.dispose();
});
