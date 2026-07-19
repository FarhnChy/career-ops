import { chromium } from 'playwright';

const browser = await chromium.connectOverCDP('http://127.0.0.1:9223');
const context = browser.contexts()[0];
const page = context.pages().find((candidate) => candidate.url().includes('/apply/200663981-3810'))
  || context.pages().at(-1);

const answers = await page.locator('input[type="radio"], input[type="checkbox"]').evaluateAll((nodes) => nodes.map((node) => ({
  id: node.id,
  type: node.type,
  required: node.required,
  checked: node.checked,
  label: document.querySelector(`label[for="${node.id}"]`)?.innerText?.trim() || '',
  group: node.closest('fieldset')?.innerText?.trim().slice(0, 500) || '',
})));

console.log(JSON.stringify(answers, null, 2));
process.exit(0);
