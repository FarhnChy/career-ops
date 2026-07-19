import { chromium } from 'playwright';

const browser = await chromium.connectOverCDP('http://127.0.0.1:9223');
const context = browser.contexts()[0];
const pages = context.pages();
const page = pages.find((candidate) => candidate.url().includes('/apply/200663968-3810'))
  || pages.find((candidate) => candidate.url().includes('idmsa.apple.com'))
  || pages.find((candidate) => candidate.url().includes('jobs.apple.com'))
  || pages.at(-1);
const action = process.argv[2] || 'inspect';
if (action === 'replace-resume') {
  const remove = page.locator('#resume-remove');
  if (await remove.count()) {
    await remove.click();
    await page.waitForTimeout(1000);
  }
  const file = page.locator('input[type=file]');
  console.log(`FILE_INPUTS ${await file.count()}`);
  if (await file.count()) {
    await file.setInputFiles('output/cv-farhan-chowdhury-apple-2026-07-15.pdf');
    await page.waitForTimeout(3000);
  }
}
if (action === 'continue') {
  await page.locator('#apply-step-continue-button').click();
  await page.waitForTimeout(2500);
}
if (action === 'fill-known-profile') {
  await page.locator('#profile-field-line1').fill('');
  await page.locator('#profile-field-city').fill('Brooklyn');
  await page.locator('#profile-field-state').fill('NY');
  await page.locator('#address-section-country-dropdown-0').selectOption({ label: 'United States of America' });
  await page.locator('#resumeFeedBack-INACC').check();
  await page.waitForTimeout(800);
}
console.log(`pages=${pages.length}`);
for (const candidate of pages) console.log(`PAGE ${candidate.url()}`);
console.log(`ACTIVE ${page.url()}`);
console.log(`TITLE ${await page.title()}`);
console.log(`BODY\n${(await page.locator('body').innerText()).slice(0, 20000)}`);
console.log('FIELDS');
for (const el of await page.locator('input, select, textarea, button').all()) {
  const data = await el.evaluate((node) => ({
    tag: node.tagName,
    type: node.getAttribute('type'),
    name: node.getAttribute('name'),
    id: node.id,
    placeholder: node.getAttribute('placeholder'),
    aria: node.getAttribute('aria-label'),
    value: node.value,
    text: (node.innerText || '').trim().slice(0, 150),
    required: node.required,
    checked: node.checked,
  }));
  console.log(JSON.stringify(data));
}
await browser.close();
