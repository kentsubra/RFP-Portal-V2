'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { OpportunityDrawer } from '@/components/opportunity/OpportunityDrawer';
import { OpportunityBoard } from '@/components/opportunity/OpportunityBoard';
import { Opportunity } from '@/lib/types';
import { useToast } from '@/components/ui/use-toast';

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchOpportunities = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/opportunities');
      if (response.ok) {
        const data = await response.json();
        setOpportunities(data);
      }
    } catch (error) {
      console.error('Error fetching opportunities:', error);
      toast({
        title: 'Error',
        description: 'Failed to load opportunities',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchOpportunities();
  }, [fetchOpportunities]);

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedOpportunity(null);
    // Refresh opportunities to get the latest data
    fetchOpportunities();
  };

  // Handle status updates from the board
  const handleStatusUpdate = async (opportunityId: string, newStatus: string) => {
    // The actual update is handled by the OpportunityBoard component
    // We just need to refresh the opportunities list after a successful update
    const updatedOpportunity = opportunities.find(opp => opp.id === opportunityId);
    if (updatedOpportunity) {
      setOpportunities(currentOpportunities => {
        return currentOpportunities.map(opp => 
          opp.id === opportunityId 
            ? { ...opp, status: newStatus as Opportunity['status'] } 
            : opp
        );
      });
    }
  };

  if (isLoading && opportunities.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Loading opportunities...</p>
      </div>
    );
  }

  return (
    <div className="container-fluid mx-auto py-6">
      <div className="flex justify-between items-center mb-6 px-6">
        <h1 className="text-2xl font-bold">Opportunity Board</h1>
      </div>
      
      {opportunities.length > 0 ? (
        <OpportunityBoard 
          opportunities={opportunities}
          onStatusUpdate={handleStatusUpdate}
        />
      ) : (
        <div className="text-center py-10">
          <p className="text-lg text-gray-500">No opportunities found</p>
        </div>
      )}

      {selectedOpportunity && (
        <OpportunityDrawer
          opportunity={selectedOpportunity}
          isOpen={isDrawerOpen}
          onClose={closeDrawer}
        />
      )}
    </div>
  );
} 