import {Locator, Page} from "@playwright/test";
import {SERVICE_URL, TEST_PASSWORD, TEST_USERNAME} from "../../config/env-data";

export class LoanPage {
    readonly url = SERVICE_URL
    readonly username = TEST_USERNAME
    readonly password = TEST_PASSWORD
    readonly page: Page;
    readonly applyButton: Locator;
    readonly amountInput: Locator;
    readonly amountInputRange: Locator;
    readonly periodSelect: Locator;
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly continueButton: Locator;
    readonly monthlyAmountText: Locator;
    readonly appyLoanButton2: Locator;

    constructor(page: Page) {
        this.page = page;
        this.applyButton = page.getByTestId('id-small-loan-calculator-field-apply')
        this.amountInput = page.getByTestId('id-small-loan-calculator-field-amount')
        this.amountInputRange = page.getByTestId('id-small-loan-calculator-field-amount-slider')
        this.periodSelect = page.getByTestId('ib-small-loan-calculator-field-period')
        this.usernameInput = page.getByTestId('login-popup-username-input');
        this.passwordInput = page.getByTestId('login-popup-password-input');
        this.monthlyAmountText = page.getByTestId("ib-small-loan-calculator-field-monthlyPayment");
        this.continueButton = page.getByTestId('login-popup-continue-button');
        this.appyLoanButton2 = page.getByTestId('id-image-element-button-image-2')
    }

    async openLoanPage() {
        await this.page.goto(this.url)
    }

    async setPeriodOption(positionInOptionList: string) {
        await this.periodSelect.selectOption(positionInOptionList);
    }

    async login() {
        await this.usernameInput.fill(this.username)
        await this.passwordInput.fill(this.password)
        await this.continueButton.click()
    }
}