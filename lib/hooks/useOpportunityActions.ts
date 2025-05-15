'use client';

import { useCallback } from 'react';
import { CreateOpportunity, OpportunityResponse } from '@/types/opportunity';

/**
 * Hook for opportunity CRUD operations
 */
export function useOpportunityActions() {
  /**
   * Create a new opportunity
   */
  const createOpportunity = useCallback(
    async (data: CreateOpportunity): Promise<OpportunityResponse> => {
      try {
        // Call the API to create a new opportunity
        const response = await fetch('/api/opportunities', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        const result = await response.json();
        
        return {
          success: response.ok,
          data: result.data,
          error: !response.ok ? result.error : undefined,
        };
      } catch (error) {
        console.error('Error creating opportunity:', error);
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to create opportunity',
        };
      }
    },
    []
  );

  return {
    createOpportunity,
  };
} 