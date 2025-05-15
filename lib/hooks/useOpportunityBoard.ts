import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Opportunity } from '@/lib/types';
import { sub } from 'date-fns';

export function useOpportunityBoard(
  initialOpportunities: Opportunity[],
  onUpdateSuccess?: (updatedOpportunity: Opportunity) => void
) {
  const [opportunities, setOpportunities] = useState<Opportunity[]>(initialOpportunities);
  const { toast } = useToast();
  
  // Memoize updateOpportunities to prevent recreation on every render
  const updateOpportunities = useCallback((newOpportunities: Opportunity[]) => {
    setOpportunities(newOpportunities);
  }, []);
  
  // Handle status update with optimistic UI
  const handleStatusUpdate = async (opportunityId: string, newStatus: string) => {
    console.log('DEBUG: handleStatusUpdate called with', opportunityId, newStatus);
    const opportunityIndex = opportunities.findIndex(opp => opp.id === opportunityId);
    if (opportunityIndex === -1) {
      console.log('DEBUG: Opportunity not found for id', opportunityId);
      return;
    }
    console.log('DEBUG: Opportunity found, updating status');
    const updatedOpportunity = { ...opportunities[opportunityIndex] };
    const oldStatus = updatedOpportunity.status;
    
    // Optimistically update the status
    updatedOpportunity.status = newStatus as Opportunity['status'];
    
    // If status is changing to Review, update the internal deadline
    if (newStatus === 'Review') {
      updatedOpportunity.internalDeadline = sub(updatedOpportunity.dueDate, { days: 3 });
    }
    
    // Optimistically update the UI
    const newOpportunities = [...opportunities];
    newOpportunities[opportunityIndex] = updatedOpportunity;
    setOpportunities(newOpportunities);
    console.log('DEBUG: Optimistic update complete');
    
    // Call the API to update the status
    try {
      const response = await fetch(`/api/opportunities/${opportunityId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status: newStatus,
          // The server will handle the internal deadline calculation
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update opportunity: ${response.statusText}`);
      }
      
      // Get the updated opportunity data from the server
      const updatedData = await response.json();
      console.log('DEBUG: Received updated data from server:', JSON.stringify(updatedData, null, 2));
      
      // Parse dates in the updated data
      const parsedUpdatedData = {
        ...updatedData,
        dueDate: updatedData.dueDate ? new Date(updatedData.dueDate) : new Date(),
        createdAt: updatedData.createdAt ? new Date(updatedData.createdAt) : new Date(),
        updatedAt: updatedData.updatedAt ? new Date(updatedData.updatedAt) : new Date(),
        internalDeadline: updatedData.internalDeadline ? new Date(updatedData.internalDeadline) : undefined,
      };
      
      // Update the state with the server data
      const finalOpportunities = [...opportunities];
      finalOpportunities[opportunityIndex] = parsedUpdatedData;
      setOpportunities(finalOpportunities);
      
      // Call the success callback
      if (onUpdateSuccess) {
        onUpdateSuccess(parsedUpdatedData);
      }
      
      // Show success toast
      console.log('DEBUG: Showing toast for status update to', newStatus);
      toast({
        title: 'Status updated',
        description: `Opportunity moved to ${newStatus}`,
      });
    } catch (error) {
      // Revert to the previous state in case of an error
      const revertedOpportunities = [...opportunities];
      revertedOpportunities[opportunityIndex] = {
        ...updatedOpportunity,
        status: oldStatus,
      };
      setOpportunities(revertedOpportunities);
      
      toast({
        title: 'Update failed',
        description: 'Failed to update opportunity status. Please try again.',
        variant: 'destructive',
      });
      
      console.error('Error updating opportunity status:', error);
    }
  };
  
  return {
    opportunities,
    updateOpportunities,
    handleStatusUpdate,
  };
} 