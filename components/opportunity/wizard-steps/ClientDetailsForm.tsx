'use client';

import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { OpportunityFormData } from '../NewOpportunityWizard';

export default function ClientDetailsForm() {
  const { control } = useFormContext<OpportunityFormData>();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Client & Opportunity Information</h3>
      <p className="text-sm text-gray-500">
        Start by providing the client name and opportunity title.
      </p>

      <FormField
        control={control}
        name="client"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Client Name *</FormLabel>
            <FormControl>
              <Input 
                placeholder="Enter client name" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Opportunity Name *</FormLabel>
            <FormControl>
              <Input 
                placeholder="Enter opportunity name" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
} 