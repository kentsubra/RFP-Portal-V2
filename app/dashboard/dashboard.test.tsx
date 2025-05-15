import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Dashboard from './page';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

// Mock next-auth
vi.mock('next-auth', () => ({
  getServerSession: vi.fn(() => Promise.resolve({
    user: { name: 'Test User', email: 'test@example.com', id: '123' },
  })),
}));

describe('Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the dashboard when user is authenticated', async () => {
    // We need to render async component
    const Component = await Dashboard();
    render(Component);
    
    // Basic assertion
    expect(screen.getByText('RFP Portal Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Active RFPs')).toBeInTheDocument();
  });
}); 