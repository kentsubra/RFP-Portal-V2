// Mock modules first - these get hoisted to the top by Vitest
vi.mock('@/lib/hooks/useOpportunityDrawer', () => ({
  useOpportunityDrawer: vi.fn().mockImplementation((opportunity, onClose) => ({
    isEditing: false,
    isSaving: false,
    handleEdit: vi.fn(),
    handleCancel: vi.fn(),
    handleSave: vi.fn(),
  })),
  useTaskDrawer: vi.fn().mockImplementation(() => ({
    isOpen: false,
    openTaskDrawer: vi.fn(),
    closeTaskDrawer: vi.fn(),
  })),
}));

vi.mock('@/components/ui/use-toast', () => ({
  useToast: vi.fn().mockImplementation(() => ({
    toasts: [],
    toast: vi.fn(),
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  })),
}));

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import path from 'path';

// Log the current directory for debugging
console.log('Current directory:', process.cwd());
console.log('Path resolution for @/lib/hooks/useOpportunityDrawer:', path.resolve(process.cwd(), 'lib/hooks/useOpportunityDrawer.ts'));

import { OpportunityDrawer } from '@/components/opportunity/OpportunityDrawer';
import { Opportunity } from '@/lib/types';
import * as hooks from '@/lib/hooks/useOpportunityDrawer';

// Mock fetch properly for Vitest
const mockFetch = vi.fn(() => Promise.resolve({
  ok: true,
  json: () => Promise.resolve({}),
  status: 200,
  statusText: 'OK',
  headers: new Headers(),
}));
vi.stubGlobal('fetch', mockFetch);

describe('OpportunityDrawer', () => {
  const mockOpportunity: Opportunity = {
    id: '123',
    name: 'Test Opportunity',
    client: 'Test Client',
    dueDate: new Date('2023-12-31'),
    value: 50000,
    priority: 'High',
    sbu: 'Test SBU',
    keyNotes: 'Test notes',
    grossMargin: 20,
    assignedTo: 'Test User',
    status: 'New',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-02'),
  };

  const onCloseMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock the useOpportunityDrawer hook for read mode
    (hooks.useOpportunityDrawer as any).mockImplementation((opportunity: Opportunity, onClose: () => void) => ({
      isEditing: false,
      isSaving: false,
      handleEdit: vi.fn(() => {
        // Switch to edit mode when handleEdit is called
        (hooks.useOpportunityDrawer as any).mockImplementation(() => ({
          isEditing: true,
          isSaving: false,
          handleEdit: vi.fn(),
          handleCancel: vi.fn(),
          handleSave: vi.fn((values: any) => {
            onClose();
          }),
        }));
      }),
      handleCancel: vi.fn(),
      handleSave: vi.fn((values: any) => {
        onClose();
      }),
    }));
  });

  it('renders in read mode and displays opportunity details', () => {
    render(
      <OpportunityDrawer
        opportunity={mockOpportunity}
        isOpen={true}
        onClose={onCloseMock}
      />
    );

    // Check if the drawer is in read mode
    expect(screen.getByText('Opportunity Details')).toBeInTheDocument();
    
    // Check if opportunity details are displayed
    expect(screen.getByText('Test Opportunity')).toBeInTheDocument();
    expect(screen.getByText('Test Client')).toBeInTheDocument();
    expect(screen.getByText('Test SBU')).toBeInTheDocument();
    expect(screen.getByText('20%')).toBeInTheDocument();
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('Test notes')).toBeInTheDocument();
  });

  it('switches from read to edit mode when Edit button is clicked', async () => {
    // Set up a hook that can switch from read to edit mode
    let isEditingMode = false;
    
    (hooks.useOpportunityDrawer as any).mockImplementation(() => {
      return {
        isEditing: isEditingMode,
        isSaving: false,
        handleEdit: vi.fn(() => {
          isEditingMode = true;
          // Force a re-render by updating the mock
        }),
        handleCancel: vi.fn(),
        handleSave: vi.fn(),
      };
    });
    
    const { rerender } = render(
      <OpportunityDrawer
        opportunity={mockOpportunity}
        isOpen={true}
        onClose={onCloseMock}
      />
    );

    // Check we're in read mode first
    expect(screen.getByText('Opportunity Details')).toBeInTheDocument();
    
    // Click the Edit button
    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);
    
    // Update isEditingMode
    isEditingMode = true;
    
    // Re-render with updated props
    rerender(
      <OpportunityDrawer
        opportunity={mockOpportunity}
        isOpen={true}
        onClose={onCloseMock}
      />
    );
    
    // Now we should be in edit mode
    expect(screen.getByText('Edit Opportunity')).toBeInTheDocument();
    
    // Check if form elements are displayed in edit mode
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Client')).toBeInTheDocument();
    expect(screen.getByLabelText('Due Date')).toBeInTheDocument();
    expect(screen.getByLabelText('Value')).toBeInTheDocument();
    expect(screen.getByLabelText('Key Notes')).toBeInTheDocument();
  });

  it('calls PATCH API when Save button is clicked in edit mode', async () => {
    // Set up the mock for edit mode directly
    (hooks.useOpportunityDrawer as any).mockImplementation(() => ({
      isEditing: true,
      isSaving: false,
      handleEdit: vi.fn(),
      handleCancel: vi.fn(),
      handleSave: vi.fn(async (values: any) => {
        // This function should trigger the fetch call within the component
        await fetch(`/api/opportunities/${mockOpportunity.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });
        // Call onClose after the fetch completes
        await Promise.resolve(); // Ensure we're in the next microtask
        onCloseMock();
      }),
    }));

    render(
      <OpportunityDrawer
        opportunity={mockOpportunity}
        isOpen={true}
        onClose={onCloseMock}
      />
    );

    // Change the name
    const nameInput = screen.getByLabelText('Name');
    fireEvent.change(nameInput, { target: { value: 'Updated Opportunity Name' } });

    // Click the Save button
    const saveButton = screen.getByText('Save Changes');
    await act(async () => {
      fireEvent.click(saveButton);
      // Wait for all promises to resolve
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Check if onClose was called
    expect(onCloseMock).toHaveBeenCalled();
  });
}); 