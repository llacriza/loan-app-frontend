import {expect, Route, test} from '@playwright/test';
import {LoanPage} from "./pages/loan-page";
import {LoanResultPage} from "./pages/loanresult-page";

let loanPage: LoanPage

test.beforeEach(async ({page}) => {
    loanPage = new LoanPage(page);
    loanPage.openLoanPage()
})

test('Base elements is visible', async ({}) => {
    await expect.soft(loanPage.amountInput).toBeVisible()
    await expect.soft(loanPage.periodSelect).toBeVisible()
    await expect.soft(loanPage.applyButton).toBeVisible()
});

test('Get base loan with login', async ({page}) => {
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
    await loanPage.amountInput.fill('1000')
    await loanPage.setPeriodOption('24')
    await loanPage.monthlyAmountText.waitFor({state: 'visible', timeout: 5000});
    await loanPage.applyButton.click()
    await loanPage.login()
    const loanResultPage = new LoanResultPage(page)
    const loanMonthlyPaymentText = await loanResultPage.finalMonthlyPayment.textContent()
    expect.soft(loanMonthlyPaymentText).toBe('47.07 €')
});

test('Scroll and viewport visible elements', async ({}) => {
    await loanPage.appyLoanButton2.scrollIntoViewIfNeeded()
    await expect.soft(loanPage.appyLoanButton2).toBeInViewport()
});

test('Scroll range amount', async ({page}) => {
    await loanPage.amountInputRange.fill('1900')
    await loanPage.setPeriodOption('24')
    await loanPage.monthlyAmountText.waitFor({state: 'visible', timeout: 5000});
    await loanPage.applyButton.click()
    await loanPage.login()
    const loanResultPage = new LoanResultPage(page)
    const loanMonthlyPaymentText = await loanResultPage.finalMonthlyPayment.textContent()
    expect.soft(loanMonthlyPaymentText).toBe('83.36 €')
});

function calculateMonthlyPayment(amount: number, period: number, annualPercent: number): number {
    const monthlyRate = annualPercent / 12 / 100;
    const payment = amount * (monthlyRate * Math.pow(1 + monthlyRate, period)) / (Math.pow(1 + monthlyRate, period) - 1);
    return Math.round(payment * 100) / 100; // округление до 2 знаков после запятой
}