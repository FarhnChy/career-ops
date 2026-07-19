import { chromium } from 'playwright';

const action = process.argv[2];
const browser = await chromium.connectOverCDP('http://127.0.0.1:9223');
const context = browser.contexts()[0];
const page = context.pages().find((candidate) => candidate.url().includes('/apply/200663981-3810'))
  || context.pages().at(-1);

if (action === 'go-apply') {
  await page.goto('https://jobs.apple.com/en-us/details/200663981-3810/hardware-undergrad-engineering-internships', {
    waitUntil: 'domcontentloaded',
    timeout: 30_000,
  });
  await page.waitForTimeout(1_500);
  await page.getByText('Submit Resume', { exact: true }).first().click();
  await page.waitForTimeout(2_000);
}

if (action === 'replace-resume') {
  const remove = page.locator('#resume-remove');
  if (await remove.count()) {
    await remove.click();
    await page.waitForTimeout(800);
  }
  const input = page.locator('input[type="file"]').first();
  if (!await input.count()) throw new Error('Resume file input did not appear');
  await input.setInputFiles('output/cv-farhan-chowdhury-apple-hardware-2026-07-15.pdf');
  await page.waitForTimeout(2_500);
  console.log(`RESUME ${(await page.locator('body').innerText()).includes('cv-farhan-chowdhury-apple-hardware-2026-07-15.pdf')}`);
}

if (action === 'continue') {
  await page.locator('#apply-step-continue-button').click();
  await page.waitForTimeout(2_000);
}

if (action === 'fill-known-profile') {
  await page.locator('#profile-field-line1').fill('');
  await page.locator('#profile-field-city').fill('Brooklyn');
  await page.locator('#profile-field-state').fill('NY');

  const school = page.locator('#parsedmodal-school-0-suggestion-textbox');
  await school.fill('Stony Brook University');
  await page.waitForTimeout(1_200);
  await school.press('ArrowDown');
  await school.press('Enter');

  await page.locator('#parsedmodal-job-description-1').fill(
    'Developed an automated email writer in Python that is currently used by the business, improving business efficiency and customer communication. Managed and wrote estimates, invoices, and contracts, ensuring accurate communication with clients. Served as the primary point of communication between clients and the company, handling communications to support smooth project execution.',
  );
  await page.locator('#resumeFeedBack-INACC').check({ force: true });
  await page.waitForTimeout(700);
}

if (action === 'fill-zip') {
  await page.locator('#profile-field-zip').fill('11232');
  await page.waitForTimeout(400);
}

if (action === 'feedback-accurate') {
  await page.locator('#resumeFeedBack-MIC').check({ force: true });
  await page.waitForTimeout(400);
}

if (action === 'fill-known-questions') {
  await page.locator('#answer-204737').check({ force: true });
  await page.locator('#answer-204740').check({ force: true });
  await page.locator('#answer-204701').check({ force: true });
  await page.waitForTimeout(400);
}

if (action === 'fill-all-questions') {
  const answerIds = [
    '#answer-204731', // 18 or older: Yes
    '#answer-204734', // Apple employee: No
    '#answer-204736', // Apple agency/consultant/contractor: No
    '#answer-204737', // U.S. work authorization: Yes
    '#answer-204740', // Sponsorship required: No
    '#answer-204701', // Return to degree program: Yes
    '#answer-204706', // Summer 2027
    '#answer-204707', // 3-4 months
  ];
  for (const id of answerIds) await page.locator(id).check({ force: true });
  await page.waitForTimeout(500);
}

console.log(`URL ${page.url()}`);
console.log(`BODY\n${(await page.locator('body').innerText()).slice(0, 12_000)}`);
process.exit(0);
