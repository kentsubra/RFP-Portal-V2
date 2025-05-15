import { describe, it, expect } from 'vitest';

describe('Test environment', () => {
  it('should have NODE_ENV set to test', () => {
    expect(process.env.NODE_ENV).toBe('test');
  });
}); 