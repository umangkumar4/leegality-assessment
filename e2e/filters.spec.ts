import { expect, test } from '@playwright/test';
import {
  checkbox,
  collectAllTitles,
  currentSearch,
  expectedTitles,
  fetchAllProducts,
  setChecked,
} from './helpers';

test.describe('Listing filters', () => {
  test('every filter combines correctly with the others', async ({ page }) => {
    const all = await fetchAllProducts();
    await page.goto('/');

    await setChecked(checkbox(page, 'Smartphones'), true);
    expect(await collectAllTitles(page)).toEqual(
      expectedTitles(all, { categories: ['smartphones'] })
    );

    await setChecked(checkbox(page, 'Laptops'), true);
    const cats = ['smartphones', 'laptops'];
    expect(await collectAllTitles(page)).toEqual(
      expectedTitles(all, { categories: cats })
    );

    await page.getByPlaceholder('Min').fill('500');
    await page.getByPlaceholder('Max').fill('1500');
    await page.getByRole('button', { name: 'Apply' }).click();
    await expect(page).toHaveURL(/maxPrice=1500/);
    expect(await collectAllTitles(page)).toEqual(
      expectedTitles(all, { categories: cats, min: 500, max: 1500 })
    );

    await setChecked(checkbox(page, 'Apple'), true);
    await setChecked(checkbox(page, 'Samsung'), true);
    expect(await collectAllTitles(page)).toEqual(
      expectedTitles(all, {
        categories: cats,
        min: 500,
        max: 1500,
        brands: ['Apple', 'Samsung'],
      })
    );

    await page.getByPlaceholder('Search products...').fill('pro');
    await expect(page).toHaveURL(/q=pro/);
    expect(await collectAllTitles(page)).toEqual(
      expectedTitles(all, {
        q: 'pro',
        categories: cats,
        min: 500,
        max: 1500,
        brands: ['Apple', 'Samsung'],
      })
    );
  });

  test('changing a filter resets pagination to page 1', async ({ page }) => {
    await page.goto('/?categories=smartphones');
    await page.getByRole('button', { name: '2', exact: true }).click();
    await expect(page).toHaveURL(/page=2/);

    await setChecked(checkbox(page, 'Oppo'), true);
    await expect(page).not.toHaveURL(/page=/);
  });

  test('a selected brand is dropped when its category is removed', async ({ page }) => {
    await page.goto('/?categories=smartphones,laptops&brands=Oppo');
    await setChecked(checkbox(page, 'Smartphones'), false);
    await expect.poll(() => currentSearch(page)).toBe('?categories=laptops');
  });

  test('filters survive a page refresh', async ({ page }) => {
    await page.goto('/?categories=beauty&maxPrice=20&sort=price-asc');
    await page.reload();
    await expect(checkbox(page, 'Beauty')).toBeChecked();
    await expect(page.getByPlaceholder('Max')).toHaveValue('20');
    await expect(page.getByLabel('Sort products')).toHaveValue('price-asc');
  });

  test('chips remove individual filters and "Clear all" keeps the sort', async ({
    page,
  }) => {
    await page.goto(
      '/?categories=smartphones,laptops&brands=Apple&minPrice=100&sort=rating'
    );
    await page.getByRole('button', { name: 'Remove category filter Laptops' }).click();
    await expect.poll(() => currentSearch(page)).not.toContain('laptops');

    await page.getByRole('button', { name: 'Clear all', exact: true }).first().click();
    await expect.poll(() => currentSearch(page)).toBe('?sort=rating');
  });

  test('sorting orders results and is stored in the URL', async ({ page }) => {
    await page.goto('/?categories=laptops');
    await page.getByLabel('Sort products').selectOption('price-asc');
    await expect(page).toHaveURL(/sort=price-asc/);
    await expect(page.getByTestId('product-price').first()).toBeVisible();

    const prices = await page
      .locator('main ul li a')
      .evaluateAll((cards) =>
        cards.map((c) =>
          Number(
            c
              .querySelector('[data-testid="product-price"]')
              ?.textContent?.replace(/[$,]/g, '')
          )
        )
      );
    expect(prices.length).toBeGreaterThan(1);
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test('shows an empty state that clears everything', async ({ page }) => {
    await page.goto('/?q=zzzzzz');
    await expect(page.getByText('No products match your filters')).toBeVisible();
    await page.getByRole('button', { name: 'Clear all filters' }).click();
    await expect.poll(() => currentSearch(page)).toBe('');
    await expect(page.getByText(/^194$/)).toBeVisible();
  });
});
