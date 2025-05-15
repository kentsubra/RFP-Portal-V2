import { expect, afterEach } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';
import { cleanup } from '@testing-library/react';

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);

// Clean up after each test
afterEach(() => {
  cleanup();
});

// No setup needed for basic schema testing 

// Configure any additional test setup here 