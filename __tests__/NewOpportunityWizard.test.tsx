import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import NewOpportunityWizard from '../components/opportunity/NewOpportunityWizard';
import { useSession } from 'next-auth/react';

// Mock next-auth
vi.mock('next-auth/react', () => ({
  useSession: vi.fn(),
}));

// Mock the useOpportunityActions hook
vi.mock('../lib/hooks/useOpportunityActions', () => ({
  useOpportunityActions: () => ({
    createOpportunity: vi.fn().mockResolvedValue({ success: true }),
  }),
}));

// Mock toast
vi.mock('../components/ui/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

describe('NewOpportunityWizard', () => {
  beforeEach(() => {
    // Mock authenticated session
    vi.mocked(useSession).mockReturnValue({
      data: {
        user: { 
          id: 'user123', 
          name: 'Test User', 
          email: 'test@example.com' 
        },
        expires: '2023-01-01',
      },
      status: 'authenticated',
      update: vi.fn(),
    });
  });

  it('renders the wizard with the first step initially', () => {
    render(<NewOpportunityWizard isOpen={true} onClose={() => {}} />);
    
    // Check that the dialog title appears
    expect(screen.getByText('New Opportunity')).toBeInTheDocument();
  });

  it('has tab navigation', () => {
    render(<NewOpportunityWizard isOpen={true} onClose={() => {}} />);
    
    // Check tab buttons are present
    expect(screen.getByRole('tab', { name: 'Client Details' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'RFP Links' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Deal Info' })).toBeInTheDocument();
  });
}); 