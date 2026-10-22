import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('C:/Users/della/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const out = path.join(path.dirname(fileURLToPath(import.meta.url)), 'public-evidence', 'review');
await fs.mkdir(out, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const observations = [];
try {
  for (const [device, viewport] of [['desktop', { width: 1440, height: 1000 }], ['mobile', { width: 390, height: 844 }]]) {
    const context = await browser.newContext({ viewport, deviceScaleFactor: 1, locale: 'ru-RU', reducedMotion: 'reduce', isMobile: device === 'mobile', hasTouch: device === 'mobile' });
    await context.route(/https?:\/\/([^/]*\.)?(mc\.yandex\.[^/]+|google-analytics\.com|googletagmanager\.com)\//, route => route.abort());
    const page = await context.newPage();
    await page.goto('https://tangerin.ru/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1600);
    const decline = page.getByRole('button', { name: 'Отклонить', exact: true });
    if (await decline.count()) await decline.first().click();
    for (const route of ['/', '/doma/laym', '/dlya-bolshoy-kompanii', '/vse-dlya-otdyha', '/dlya-komandirovochnyh', '/kostroma', '/usloviya-bronirovaniya']) {
      if (route !== '/') await page.goto(`https://tangerin.ru${route}`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(1400);
      const refuse = page.getByRole('button', { name: 'Отклонить', exact: true });
      if (await refuse.first().isVisible().catch(() => false)) {
        await refuse.first().click();
        await page.waitForTimeout(400);
      }
      await page.evaluate(async () => {
        await document.fonts.ready;
        for (let y = 0; y < document.body.scrollHeight; y += 700) {
          scrollTo(0, y);
          await new Promise(resolve => setTimeout(resolve, 60));
        }
        scrollTo(0, 0);
        await Promise.race([
          Promise.all([...document.images].filter(img => { const r = img.getBoundingClientRect(); return r.width && r.height && r.bottom > 0 && r.top < innerHeight; }).map(img => img.decode().catch(() => {}))),
          new Promise(resolve => setTimeout(resolve, 2500)),
        ]);
      });
      await page.waitForTimeout(700);
      const file = route === '/' ? 'home' : route.slice(1).replaceAll('/', '__');
      observations.push({ route, device, text: await page.locator('main').innerText(), frames: await page.locator('iframe').evaluateAll(items => items.map(item => ({ src: item.src, title: item.title }))) });
      await page.screenshot({ path: path.join(out, `${device}-${file}-top.png`) });
      if (route === '/') {
        for (const id of ['houses', 'about', 'gallery', 'rules', 'contacts']) {
          const section = page.locator(`#${id}`).first();
          if (await section.count()) await section.screenshot({ path: path.join(out, `${device}-home-${id}.png`) });
        }
        await page.evaluate(() => scrollTo(0, 0));
        const menu = page.getByRole('button', { name: 'Открыть меню', exact: true });
        if (await menu.count()) {
          await menu.click();
          await page.screenshot({ path: path.join(out, `${device}-menu.png`) });
          await page.keyboard.press('Escape');
          const close = page.getByRole('button', { name: 'Закрыть меню', exact: true });
          if (await close.isVisible().catch(() => false)) await close.click();
        }
      }
      console.log(`${device} reviewed ${route}`);
    }
    await context.close();
  }
} finally {
  await browser.close();
  await fs.writeFile(path.join(out, 'observations.json'), JSON.stringify(observations, null, 2));
}
