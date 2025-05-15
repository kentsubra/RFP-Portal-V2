import { useState } from 'react';
import { Opportunity } from '@/lib/types';
import { useToast } from '@/components/ui/use-toast';

export function useOpportunityDrawer(opportunity: Opportunity, onClose: () => void) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = async (values: Partial<Opportunity>) => {
    try {
      setIsSaving(true);
      
      const response = await fetch(`/api/opportunities/${opportunity.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error('Failed to update opportunity');
      }

      toast({
        title: 'Success',
        description: 'Opportunity updated successfully',
      });
      
      setIsEditing(false);
      onClose();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      toast({
        title: 'Error',
        description: 'Failed to update opportunity',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return {
    isEditing,
    isSaving,
    handleEdit,
    handleCancel,
    handleSave,
  };
}

export function useTaskDrawer() {
  const [isOpen, setIsOpen] = useState(false);

  const openTaskDrawer = () => {
    setIsOpen(true);
  };

  const closeTaskDrawer = () => {
    setIsOpen(false);
  };

  return {
    isOpen,
    openTaskDrawer,
    closeTaskDrawer,
  };
} 