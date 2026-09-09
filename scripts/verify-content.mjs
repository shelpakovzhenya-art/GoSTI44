import assert from 'node:assert/strict';
import { readFile, readdir, access } from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import ts from 'typescript';

const root=path.resolve(import.meta.dirname,'..');
const source=await readFile(path.join(root,'content/site.json'),'utf8');
const initial=JSON.parse(source);
const page=await readFile(path.join(root,'src/components/landing.tsx'),'utf8');
const nav=await readFile(path.join(root,'src/components/navigation.tsx'),'utf8');
const sections=await readFile(path.join(root,'src/components/holiday-sections.tsx'),'utf8');
const markup=page+sections;
const manifest=JSON.parse(await readFile(path.join(root,'public/images/sources.json'),'utf8'));
for(const name of Object.keys(manifest.files)) await access(path.join(root,'public/images',name));
for(const file of await readdir(path.join(root,'src/components'))) {
  if(!file.endsWith('.tsx')) continue;
  const text=await readFile(path.join(root,'src/components',file),'utf8');
  for(const match of text.matchAll(/(?:src:|src=)\s*["'](\/images\/[^"']+)/g)) await access(path.join(root,'public',match[1]));
  for(const match of text.matchAll(/href="#([^"{]+)"/g)) assert(markup.includes(`id="${match[1]}"`),`Missing anchor ${match[1]}`);
}
for(const match of source.matchAll(/src:\s*"(\/images\/[^"']+)/g)) await access(path.join(root,'public',match[1]));
for(const anchor of ['about','houses','company','spa','services','gallery','reviews','contacts','booking','rules']) assert(markup.includes(`id="${anchor}"`),`Missing ${anchor}`);
assert(nav.includes('aria-expanded'));
assert(!/от \d[\d ]* ?₽/.test(page),'Unconfirmed starting price');
assert(source.includes('221989406502') && source.includes('70000001031488982') && source.includes('0xba7af5f7778d6ffa'),'Wrong map listing');
assert(initial.ratings.length===3 && initial.ratings.every(item=>item.rating==='5,0'),'Three verified platform ratings required');
const quotes=initial.reviewExcerpts.map(item=>item.quote);
const words=quotes.join(' ').replace(/\[.*?\]/g,'').trim().split(/\s+/).length;
assert(words<=25,`Review excerpt word limit: ${words}`);
await access(path.join(root,'public/brand/tangerines.webp'));
await access(path.join(root,'public/brand/citrus-leaves.webp'));
await access(path.join(root,'public/brand/lemon-branch.webp'));
await access(path.join(root,'public/brand/palm-frond.webp'));
console.log(`Content checks passed: ${Object.keys(manifest.files).length} source assets + 4 brand assets, 10 section anchors, 3 map cards, ${words} quoted words. Browser and build checks remain separate.`);

// Exercise the production adapter itself without Next, a server, or fixture fallbacks.
const adapterSource = await readFile(path.join(root, 'src/lib/content.ts'), 'utf8');
assert(!adapterSource.includes('content/site.json') && !adapterSource.includes('usingCms'));
const compiled = ts.transpileModule(adapterSource, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
const require = createRequire(import.meta.url);
const adapterModule = { exports: {} };
const testEnv = { CMS_URL: 'http://cms.test', NODE_ENV: 'production' };
let fetchResult = { ok: true, json: async () => ({ version: 1, entries: [] }) };
vm.runInNewContext(compiled, {
  exports: adapterModule.exports, require: name => name === 'react' ? { cache: fn => fn } : require(name),
  process: { env: testEnv }, AbortSignal, fetch: async () => {
    if (fetchResult instanceof Error) throw fetchResult;
    return fetchResult;
  },
});
const { assembleContent, parseContentPayload, getEntries } = adapterModule.exports;
const entry = (kind, key, data) => ({ kind, key, data });
const empty = assembleContent([]);
for (const key of ['houses', 'rules', 'ratings', 'reviewExcerpts', 'services', 'links', 'photos', 'comforts']) assert.equal(empty[key].length, 0, `No resurrected ${key}`);
assert.equal(Object.keys(empty.site).length, 0);
const first = entry('house', 'new-house', { ...initial.houses[0], name: 'Новый дом', area: '120' });
const input = [first, entry('house', 'another-house', { ...initial.houses[1], name: 'Другой дом' }), entry('service', 'new-service', { title: 'Новая услуга', description: 'Из CMS' })];
const before = JSON.stringify(input);
const result = assembleContent(input);
assert.equal(result.houses[0].id, 'new-house');
assert.equal(result.houses[0].area, 120);
assert.equal(result.houses[1].name, 'Другой дом');
assert.equal(result.services[0].text, 'Из CMS');
assert.equal(JSON.stringify(input), before, 'Assembly must not mutate input');
result.houses[0].images[0].src = '/changed.jpg';
assert.equal(JSON.stringify(input), before, 'Output does not share nested photo objects');
const overrides = [entry('section', 'landing', { texts: [{ key: '002', value: 'Section' }, { key: '004', value: '' }] }), entry('page', 'home', { seo: { h1: 'CMS heading' } }), entry('menu', 'secondary-menu', { buttons: [{ label: 'Wrong', href: '#wrong' }] })];
assert.equal(assembleContent(overrides).texts['landing.002'], 'CMS heading');
assert.equal(assembleContent([...overrides].reverse()).texts['landing.002'], 'CMS heading');
assert.equal(assembleContent(overrides).texts['landing.004'], '');
assert.equal(assembleContent(overrides).links.length, 0);
assert.doesNotThrow(() => assembleContent([entry('constructor', '__proto__', {})]));
assert.throws(() => parseContentPayload({ version: 1, entries: [first, first] }), /duplicate/);
assert.throws(() => parseContentPayload({ version: 1, entries: [{ key: 'broken', kind: 'house', data: null }] }), /object/);
assert.throws(() => assembleContent([entry('house', 'broken', { ...first.data, images: [] })]), /photograph/);
assert.equal((await getEntries()).length, 0);
fetchResult = { ok: false };
await assert.rejects(getEntries(), /unavailable/);
fetchResult = { ok: true, json: async () => ({ version: 2, entries: [] }) };
await assert.rejects(getEntries(), /format/);
delete testEnv.CMS_URL;
await assert.rejects(getEntries(), /CMS_URL is required/);
console.log('CMS contract checks passed: empty/deleted content, new records, ordering, isolation, validation, API failure and required configuration.');
