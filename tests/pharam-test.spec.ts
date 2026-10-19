import { test, expect, Page } from '@playwright/test';

const contactFormData = [
    {
        id: 1,
        fill: {
            name: 'Val',
            email: 'val@example.com',
            message: 'This test fills all fileds in the form'
        },
        priority: async function (page: Page) {
            await page.locator('[data-testid="contact-priority-high"]').click()
        },
        sendCopy: async function (page: Page) {
            await page.locator('[data-testid="contact-copy-me"]').click()
        },
        submitMessage: async function (page: Page) {
            await page.locator('[data-testid="contact-success"]').isVisible()
        }
    },
    {
        id: 2,
        fill: {
            name: 'Val',
            email: 'val@example.com',
            message: 'This test fills only required fileds in the form'
        },
        submitMessage: async function (page: Page) {
            await page.locator('[data-testid="contact-success"]').isVisible()
        }
    },
    {
        id: 3,
        priority: async function (page: Page) {
            await page.locator('[data-testid="contact-priority-low"]').click()
        },
        sendCopy: async function (page: Page) {
            await page.locator('[data-testid="contact-copy-me"]').click()
        },
        submitMessage: async function (page: Page) {
            await page.locator('[data-testid="error-messages"]').isVisible()
        }
    }
]

for (const data of contactFormData) {
    test(`Contact form ${data.id}`, async ({ page }) => {
        const contactForm = page.locator('[data-testid="contact-form"]')
        const submitForm = page.locator('[data-testid="contact-submit"]')
        const fieldLocators: Record<string, string> = {
            name: '[data-testid="contact-name"]',
            email: '[data-testid="contact-email"]',
            message: '[data-testid="contact-message"]'
        };

        await page.goto('/articles/contact');
        await contactForm.isVisible();

        if (data.fill) {
            for (const key in data.fill) {
                await page.locator(fieldLocators[key])
                    .fill(data.fill[key as keyof typeof data.fill]);
            }
        };

        if (data.priority) {
            await data.priority(page)
        }

        if (data.sendCopy) {
            await data.sendCopy(page)
        }

        await submitForm.click();
        await data.submitMessage(page);
    });
}
