import {test,expect} from '@playwright/test';
test.beforeEach(async({page})=>{
  await page.addInitScript(()=>{try{Object.defineProperty(window,'speechSynthesis',{configurable:true,value:{getVoices:()=>[],cancel(){},addEventListener(){}}});}catch{}});
  await page.goto('/');
  await page.locator('#entry-code').fill('french101');
  await page.locator('#entry-code').press('Enter');
});
test('dashboard and course are responsive and error free',async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await expect(page.getByRole('heading',{name:'Today'})).toBeVisible();
  await expect(page.locator('.hero')).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBeTruthy();
  await page.goto('/#course');
  await expect(page.locator('.unit-card')).toHaveCount(12);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBeTruthy();
  expect(errors).toEqual([]);
});
test('typed answer saves once, reloads, and restores progress',async({page})=>{
  await page.locator('[data-action="start:daily"]').first().click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.locator('#answer-input').fill('Je m’appelle Léa.');
  await page.locator('#answer-input').press('Enter');
  await expect(page.locator('.answer-feedback')).toContainText('Correct.');
  await expect(page.locator('.feedback-xp')).toContainText('+15 XP');
  expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('elan.french.v1')).records['introductions-01'].seen)).toBe(1);
  await page.reload();
  await expect(page.locator('.xp-pill')).toContainText('15 XP');
});
test('hinted success is assisted and goes to the notebook',async({page})=>{
  await page.locator('[data-action="start:daily"]').first().click();
  await page.locator('[data-action="show-hint"]').click();
  await page.locator('#answer-input').fill('Je m’appelle Léa.');
  await page.locator('#answer-input').press('Enter');
  await expect(page.locator('.answer-feedback')).toContainText('Assisted answer');
  expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('elan.french.v1')).records['introductions-01'].lastGrade)).toBe(1);
  await page.reload();await page.goto('/#notebook');
  await expect(page.locator('.mistake-card')).toHaveCount(1);
});
test('dictation has an explicit no-audio fallback',async({page})=>{
  await page.locator('[data-action="start:daily"]').first().click();
  await page.locator('#answer-input').fill('Je m’appelle Léa.');await page.locator('#answer-input').press('Enter');await page.locator('[data-action="next-exercise"]').click();
  await page.locator('#answer-input').fill('incorrect');await page.locator('#answer-input').press('Enter');await page.locator('[data-action="next-exercise"]').click();
  await expect(page.locator('.audio-prompt')).toBeVisible();
  await expect(page.locator('#answer-form button[type=submit]')).toBeDisabled();
  await page.locator('[data-action="reveal-audio"]').click();
  await expect(page.locator('.reading-passage')).toBeVisible();
  await expect(page.locator('#answer-form button[type=submit]')).toBeEnabled();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBeTruthy();
});
test('settings, review, method, and progress are usable',async({page})=>{
  for(const route of ['settings','review','method','progress','notebook']){await page.goto('/#'+route);await expect(page.locator('main h1')).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBeTruthy();}
  await page.goto('/#settings');await page.locator('[data-action="goal:15"]').click();
  await expect(page.locator('[data-action="goal:15"]')).toHaveAttribute('aria-pressed','true');
  await page.reload();await expect(page.locator('[data-action="goal:15"]')).toHaveAttribute('aria-pressed','true');
});
