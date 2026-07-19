import { chromium } from 'playwright';

const action = process.argv[2] || 'inspect';
const browser = await chromium.connectOverCDP('http://127.0.0.1:9223');
const context = browser.contexts()[0];
let page = context.pages().find((p) => p.url().includes('jobs.apple.com')) || context.pages().at(-1);

if (action === 'navigate') {
  await page.goto('https://jobs.apple.com/en-us/details/200663981-3810/hardware-undergrad-engineering-internships', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(2500);
  const title = await page.title();
  const body = (await page.locator('body').innerText()).slice(0, 7000);
  console.log(`POSTING_TITLE ${title}`);
  console.log(`POSTING_MATCH ${body.includes('Hardware Undergrad Engineering Internships')}`);
  console.log(`SUBMIT_RESUME ${body.includes('Submit Resume')}`);
  const apply = page.getByText('Submit Resume', { exact: true }).first();
  if (await apply.count()) {
    await apply.click();
    await page.waitForTimeout(3500);
    page = context.pages().find((p) => p.url().includes('/apply/200663981-3810')) || context.pages().at(-1);
  }
}

console.log(`URL ${page.url()}`);
console.log(`TITLE ${await page.title()}`);
console.log((await page.locator('body').innerText()).slice(0, 12000));
await browser.close();
