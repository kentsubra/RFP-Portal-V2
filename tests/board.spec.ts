import { test, expect } from '@playwright/test';

const OPPORTUNITY_NAME = "Enterprise CRM Implementation";

test.describe('Opportunity Board', () => {
  test.beforeEach(async ({ page, request }) => {
    page.on('console', msg => {
      console.log('BROWSER LOG:', msg.type(), msg.text());
    });
    await request.post('/api/opportunities/reset');
  });

  test('should display opportunities in correct columns', async ({ page }) => {
    await page.goto('/opportunities');
    await expect(page.getByRole('heading', { name: 'Opportunity Board' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'New' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Sizing' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Drafting' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Review' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Submitted' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Won/Lost' })).toBeVisible();
    const newColumn = page.locator('[data-testid="column-New"]');
    await expect(newColumn).toContainText(OPPORTUNITY_NAME);
  });

  test('should move opportunity to Review and show internal deadline', async ({ page }) => {
    await page.goto('/opportunities');
    await expect(page.getByRole('heading', { name: 'Opportunity Board' })).toBeVisible();
    
    // Wait for the opportunity to be in the New column
    const newColumn = page.locator('[data-testid="column-New"]');
    await expect(newColumn).toContainText(OPPORTUNITY_NAME, { timeout: 5000 });
    
    // Move to Review and wait for the status update to complete
    const card = newColumn.locator('.border.rounded-lg').filter({ hasText: OPPORTUNITY_NAME }).first();
    await Promise.all([
      // Wait for the status update to complete
      page.waitForResponse(response => 
        response.url().includes('/api/opportunities/') && 
        response.status() === 200
      ),
      // Change the status
      card.locator('select[aria-label="Status"]').selectOption({ label: 'Review' })
    ]);
    
    // Wait for card in Review column
    const reviewColumn = page.locator('[data-testid="column-Review"]');
    await expect(reviewColumn).toContainText(OPPORTUNITY_NAME, { timeout: 5000 });
    
    // Wait for drawer to open and check internal deadline
    const drawer = page.locator('[role="dialog"], [data-testid="opportunity-drawer"]');
    await expect(drawer).toBeVisible({ timeout: 5000 });
    await expect(drawer).toContainText('Internal deadline:', { timeout: 5000 });
  });

  test('should move opportunity back to Sizing', async ({ page }) => {
    await page.goto('/opportunities');
    await expect(page.getByRole('heading', { name: 'Opportunity Board' })).toBeVisible();
    
    // Wait for the opportunity to be in the New column
    const newColumn = page.locator('[data-testid="column-New"]');
    await expect(newColumn).toContainText(OPPORTUNITY_NAME, { timeout: 5000 });
    
    // Move to Review first (setup) and wait for the status update
    const card = newColumn.locator('.border.rounded-lg').filter({ hasText: OPPORTUNITY_NAME }).first();
    await Promise.all([
      // Wait for the status update to complete
      page.waitForResponse(response => 
        response.url().includes('/api/opportunities/') && 
        response.status() === 200
      ),
      // Change the status
      card.locator('select[aria-label="Status"]').selectOption({ label: 'Review' })
    ]);
    
    // Wait for card in Review column
    const reviewColumn = page.locator('[data-testid="column-Review"]');
    await expect(reviewColumn).toContainText(OPPORTUNITY_NAME, { timeout: 5000 });
    
    // Move back to Sizing and wait for the status update
    const reviewCard = reviewColumn.locator('.border.rounded-lg').filter({ hasText: OPPORTUNITY_NAME }).first();
    await Promise.all([
      // Wait for the status update to complete
      page.waitForResponse(response => 
        response.url().includes('/api/opportunities/') && 
        response.status() === 200
      ),
      // Change the status
      reviewCard.locator('select[aria-label="Status"]').selectOption({ label: 'Sizing' })
    ]);
    
    // Wait for card in Sizing column
    const sizingColumn = page.locator('[data-testid="column-Sizing"]');
    await expect(sizingColumn).toContainText(OPPORTUNITY_NAME, { timeout: 5000 });
  });

  test('should display a toast when Show Toast button is clicked', async ({ page }) => {
    await page.goto('/opportunities');
    await page.getByRole('button', { name: 'Show Toast' }).click();
    await expect(page.locator('[aria-live="polite"]')).toContainText('Test Toast', { timeout: 5000 });
  });
}); 