import { expect, test } from '@playwright/test';

test.describe('Mobile', () => {
  test('filters open in a drawer that shows the result count', async ({ page }) => {
    await page.goto('/?categories=smartphones');
    await page.getByRole('button', { name: /^Filters/ }).click();
    const drawer = page.getByRole('dialog', { name: 'Filters' });
    await expect(drawer).toBeVisible();
    await expect(drawer.getByRole('button', { name: 'Show 16 results' })).toBeVisible();

    await drawer.getByRole('checkbox', { name: 'Apple', exact: true }).click();
    await expect(drawer.getByRole('button', { name: 'Show 4 results' })).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(drawer).toHaveCount(0);
  });

  test('the page never scrolls sideways', async ({ page }) => {
    for (const path of ['/', '/?categories=smartphones&brands=Apple', '/product/7']) {
      await page.goto(path);
      await page.waitForLoadState('networkidle');
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth
      );
      expect(overflow, path).toBeLessThanOrEqual(0);
    }
  });

  test('image carousel dots update the counter', async ({ page }) => {
    await page.goto('/product/7');
    await page.getByRole('tab', { name: 'Image 3' }).click();
    await expect(page.getByText('3 / 3')).toBeVisible();
  });
});
