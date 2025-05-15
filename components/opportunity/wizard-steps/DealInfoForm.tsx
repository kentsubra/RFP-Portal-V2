'use client';

import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { OpportunityFormData } from '../NewOpportunityWizard';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { OpportunityPriority } from '@/types/opportunity';

export default function DealInfoForm() {
  const { control, setValue } = useFormContext<OpportunityFormData>();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Deal Information</h3>
      <p className="text-sm text-gray-500">
        Provide details about the opportunity value, deadlines, and priority.
      </p>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={control}
          name="value"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deal Value ($) *</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="0.00"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="grossMargin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gross Margin (%) *</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="0-100"
                  min={0}
                  max={100}
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="sbu"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Strategic Business Unit (SBU) *</FormLabel>
            <FormControl>
              <Input placeholder="Enter SBU" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={control}
          name="rfpDue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>RFP Due Date *</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(date) => date && setValue('rfpDue', date)}
                    disabled={(date) =>
                      date < new Date(new Date().setHours(0, 0, 0, 0))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="internalDeadline"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Internal Deadline *</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(date) => date && setValue('internalDeadline', date)}
                    disabled={(date) =>
                      date < new Date(new Date().setHours(0, 0, 0, 0))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="priority"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Priority *</FormLabel>
            <Select
              onValueChange={(value) => field.onChange(value)}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value={OpportunityPriority.LOW}>Low</SelectItem>
                <SelectItem value={OpportunityPriority.MEDIUM}>Medium</SelectItem>
                <SelectItem value={OpportunityPriority.HIGH}>High</SelectItem>
                <SelectItem value={OpportunityPriority.URGENT}>Urgent</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
} 