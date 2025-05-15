import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { Opportunity } from '@/lib/types';

// Mock the hooks
const mockHandleStatusUpdate = vi.fn();
vi.mock('@/lib/hooks/useOpportunityBoard', () => ({
  useOpportunityBoard: vi.fn().mockImplementation((opportunities, onUpdateSuccess) => ({
    opportunities,
    updateOpportunities: vi.fn(),
    handleStatusUpdate: mockHandleStatusUpdate.mockImplementation((opportunityId, newStatus) => {
      if (opportunityId && newStatus && onUpdateSuccess) {
        onUpdateSuccess({ id: opportunityId, status: newStatus } as any);
      }
    }),
  })),
}));

const mockToast = {
  toast: vi.fn(),
  error: vi.fn(),
  success: vi.fn(),
};
vi.mock('@/components/ui/use-toast', () => ({
  useToast: () => mockToast,
}));

// Now import the component
import { OpportunityBoard } from '@/components/opportunity/OpportunityBoard';

describe('OpportunityBoard', () => {
  // Sample opportunity data
  const mockOpportunities: Opportunity[] = [
    {
      id: '1',
      name: 'Enterprise CRM Implementation',
      client: 'Acme Corp',
      dueDate: new Date('2023-12-31'),
      value: 150000,
      priority: 'High',
      sbu: 'Enterprise Solutions',
      keyNotes: 'Key decision makers require ROI analysis',
      grossMargin: 25,
      assignedTo: 'Jane Smith',
      status: 'New',
      createdAt: new Date('2023-05-15'),
      updatedAt: new Date('2023-05-20'),
    },
    {
      id: '2',
      name: 'Cloud Migration Project',
      client: 'TechGlobal',
      dueDate: new Date('2023-11-15'),
      value: 220000,
      priority: 'Medium',
      sbu: 'Cloud Services',
      keyNotes: 'Legacy system compatibility issues to address',
      grossMargin: 22,
      assignedTo: 'Michael Johnson',
      status: 'Sizing',
      createdAt: new Date('2023-04-10'),
      updatedAt: new Date('2023-05-18'),
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all status columns', () => {
    render(<OpportunityBoard opportunities={mockOpportunities} onStatusUpdate={() => {}} />);
    
    // Check if all status columns are rendered using data-testid
    expect(screen.getByTestId('column-New')).toBeInTheDocument();
    expect(screen.getByTestId('column-Sizing')).toBeInTheDocument();
    expect(screen.getByTestId('column-Drafting')).toBeInTheDocument();
    expect(screen.getByTestId('column-Review')).toBeInTheDocument();
    expect(screen.getByTestId('column-Submitted')).toBeInTheDocument();
    expect(screen.getByTestId('column-Won/Lost')).toBeInTheDocument();
  });

  it('renders opportunities in the correct columns', () => {
    render(<OpportunityBoard opportunities={mockOpportunities} onStatusUpdate={() => {}} />);
    
    // Check if opportunities are in the correct columns
    const newColumn = screen.getByTestId('column-New');
    expect(newColumn).toHaveTextContent('Enterprise CRM Implementation');
    
    const sizingColumn = screen.getByTestId('column-Sizing');
    expect(sizingColumn).toHaveTextContent('Cloud Migration Project');
  });

  it('calls onStatusUpdate when handling status changes', () => {
    const onStatusUpdateMock = vi.fn();
    
    render(<OpportunityBoard 
      opportunities={mockOpportunities} 
      onStatusUpdate={onStatusUpdateMock} 
    />);
    
    // Directly call the mocked handleStatusUpdate function
    mockHandleStatusUpdate('1', 'Drafting');
    
    // Verify the callback was called with correct parameters
    expect(onStatusUpdateMock).toHaveBeenCalledWith('1', 'Drafting');
  });
}); 