import { test, expect } from '@playwright/test';

test.describe('Opportunity Drawer', () => {
  test('should edit an opportunity and show success toast', async ({ page }) => {
    await page.setViewportSize({ width: 1600, height: 900 });
    await page.goto('/opportunities');
    await page.waitForLoadState('networkidle');

    const firstOpportunityCard = page.locator('.border.rounded-lg').first();
    const originalName = await firstOpportunityCard.locator('h3.font-medium').textContent() || '';
    await firstOpportunityCard.click();
    await page.waitForSelector('[role="dialog"]', { state: 'visible' });
    const drawer = page.locator('[role="dialog"]');
    await expect(drawer.getByText('Opportunity Details')).toBeVisible();

    const editBtn = page.getByRole('button', { name: 'Edit' });
    await editBtn.scrollIntoViewIfNeeded();
    await expect(editBtn).toBeVisible({ timeout: 3_000 });
    await editBtn.click();
    await page.waitForSelector('[role="dialog"]', { state: 'visible' });
    await expect(drawer.getByText('Edit Opportunity')).toBeVisible();

    const newName = `Updated Opportunity ${Date.now()}`;
    const nameInput = page.getByLabel('Name');
    await nameInput.clear();
    await nameInput.fill(newName);

    const saveBtn = page.getByRole('button', { name: /save changes/i });
    await saveBtn.scrollIntoViewIfNeeded();
    await expect(saveBtn).toBeVisible({ timeout: 3_000 });
    await page.screenshot({ path: 'playwright-debug-edit.png', fullPage: true });
    await saveBtn.click();
    // Wait for the drawer to close first
    await expect(drawer.getByText('Opportunity Details')).toBeHidden();
    // Now assert the toast in the Sonner container
    const toast = page.locator('[aria-live="polite"] >> text=/updated successfully/i');
    await expect(toast).toBeVisible({ timeout: 10000 });
    // Optionally, wait for the toast to disappear (if you want to test its lifecycle)
    // await expect(toast).toBeHidden({ timeout: 10000 });

    const updatedCard = page.locator('.border.rounded-lg').filter({ hasText: newName }).first();
    await expect(updatedCard).toBeVisible();
    await updatedCard.click();
    await expect(drawer.getByText('Opportunity Details')).toBeVisible();
    await expect(drawer.getByText(newName)).toBeVisible();
  });

  test('should validate required fields on save', async ({ page }) => {
    await page.setViewportSize({ width: 1600, height: 900 });
    await page.goto('/opportunities');
    await page.waitForLoadState('networkidle');
    await page.locator('.border.rounded-lg').first().click();
    await page.waitForSelector('[role="dialog"]', { state: 'visible' });
    const drawer = page.locator('[role="dialog"]');

    const editBtn = page.getByRole('button', { name: 'Edit' });
    await editBtn.scrollIntoViewIfNeeded();
    await expect(editBtn).toBeVisible({ timeout: 3_000 });
    await editBtn.click();
    await page.waitForSelector('[role="dialog"]', { state: 'visible' });

    const nameInput = page.getByLabel('Name');
    await nameInput.clear();

    const saveBtn = page.getByRole('button', { name: /save changes/i });
    await saveBtn.scrollIntoViewIfNeeded();
    await expect(saveBtn).toBeVisible({ timeout: 3_000 });
    await page.screenshot({ path: 'playwright-debug-validate.png', fullPage: true });
    await saveBtn.click();

    await expect(drawer.getByText('Name is required')).toBeVisible();
    await expect(drawer.getByText('Edit Opportunity')).toBeVisible();
  });

  test('should cancel edit and return to read mode', async ({ page }) => {
    await page.setViewportSize({ width: 1600, height: 900 });
    await page.goto('/opportunities');
    await page.waitForLoadState('networkidle');
    const firstOpportunityCard = page.locator('.border.rounded-lg').first();
    const originalName = await firstOpportunityCard.locator('h3.font-medium').textContent() || '';
    await firstOpportunityCard.click();
    await page.waitForSelector('[role="dialog"]', { state: 'visible' });
    const drawer = page.locator('[role="dialog"]');

    const editBtn = page.getByRole('button', { name: 'Edit' });
    await editBtn.scrollIntoViewIfNeeded();
    await expect(editBtn).toBeVisible({ timeout: 3_000 });
    await editBtn.click();
    await page.waitForSelector('[role="dialog"]', { state: 'visible' });

    const nameInput = page.getByLabel('Name');
    await nameInput.clear();
    await nameInput.fill('Temporary change');

    const cancelBtn = page.getByRole('button', { name: /cancel/i });
    await cancelBtn.scrollIntoViewIfNeeded();
    await expect(cancelBtn).toBeVisible({ timeout: 3_000 });
    await page.screenshot({ path: 'playwright-debug-cancel.png', fullPage: true });
    await cancelBtn.click();

    await expect(drawer.getByText('Opportunity Details')).toBeVisible();
    await expect(drawer.getByText(originalName)).toBeVisible();
  });
}); 