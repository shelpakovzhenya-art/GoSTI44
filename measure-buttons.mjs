import { createRequire } from 'node:module';
import fs from 'node:fs/promises';
const require = createRequire(import.meta.url);
const { chromium } = require('C:/Users/della/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const results = [];
try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  const css = process.argv[2] ? await fs.readFile(process.argv[2], 'utf8') : '';
  if (process.argv.includes('--sheet')) await page.route('**/1m2h-mobile-header-icons-20261019.css', route => route.fulfill({ status: 200, contentType: 'text/css', body: css }));
  await page.goto('https://tangerin.ru/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1800);
  await page.getByRole('button', { name: 'Отклонить', exact: true }).first().click().catch(() => {});
  if (css && !process.argv.includes('--sheet')) await page.addStyleTag({ content: css });
  for (const width of [320, 360, 390, 430, 550, 760, 1440]) {
    await page.setViewportSize({ width, height: width === 1440 ? 1000 : 844 });
    await page.waitForTimeout(200);
    results.push(await page.evaluate(() => ({
      viewport: innerWidth,
      overflow: document.documentElement.scrollWidth > innerWidth + 1,
      elements: [...document.querySelectorAll('.hero-actions > *, .mobile-bottom, .mobile-bottom > *')].map(el => {
        const r = el.getBoundingClientRect(), s = getComputedStyle(el);
        const textLines = [...el.childNodes].filter(n => n.nodeType === Node.TEXT_NODE && n.textContent.trim()).map(n => { const range = document.createRange(); range.selectNodeContents(n); return [...range.getClientRects()].map(r => ({ x: r.x, width: r.width, height: r.height })); });
        const fontRules = [];
        const walk = rules => { for (const rule of rules) { if (rule.selectorText && (rule.style.fontSize || rule.style.font)) { try { if (el.matches(rule.selectorText)) fontRules.push(rule.cssText); } catch {} } else if (rule.cssRules) { if (!rule.conditionText || matchMedia(rule.conditionText).matches) walk(rule.cssRules); } } };
        for (const sheet of document.styleSheets) { try { walk(sheet.cssRules); } catch {} }
        return { tag: el.tagName, class: el.className, text: el.innerText, inlineStyle: el.getAttribute('style'), display: s.display, x: r.x, width: r.width, height: r.height, font: s.fontSize, padding: s.padding, gap: s.gap, columns: s.gridTemplateColumns, radius: s.borderRadius, textLines, fontRules };
      }),
    })));
    if (process.argv.includes('--screenshots') && [320, 390, 1440].includes(width)) await page.screenshot({ path: `changes/20261020-mobile-buttons/${process.argv.includes('--live') ? 'live' : 'preview'}-${width}.png` });
  }
  console.log(JSON.stringify(results, null, 2));
} finally { await browser.close(); }
