import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
const require = createRequire(import.meta.url);
const { chromium } = require('C:/Users/della/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root = path.dirname(fileURLToPath(import.meta.url));
const base = 'https://tangerin.ru';
const out = path.join(root, 'public-evidence');
await fs.mkdir(out, { recursive: true });
for (const dir of ['html', 'desktop', 'mobile']) await fs.mkdir(path.join(out, dir), { recursive: true });
const evidence = { capturedAt: new Date().toISOString(), origin: base, routes: [], resources: {} };
for (const route of ['/sitemap.xml', '/robots.txt', '/llms.txt', '/api/content']) {
  const response = await fetch(base + route);
  const body = await response.text();
  await fs.writeFile(path.join(out, route === '/api/content' ? 'published-content.json' : route.slice(1)), body);
  evidence.resources[route] = { status: response.status, bytes: Buffer.byteLength(body) };
}
const xml = await fs.readFile(path.join(out, 'sitemap.xml'), 'utf8');
const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]);
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  for (const [name, viewport] of [['desktop', { width: 1440, height: 1000 }], ['mobile', { width: 390, height: 844 }]]) {
    const context = await browser.newContext({ viewport, deviceScaleFactor: 1, reducedMotion: 'reduce', locale: 'ru-RU', isMobile: name === 'mobile', hasTouch: name === 'mobile' });
    await context.route(/https?:\/\/([^/]*\.)?(mc\.yandex\.[^/]+|google-analytics\.com|googletagmanager\.com)\//, route => route.abort());
    const page = await context.newPage();
    for (const url of urls) {
      const slug = new URL(url).pathname;
      const file = slug === '/' ? 'home' : slug.slice(1).replaceAll('/', '__');
      const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
      await page.waitForTimeout(500);
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 700) {
          window.scrollTo(0, y);
          await new Promise(resolve => setTimeout(resolve, 55));
        }
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(300);
      const details = await page.evaluate(() => ({
        title: document.title,
        canonical: document.querySelector('link[rel="canonical"]')?.href,
        h1: [...document.querySelectorAll('h1')].map(x => x.innerText),
        headings: [...document.querySelectorAll('h2,h3')].map(x => ({ level: x.tagName, text: x.innerText })),
        sections: [...document.querySelectorAll('main section, .contacts-section')].map(x => ({ id: x.id, className: x.className, heading: x.querySelector('h2,h3')?.innerText })),
        links: [...document.querySelectorAll('header a,nav a,footer a')].map(x => ({ text: x.innerText || x.getAttribute('aria-label'), href: x.getAttribute('href') })),
        buttons: [...document.querySelectorAll('button')].map(x => x.innerText || x.getAttribute('aria-label')).filter(Boolean),
        overflow: document.documentElement.scrollWidth > innerWidth + 1,
        width: innerWidth, height: document.documentElement.scrollHeight,
        imageCount: document.images.length,
        brokenImages: [...document.images].filter(x => x.complete && !x.naturalWidth && x.currentSrc).map(x => x.currentSrc),
        stylesheets: [...document.querySelectorAll('link[rel="stylesheet"]')].map(x => x.href),
      }));
      evidence.routes.push({ url, viewport: name, status: response?.status(), ...details });
      await page.screenshot({ path: path.join(out, name, `${file}.png`), fullPage: true });
      if (name === 'desktop') await fs.writeFile(path.join(out, 'html', `${file}.html`), await page.content());
      if (slug === '/') await page.screenshot({ path: path.join(out, `${name}-home-viewport.png`) });
      console.log(`${name} ${slug} ${response?.status()} h1=${details.h1.length} overflow=${details.overflow}`);
    }
    await context.close();
  }
} finally {
  await browser.close();
  await fs.writeFile(path.join(out, 'inventory.json'), JSON.stringify(evidence, null, 2));
}
console.log(`Saved ${evidence.routes.length} route/viewports`);
