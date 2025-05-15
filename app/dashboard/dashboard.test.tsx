import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Dashboard from './page';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

// Mock next-auth
vi.mock('next-auth', () => ({
  getServerSession: vi.fn(),
}));

describe('Dashboard', () => {
  it('renders the dashboard when user is authenticated', async () => {
    // Mock authenticated session
    const mockSession = {
      user: { name: 'Test User', email: 'test@example.com', id: '123' },
    };
    
    vi.mocked(await import('next-auth')).getServerSession.mockResolvedValue(mockSession);
    
    // We need to render async component
    const Component = await Dashboard();
    render(Component);
    
    // Basic assertion
    expect(screen.getByText('RFP Portal Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Active RFPs')).toBeInTheDocument();
  });
}); 