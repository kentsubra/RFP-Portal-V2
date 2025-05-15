'use client';

import React from 'react';
import { format } from 'date-fns';
import { 
  CalendarIcon, 
  User, 
  DollarSign, 
  BarChart
} from 'lucide-react';

import { Opportunity } from '@/lib/types';
import { OpportunityDrawer } from './OpportunityDrawer';
import { cn } from '@/lib/utils';

interface OpportunityCardProps {
  opportunity: Opportunity;
  onStatusChange?: (opportunityId: string, newStatus: string) => void;
  isDrawerOpen: boolean;
  onDrawerClose: () => void;
}

export function OpportunityCard({ opportunity, onStatusChange, isDrawerOpen, onDrawerClose }: OpportunityCardProps) {
  const priorityColor = {
    High: 'bg-red-100 text-red-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    Low: 'bg-green-100 text-green-800',
  }[opportunity.priority];

  // Status badge colors
  const statusColor = {
    New: 'bg-blue-100 text-blue-800',
    Sizing: 'bg-indigo-100 text-indigo-800',
    Drafting: 'bg-purple-100 text-purple-800',
    Review: 'bg-orange-100 text-orange-800',
    Submitted: 'bg-cyan-100 text-cyan-800',
    Won: 'bg-green-100 text-green-800',
    Lost: 'bg-gray-100 text-gray-800',
  }[opportunity.status];

  // Status options
  const statusOptions = [
    'New', 'Sizing', 'Drafting', 'Review', 'Submitted', 'Won', 'Lost'
  ];

  return (
    <>
      <div 
        className={cn(
          "border rounded-lg p-4 hover:shadow-md transition-shadow bg-white",
          "cursor-pointer"
        )}
        onClick={() => onDrawerClose()}
      >
        <div className="mb-2 flex justify-between items-start">
          <h3 className="font-medium text-lg">{opportunity.name}</h3>
          <div className="flex gap-1">
            {(opportunity.status === 'Won' || opportunity.status === 'Lost') ? (
              <span className={cn("text-xs px-2 py-1 rounded-full font-medium", statusColor)}>
                {opportunity.status}
              </span>
            ) : null}
            <span className={cn("text-xs px-2 py-1 rounded-full font-medium", priorityColor)}>
              {opportunity.priority}
            </span>
          </div>
        </div>
        <p className="text-gray-600 text-sm mb-3">{opportunity.client}</p>

        {/* Status dropdown */}
        <label htmlFor={`status-select-${opportunity.id}`} className="block text-xs font-medium mb-1">Status</label>
        <select
          id={`status-select-${opportunity.id}`}
          aria-label="Status"
          role="combobox"
          className="mb-3 w-full border rounded px-2 py-1 text-sm"
          value={opportunity.status}
          onClick={e => e.stopPropagation()}
          onChange={async e => {
            if (onStatusChange) {
              await onStatusChange(opportunity.id, e.target.value);
            }
          }}
        >
          {statusOptions.map(status => (
            <option key={status} value={status} role="option">{status}</option>
          ))}
        </select>

        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
          <div className="flex items-center">
            <CalendarIcon className="h-4 w-4 mr-2 text-gray-500" />
            <span>{format(opportunity.dueDate, 'MMM dd, yyyy')}</span>
          </div>
          <div className="flex items-center">
            <DollarSign className="h-4 w-4 mr-2 text-gray-500" />
            <span>${opportunity.value.toLocaleString()}</span>
          </div>
          <div className="flex items-center">
            <BarChart className="h-4 w-4 mr-2 text-gray-500" />
            <span>{opportunity.grossMargin}% margin</span>
          </div>
          <div className="flex items-center">
            <User className="h-4 w-4 mr-2 text-gray-500" />
            <span>{opportunity.assignedTo}</span>
          </div>
        </div>

        {opportunity.internalDeadline && (
          <div className="mt-3 text-xs border-t pt-2 text-gray-600">
            <span className="font-medium">Internal deadline:</span>{' '}
            {format(opportunity.internalDeadline, 'MMM dd, yyyy')}
          </div>
        )}
      </div>

      <OpportunityDrawer 
        opportunity={opportunity}
        isOpen={isDrawerOpen}
        onClose={onDrawerClose}
      />
    </>
  );
} 