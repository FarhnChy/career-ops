import { chromium } from 'playwright';

const browser = await chromium.connectOverCDP('http://127.0.0.1:9223');
const context = browser.contexts()[0];
const page = context.pages().find((candidate) => candidate.url().includes('/apply/200663981-3810'))
  || context.pages().at(-1);

const fields = await page.locator('input, select, textarea').evaluateAll((nodes) => nodes
  .filter((node) => node.type !== 'hidden' && node.type !== 'file')
  .map((node) => ({
    tag: node.tagName,
    type: node.type,
    id: node.id,
    value: node.value,
    required: node.required,
    checked: node.checked,
    disabled: node.disabled,
  })));

console.log(JSON.stringify(fields, null, 2));
process.exit(0);
