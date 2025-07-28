import {Locator, Page} from "@playwright/test";

export class LoanResultPage {
    readonly page: Page;
    readonly finalAmount: Locator;
    readonly finalPeriod: Locator;
    readonly finalMonthlyPayment: Locator;

    constructor(page: Page) {
        this.page = page;
        this.finalAmount = page.getByTestId("final-page-amount");
        this.finalPeriod = page.getByTestId("final-page-period");
        this.finalMonthlyPayment = page.getByTestId("final-page-monthly-payment");
    }
}