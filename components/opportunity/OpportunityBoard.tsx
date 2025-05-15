'use client';

import React, { useEffect } from 'react';
import { Opportunity } from '@/lib/types';
import { OpportunityCard } from './OpportunityCard';
import { useOpportunityBoard } from '@/lib/hooks/useOpportunityBoard';
import { useToast } from '@/components/ui/use-toast';

// Define status columns
const STATUSES = ['New', 'Sizing', 'Drafting', 'Review', 'Submitted'] as const;
const FINAL_STATUSES = ['Won', 'Lost'] as const;

interface OpportunityBoardProps {
  opportunities: Opportunity[];
  onStatusUpdate?: (opportunityId: string, newStatus: string) => void;
}

export function OpportunityBoard({ opportunities: initialOpportunities, onStatusUpdate }: OpportunityBoardProps) {
  const [openDrawerId, setOpenDrawerId] = React.useState<string | null>(null);
  const { opportunities, updateOpportunities, handleStatusUpdate } = useOpportunityBoard(
    initialOpportunities,
    async (updatedOpportunity) => {
      console.log('DEBUG: Status update callback called with:', JSON.stringify({
        id: updatedOpportunity.id,
        name: updatedOpportunity.name,
        status: updatedOpportunity.status
      }, null, 2));
      if (onStatusUpdate) {
        onStatusUpdate(updatedOpportunity.id, updatedOpportunity.status);
      }
      // Set the drawer to open for this opportunity
      setOpenDrawerId(updatedOpportunity.id);
    }
  );
  const { toast } = useToast();
  
  // Only update when initialOpportunities actually changes
  useEffect(() => {
    const currentIds = opportunities.map(o => o.id).sort().join(',');
    const newIds = initialOpportunities.map(o => o.id).sort().join(',');
    if (currentIds !== newIds) {
      updateOpportunities(initialOpportunities);
    }
  }, [initialOpportunities, opportunities, updateOpportunities]);

  return (
    <div data-testid="opportunity-board" className="w-full overflow-x-auto">
      {/* TEMPORARY: Show Toast button for E2E test */}
      <button
        type="button"
        onClick={() => toast({ title: 'Test Toast', description: 'Toast is working!' })}
        className="mb-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Show Toast
      </button>
      <div className="flex gap-4 min-w-max p-4">
        {STATUSES.map((status) => (
          <Column 
            key={status} 
            id={status} 
            opportunities={opportunities.filter(o => o.status === status)} 
            onStatusChange={handleStatusUpdate}
            openDrawerId={openDrawerId}
            onDrawerClose={() => setOpenDrawerId(null)}
          />
        ))}
        <Column 
          id="Won/Lost" 
          opportunities={opportunities.filter(o => FINAL_STATUSES.includes(o.status as 'Won' | 'Lost'))}
          onStatusChange={handleStatusUpdate}
          openDrawerId={openDrawerId}
          onDrawerClose={() => setOpenDrawerId(null)}
        />
      </div>
    </div>
  );
}

interface ColumnProps {
  id: string;
  opportunities: Opportunity[];
  onStatusChange: (opportunityId: string, newStatus: string) => void;
  openDrawerId: string | null;
  onDrawerClose: () => void;
}

function Column({ id, opportunities, onStatusChange, openDrawerId, onDrawerClose }: ColumnProps) {
  return (
    <div
      id={`column-${id}`}
      data-testid={`column-${id}`}
      className="bg-gray-50 rounded-lg p-4 min-w-[280px] flex-1"
    >
      <h3 className="font-semibold text-lg mb-4 text-center">{id}</h3>
      <div className="flex flex-col gap-3">
        {opportunities.length === 0 ? (
          <div className="border border-dashed border-gray-300 rounded-lg p-4 text-center text-gray-500">
            No opportunities
          </div>
        ) : (
          opportunities.map((opportunity) => (
            <OpportunityCard
              key={opportunity.id}
              opportunity={opportunity}
              onStatusChange={onStatusChange}
              isDrawerOpen={openDrawerId === opportunity.id}
              onDrawerClose={onDrawerClose}
            />
          ))
        )}
      </div>
    </div>
  );
} 