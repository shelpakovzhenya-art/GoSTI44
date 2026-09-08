import assert from 'node:assert/strict';
import { readFile, readdir, access } from 'node:fs/promises';
import path from 'node:path';

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
