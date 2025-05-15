'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon, Edit } from 'lucide-react';

import { Opportunity, opportunityFormSchema, OpportunityFormValues } from '@/lib/types';
import { useOpportunityDrawer, useTaskDrawer } from '@/lib/hooks/useOpportunityDrawer';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

interface OpportunityDrawerProps {
  opportunity: Opportunity;
  isOpen: boolean;
  onClose: () => void;
}

export function OpportunityDrawer({ opportunity, isOpen, onClose }: OpportunityDrawerProps) {
  console.log('DEBUG: OpportunityDrawer received opportunity:', JSON.stringify({
    id: opportunity.id,
    name: opportunity.name,
    status: opportunity.status,
    internalDeadline: opportunity.internalDeadline
  }, null, 2));

  const { isEditing, isSaving, handleEdit, handleCancel, handleSave } = useOpportunityDrawer(opportunity, onClose);
  const { openTaskDrawer } = useTaskDrawer();

  // Initialize the form with opportunity data
  const form = useForm<OpportunityFormValues>({
    resolver: zodResolver(opportunityFormSchema),
    defaultValues: {
      name: opportunity.name,
      client: opportunity.client,
      dueDate: opportunity.dueDate,
      value: opportunity.value,
      priority: opportunity.priority,
      sbu: opportunity.sbu,
      keyNotes: opportunity.keyNotes || '',
      grossMargin: opportunity.grossMargin,
      assignedTo: opportunity.assignedTo,
      status: opportunity.status,
      internalDeadline: opportunity.internalDeadline,
    },
  });

  // Submit handler
  const onSubmit = async (values: OpportunityFormValues) => {
    await handleSave(values);
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent role="dialog" data-testid="opportunity-drawer" className="sm:max-w-md md:max-w-lg">
        <SheetHeader>
          <SheetTitle>
            {isEditing ? 'Edit Opportunity' : 'Opportunity Details'}
          </SheetTitle>
        </SheetHeader>

        {isEditing ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="client"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Due Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
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
                          onSelect={(date) => date && field.onChange(date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Value</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="number" 
                        onChange={e => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sbu"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SBU</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="keyNotes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Key Notes</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="grossMargin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gross Margin (%)</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="number" 
                        onChange={e => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="assignedTo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assigned To</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <SheetFooter className="pt-4">
                <Button variant="outline" onClick={handleCancel} type="button">
                  Cancel
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </SheetFooter>
            </form>
          </Form>
        ) : (
          <div className="py-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Name</h3>
                <p className="mt-1">{opportunity.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Client</h3>
                <p className="mt-1">{opportunity.client}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Due Date</h3>
                <p className="mt-1">{format(opportunity.dueDate, 'PPP')}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Value</h3>
                <p className="mt-1">${opportunity.value.toLocaleString()}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Priority</h3>
                <p className="mt-1">{opportunity.priority}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">SBU</h3>
                <p className="mt-1">{opportunity.sbu}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Gross Margin</h3>
                <p className="mt-1">{opportunity.grossMargin}%</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Assigned To</h3>
                <p className="mt-1">{opportunity.assignedTo}</p>
              </div>
              {opportunity.internalDeadline && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Internal deadline:</h3>
                  <p className="mt-1">{format(opportunity.internalDeadline, 'PPP')}</p>
                </div>
              )}
            </div>
            {opportunity.keyNotes && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Key Notes</h3>
                <p className="mt-1">{opportunity.keyNotes}</p>
              </div>
            )}
            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={openTaskDrawer}
              >
                View Tasks
              </Button>
              <Button onClick={handleEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
} 