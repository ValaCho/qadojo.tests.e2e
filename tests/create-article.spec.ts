import { test, expect, Page } from 'playwright/test';

export async function login(
  page: Page,
  email: string,
  password: string
) {
    const signInButton = page.locator('[data-testid="nav-sign-in"]')
    const emailField = page.locator('[data-testid="auth-email"]')
    const passwordField = page.locator('[data-testid="auth-password"]')
    const signInSubmit = page.locator('[data-testid="auth-submit"]')
    const newArticleButton = page.locator('[data-testid="nav-new-article"]')
    
    await page.goto('/articles');
    await expect(signInButton).toBeVisible();
    await signInButton.click();
    await emailField.fill(email);
    await passwordField.fill(password);
    await signInSubmit.click();
    await expect(newArticleButton).toBeVisible();
}

export async function createArticle(
    page: Page,
    title: string,
    description: string,
    body: string
) {
    const newArticleButton = page.locator('[data-testid="nav-new-article"]')
    const titleInput = page.locator('[data-testid="editor-title"]')
    const descriptionInput = page.locator('[data-testid="editor-description"]')
    const bodyInput = page.locator('[data-testid="editor-body"]')
    const publishButton = page.locator('[data-testid="editor-submit"]')
    const createdArticle = page.locator('[data-testid="article-title"]')

    await newArticleButton.click();
    await expect(titleInput).toBeVisible();
    await titleInput.fill(title);
    await descriptionInput.fill(description);
    await bodyInput.fill(body);
    await publishButton.click();
    await expect(createdArticle).toBeVisible()
    await expect(createdArticle).toHaveText(title);
}

export async function verifyArticles(
  page: Page,
  articleTitles: string[]
) {
  const homeButton = page.locator('[data-testid="nav-home"]');
  const globalFeedButton = page.locator('[data-testid="feed-tab-global"]');

  await homeButton.click();
  await globalFeedButton.click();

  const foundTitles = new Set<string>();

  for (let pageNumber = 1; ; pageNumber++) {
    const pageButton = page.locator(
      `[data-testid="pagination-page-${pageNumber}"]`
    );

    if (pageNumber > 1) {
      if (await pageButton.count() === 0) {
        break;
      }

      await pageButton.click();
    }

    for (const title of articleTitles) {
      const article = page.getByText(title, { exact: true });

      if (await article.isVisible().catch(() => false)) {
        foundTitles.add(title);
      }
    }

    if (foundTitles.size === articleTitles.length) {
      break;
    }
  }
}

test ('create 10 articles', async ({ page }) => {
    const datetime = new Date().toISOString().replace(/[-:.TZ]/g, '');
    const articleTitles: string[] = [];
    const articleDescription = 'this is an article description';
    const articleBody = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut accumsan consequat mi, ornare dolor sagittis quis';

    for (let i = 0; i < 10; i++) {
        articleTitles.push(`Article ${datetime} ${i}`);
    }

    await login(page, 'olena@example.com', 'password');
    for (const title of articleTitles) {
        await createArticle(page, title, articleDescription, articleBody)
    }

    await verifyArticles(page, articleTitles);
});
