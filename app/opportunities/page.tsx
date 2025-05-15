'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import NewOpportunityWizard from '@/components/opportunity/NewOpportunityWizard';

export default function OpportunitiesPage() {
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Opportunities</h1>
        
        <Button 
          onClick={() => setIsWizardOpen(true)}
          className="flex items-center gap-1"
        >
          <PlusCircle className="h-4 w-4" />
          <span>New Opportunity</span>
        </Button>
      </div>
      
      <div className="rounded-lg border bg-card p-6 shadow">
        <h2 className="mb-4 text-xl font-semibold">Your Opportunities</h2>
        <p className="text-muted-foreground">No opportunities found. Create one to get started.</p>
      </div>

      {/* New Opportunity Wizard */}
      <NewOpportunityWizard 
        isOpen={isWizardOpen} 
        onClose={() => setIsWizardOpen(false)} 
      />
    </div>
  );
} 