/* eslint-disable */
import {test, expect, Route} from '@playwright/test';

const serviceURL = 'http://localhost:3000';

test('main flow', async ({ page }) => {
  await page.route('**/api/loan-calc?amount=*&period=*', async (route: Route) => {
    const request = route.request();
    if (route.request().method() === 'GET') {
      const percent = 12
      const url = new URL(request.url());
      const amount = url.searchParams.get('amount');
      const period = url.searchParams.get('period');
      const monthlyPayment = calculateMonthlyPayment(Number(amount), Number(period), percent);
      console.log(monthlyPayment);
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          "paymentAmountMonthly": monthlyPayment
        })
      })
    } else {
      await route.continue()
    }
  })
  await page.goto(serviceURL);
  await page.getByTestId('id-small-loan-calculator-field-apply').click();
  await page.getByTestId('login-popup-username-input').click();
  await page.getByTestId('login-popup-username-input').fill('usern');
  await page.getByTestId('login-popup-username-input').press('Tab');
  await page.getByTestId('login-popup-password-input').fill('pwd');
  await page.getByTestId('login-popup-continue-button').click();
  await page.getByTestId('final-page-continue-button').click();
  await page.getByTestId('final-page-success-ok-button').click();
});

test('redirect flow', async ({ page, request }) => {
  await page.goto(serviceURL);
  await page.getByTestId('id-image-element-button-image-1').click();
  await expect( page.getByTestId('id-small-loan-calculator-field-apply') ).toBeInViewport()
  await page.getByTestId('id-image-element-button-image-2').click();
  await expect( page.getByTestId('id-small-loan-calculator-field-apply') ).toBeInViewport()
})

function calculateMonthlyPayment(amount: number, period: number, annualPercent: number): number {
  const monthlyRate = annualPercent / 12 / 100;
  const payment = amount * (monthlyRate * Math.pow(1 + monthlyRate, period)) / (Math.pow(1 + monthlyRate, period) - 1);
  return Math.round(payment * 100) / 100; // округление до 2 знаков после запятой
}
