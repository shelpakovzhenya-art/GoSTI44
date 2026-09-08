import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const cache = 'D:/Codex/cache/tangerine';
const html = await readFile(path.join(cache, 'client.html'), 'utf8');
const sources = {
  'hero.jpg':'https://static.tildacdn.com/tild3264-3930-4665-b064-306566346439/IMG_5300.JPG',
  'lux.jpg':'https://static.tildacdn.com/tild6362-3635-4763-b537-303630626336/20230219_150105-1.jpg',
  'lux-bedroom.jpg':'https://static.tildacdn.com/tild3937-6264-4566-b565-653630323131/IMG-20210228-WA0041.jpg',
  'lux-living.jpg':'https://static.tildacdn.com/tild3162-3766-4562-b336-353536646565/20230219_150533.jpg',
  'business.jpg':'https://static.tildacdn.com/tild3730-6333-4039-a363-306564643733/20231112_140609_resi.jpg',
  'business-bedroom.jpg':'https://static.tildacdn.com/tild6339-6437-4564-b537-356466333731/IMG-20230308-WA0031.jpeg',
  'business-living.jpg':'https://static.tildacdn.com/tild3635-3266-4161-a334-336262646631/20231110_134627__.jpg',
  'family.jpg':'https://static.tildacdn.com/tild3138-3739-4464-b939-333531303565/20220306_120724.jpg',
  'family-bedroom.jpg':'https://static.tildacdn.com/tild6537-3964-4263-b733-306662383362/20220306_112453.jpg',
  'family-living.jpg':'https://static.tildacdn.com/tild3661-3433-4136-a364-666165343432/20220306_120549.jpg',
  'veranda.jpg':'https://static.tildacdn.com/tild3066-3061-4039-b137-396462666236/IMG_5200.JPG',
  'host.jpg':'https://static.tildacdn.com/tild3063-6263-4136-b631-366663663665/20190802_174637_1.jpg',
  'yandex-logo.jpg':'https://static.tildacdn.com/tild3832-6235-4437-b365-356261643466/----.jpg',
  'gis-logo.png':'https://static.tildacdn.com/tild3739-3733-4131-b066-636235323365/1200x630wa.png',
  'google-logo.png':'https://static.tildacdn.com/tild3834-3537-4636-a637-656630313535/Google-Maps.png',
};
await mkdir(path.join(root, 'public/images'),{recursive:true});
let total=0;
for (const [name,url] of Object.entries(sources)) {
  if(!html.includes(url)) throw new Error(`Source not present on client site: ${name}`);
  let bytes;
  try { bytes=await readFile(path.join(cache,name)); }
  catch {
    const response=await fetch(url);
    if(!response.ok) throw new Error(`${name}: ${response.status}`);
    if(Number(response.headers.get('content-length')) > 3_000_000) throw new Error(`Asset too large: ${name}`);
    bytes=Buffer.from(await response.arrayBuffer());
    if(bytes.length > 3_000_000) throw new Error(`Asset too large: ${name}`);
    await writeFile(path.join(cache,name),bytes);
  }
  total+=bytes.length;
  if(total > 15_000_000) throw new Error('Bounded asset budget exceeded');
  await writeFile(path.join(root,'public/images',name),bytes);
}
await writeFile(path.join(root,'public/images/sources.json'),JSON.stringify({source:'https://gostevoidom44.ru/',retrieved:'2026-09-07',files:sources},null,2)+'\n');
console.log(`Prepared ${Object.keys(sources).length} assets (${(total/1024/1024).toFixed(2)} MiB).`);
