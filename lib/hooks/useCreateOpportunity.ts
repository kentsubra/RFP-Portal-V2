import { useCallback } from 'react';
import { useOpportunityActions } from './useOpportunityActions';
import { CreateOpportunity, OpportunityResponse } from '@/types/opportunity';

/**
 * Hook specifically for handling opportunity creation
 */
export function useCreateOpportunity() {
  const { createOpportunity: createOpportunityAction } = useOpportunityActions();
  
  /**
   * Create a new opportunity
   */
  const createOpportunity = useCallback(
    async (data: CreateOpportunity): Promise<OpportunityResponse> => {
      return createOpportunityAction(data);
    },
    [createOpportunityAction]
  );

  return {
    createOpportunity
  };
} 