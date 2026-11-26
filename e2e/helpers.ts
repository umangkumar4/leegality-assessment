import { expect, type Locator, type Page } from '@playwright/test';

export interface ApiProduct {
  id: number;
  title: string;
  category: string;
  price: number;
  rating: number;
  brand?: string;
}

let cache: ApiProduct[] | undefined;

export async function fetchAllProducts(): Promise<ApiProduct[]> {
  if (!cache) {
    const res = await fetch(
      'https://dummyjson.com/products?limit=0&select=title,category,price,rating,brand'
    );
    cache = ((await res.json()) as { products: ApiProduct[] }).products;
  }
  return cache;
}

export interface Criteria {
  q?: string;
  categories?: string[];
  min?: number;
  max?: number;
  brands?: string[];
}

export function expectedTitles(all: ApiProduct[], c: Criteria): string[] {
  const q = c.q?.toLowerCase() ?? '';
  return all
    .filter(
      (p) =>
        (!c.categories?.length || c.categories.includes(p.category)) &&
        (c.min === undefined || p.price >= c.min) &&
        (c.max === undefined || p.price <= c.max) &&
        (!c.brands?.length || (p.brand !== undefined && c.brands.includes(p.brand))) &&
        (!q ||
          p.title.toLowerCase().includes(q) ||
          (p.brand ?? '').toLowerCase().includes(q))
    )
    .map((p) => p.title)
    .sort();
}

export const productCards = (page: Page) => page.locator('main ul li a h3');

export async function collectAllTitles(page: Page): Promise<string[]> {
  await expect(page.getByLabel('Loading products')).toHaveCount(0);
  const titles: string[] = [];
  for (;;) {
    await expect(productCards(page).first()).toBeVisible();
    titles.push(...(await productCards(page).allTextContents()));
    const next = page.getByRole('button', { name: /Next/ });
    if ((await next.count()) === 0 || (await next.isDisabled())) break;
    const firstTitle = await productCards(page).first().textContent();
    await next.click();
    await expect(productCards(page).first()).not.toHaveText(firstTitle ?? '');
  }
  const pageOne = page.getByRole('button', { name: '1', exact: true });
  if (await pageOne.count()) await pageOne.click();
  return titles.sort();
}

export async function setChecked(box: Locator, checked: boolean) {
  if ((await box.isChecked()) !== checked) await box.click();
  await expect(box).toBeChecked({ checked });
}

export const checkbox = (page: Page, name: string) =>
  page.getByRole('checkbox', { name, exact: true });

export const currentSearch = (page: Page) =>
  decodeURIComponent(new URL(page.url()).search);
