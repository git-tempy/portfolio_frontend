import test from 'node:test';
import assert from 'node:assert/strict';
import { createProjectOrder } from '../src/lib/projectOrder.js';

test('shuffle keeps every project and never mutates the API array', () => {
  const projects = [1, 2, 3, 4].map(id => ({ id }));
  const order = createProjectOrder(() => 0);
  assert.deepEqual(order(projects).map(p => p.id), [2, 3, 4, 1]);
  assert.deepEqual(projects.map(p => p.id), [1, 2, 3, 4]);
});

test('home, catalog, language changes and filtered subsets retain the same order', () => {
  const order = createProjectOrder(() => 0);
  const first = order([1, 2, 3, 4].map(id => ({ id })));
  const translated = [4, 3, 2, 1].map(id => ({ id: String(id), title: 'Translated' }));
  assert.deepEqual(order(translated).map(p => Number(p.id)), first.map(p => p.id));
  assert.deepEqual(order(translated.filter(p => Number(p.id) % 2 === 0)).map(p => Number(p.id)), [2, 4]);
});

test('empty loading results and newly added projects preserve existing ranks', () => {
  const order = createProjectOrder(() => 0);
  assert.deepEqual(order([]), []);
  const initial = order([1, 2, 3].map(id => ({ id }))).map(p => p.id);
  assert.deepEqual(order([4, 3, 2, 1].map(id => ({ id }))).map(p => p.id), [...initial, 4]);
});
