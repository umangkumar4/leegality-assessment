import { expect, test } from '@playwright/test';

test.describe('Product image gallery', () => {
  test('thumbnails switch the main image', async ({ page }) => {
    await page.goto('/product/7');
    const main = page.getByTestId('gallery-main-image');
    const first = await main.getAttribute('src');

    await page.getByRole('button', { name: 'Show image 2' }).hover();
    await expect(main).not.toHaveAttribute('src', first ?? '');
    await expect(main).toHaveAttribute('alt', /image 2 of 3/);
  });

  test('hovering the image shows the zoom pane', async ({ page }) => {
    await page.goto('/product/7');
    const box = (await page.getByTestId('gallery-main-image').boundingBox())!;
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 3);
    await expect(page.locator('div[aria-hidden="true"].shadow-2xl')).toBeVisible();
  });

  test('full view opens, navigates with arrow keys and closes with Escape', async ({
    page,
  }) => {
    await page.goto('/product/7');
    await page.getByRole('button', { name: 'Open full view' }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toContainText('1 / 3');
    await page.keyboard.press('ArrowRight');
    await expect(dialog).toContainText('2 / 3');
    await page.keyboard.press('Escape');
    await expect(dialog).toHaveCount(0);
  });

  test('a single-image product has no thumbnails', async ({ page }) => {
    await page.goto('/product/1');
    await expect(page.getByTestId('gallery-main-image')).toBeVisible();
    await expect(page.getByRole('list', { name: 'Image thumbnails' })).toHaveCount(0);
  });
});
