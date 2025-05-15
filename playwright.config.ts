import { defineConfig, devices } from '@playwright/test';

/**
 * See https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  /* Increase timeout for more reliability */
  timeout: 120000,
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry tests for better reliability */
  retries: 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [['html'], ['line']],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:3000',
    /* Take screenshots on failure */
    screenshot: 'only-on-failure',
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    /* Increase all timeouts for more reliability */
    navigationTimeout: 90000,
    actionTimeout: 60000,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  /* Temporarily disable web server for test file validation */
  /* Run your local dev server before starting the tests 
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 90000,
    stdout: 'pipe',
    stderr: 'pipe',
  },
  */
}); 