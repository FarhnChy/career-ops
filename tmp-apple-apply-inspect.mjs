import { chromium } from 'playwright';

const browser = await chromium.connectOverCDP('http://127.0.0.1:9223');
const context = browser.contexts()[0];
const pages = context.pages();
const page = pages.find((candidate) => candidate.url().includes('/apply/200663981-3810'))
  || pages.at(-1);

console.log(`URL ${page.url()}`);
console.log(`TITLE ${await page.title()}`);
console.log(`BODY\n${(await page.locator('body').innerText()).slice(0, 20_000)}`);
console.log('FIELDS');

for (const element of await page.locator('input, select, textarea, button').all()) {
  const data = await element.evaluate((node) => ({
    tag: node.tagName,
    type: node.getAttribute('type'),
    name: node.getAttribute('name'),
    id: node.id,
    placeholder: node.getAttribute('placeholder'),
    aria: node.getAttribute('aria-label'),
    value: node.value,
    text: (node.innerText || '').trim().slice(0, 180),
    required: node.required,
    checked: node.checked,
    disabled: node.disabled,
  }));
  console.log(JSON.stringify(data));
}

await page.screenshot({ path: 'output/apple-apply-current.png', fullPage: true });
process.exit(0);
