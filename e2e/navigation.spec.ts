import { expect, test } from '@playwright/test';
import { currentSearch } from './helpers';

const breadcrumbHome = (page: import('@playwright/test').Page) =>
  page
    .getByRole('navigation', { name: 'Breadcrumb' })
    .getByRole('link', { name: 'Home' });

test.describe('Listing ↔ detail navigation', () => {
  test('returning from a product keeps the filters and page', async ({ page }) => {
    await page.goto('/?categories=smartphones&minPrice=100&page=2');
    const start = currentSearch(page);

    await page.locator('main ul li a').first().click();
    await expect(page).toHaveURL(/\/product\/\d+$/);
    await expect(page.getByRole('heading', { name: 'Reviews' })).toBeVisible();

    await breadcrumbHome(page).click();
    await expect.poll(() => currentSearch(page)).toBe(start);
    await expect(
      page.getByRole('checkbox', { name: 'Smartphones', exact: true })
    ).toBeChecked();
  });

  test('the browser Back button also restores the filtered listing', async ({ page }) => {
    await page.goto('/?categories=laptops&sort=price-desc');
    await page.locator('main ul li a').first().click();
    await expect(page).toHaveURL(/\/product\//);
    await page.goBack();
    await expect
      .poll(() => currentSearch(page))
      .toBe('?categories=laptops&sort=price-desc');
  });

  test('a related product still returns to the original listing', async ({ page }) => {
    await page.goto('/?categories=smartphones&page=2');
    const start = currentSearch(page);
    await page.locator('main ul li a').first().click();
    const firstUrl = page.url();

    await page.locator('section[aria-labelledby="related-heading"] a').first().click();
    await expect(page).not.toHaveURL(firstUrl);

    await page.getByRole('link', { name: /reviews$/ }).click();
    expect(page.url()).not.toContain('#');

    await breadcrumbHome(page).click();
    await expect.poll(() => currentSearch(page)).toBe(start);
  });

  test('shows the product details from the API', async ({ page }) => {
    await page.goto('/product/7');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Chanel Coco Noir Eau De'
    );
    await expect(page.getByText('Brand:')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Description' })).toBeVisible();
    await expect(
      page.getByRole('list', { name: 'Customer reviews' }).getByRole('listitem')
    ).toHaveCount(3);
  });

  test('an unknown product shows "not found"', async ({ page }) => {
    await page.goto('/product/999999');
    await expect(page.getByText('We couldn’t find that product.')).toBeVisible();
  });
});
