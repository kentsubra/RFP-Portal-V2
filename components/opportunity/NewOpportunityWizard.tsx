'use client';

import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createOpportunitySchema, OpportunityPriority, OpportunityStatus } from '@/types/opportunity';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import ClientDetailsForm from './wizard-steps/ClientDetailsForm';
import RfpLinksForm from './wizard-steps/RfpLinksForm';
import DealInfoForm from './wizard-steps/DealInfoForm';
import { useCreateOpportunity } from '@/lib/hooks/useOpportunityActions';
import { useSession } from 'next-auth/react';

// Step identifiers
const STEPS = {
  CLIENT_DETAILS: 'client-details',
  RFP_LINKS: 'rfp-links',
  DEAL_INFO: 'deal-info'
};

export type OpportunityFormData = {
  name: string;
  client: string;
  rfpLinks?: string[]; // Custom field for the wizard (not in schema)
  value: number;
  rfpDue: Date;
  internalDeadline: Date;
  sbu: string;
  grossMargin: number;
  priority: OpportunityPriority;
  status: OpportunityStatus;
  ownerUid: string;
  assignedTo: string[];
};

interface NewOpportunityWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewOpportunityWizard({ isOpen, onClose }: NewOpportunityWizardProps) {
  const [currentStep, setCurrentStep] = useState<string>(STEPS.CLIENT_DETAILS);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { data: session } = useSession();
  const { createOpportunity } = useCreateOpportunity();

  // Initialize the form with React Hook Form and Zod validation
  const methods = useForm<OpportunityFormData>({
    resolver: zodResolver(createOpportunitySchema),
    defaultValues: {
      name: '',
      client: '',
      rfpLinks: [],
      value: 0,
      grossMargin: 0,
      sbu: '',
      priority: OpportunityPriority.MEDIUM,
      status: OpportunityStatus.DRAFT,
      rfpDue: new Date(),
      internalDeadline: new Date(),
      ownerUid: session?.user?.id || '',
      assignedTo: [],
    },
    mode: 'onChange',
  });

  const { handleSubmit, trigger, formState: { isValid, errors } } = methods;

  // Handle navigation between steps
  const handleNext = async () => {
    let shouldContinue = false;

    if (currentStep === STEPS.CLIENT_DETAILS) {
      shouldContinue = await trigger(['name', 'client'], { shouldFocus: true });
      if (shouldContinue) setCurrentStep(STEPS.RFP_LINKS);
    } else if (currentStep === STEPS.RFP_LINKS) {
      // RFP links are optional, always allow proceeding
      setCurrentStep(STEPS.DEAL_INFO);
      shouldContinue = true;
    }
  };

  const handleBack = () => {
    if (currentStep === STEPS.RFP_LINKS) {
      setCurrentStep(STEPS.CLIENT_DETAILS);
    } else if (currentStep === STEPS.DEAL_INFO) {
      setCurrentStep(STEPS.RFP_LINKS);
    }
  };

  // Submit the form
  const onSubmit = async (data: OpportunityFormData) => {
    if (!session?.user?.id) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to create an opportunity",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Transform wizard data to match API expectations
      const opportunityData = {
        ...data,
        ownerUid: session.user.id,
        // Any other transformations needed
      };

      const result = await createOpportunity(opportunityData);
      
      if (result.success) {
        toast({
          title: "Success",
          description: "Opportunity created successfully",
        });
        methods.reset();
        onClose();
      } else {
        throw new Error(result.error || 'An error occurred');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create opportunity",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>New Opportunity</DialogTitle>
        </DialogHeader>
        
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Tabs value={currentStep} className="w-full">
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger 
                  value={STEPS.CLIENT_DETAILS}
                  onClick={() => setCurrentStep(STEPS.CLIENT_DETAILS)}
                >
                  Client Details
                </TabsTrigger>
                <TabsTrigger 
                  value={STEPS.RFP_LINKS}
                  onClick={() => setCurrentStep(STEPS.RFP_LINKS)}
                >
                  RFP Links
                </TabsTrigger>
                <TabsTrigger 
                  value={STEPS.DEAL_INFO}
                  onClick={() => setCurrentStep(STEPS.DEAL_INFO)}
                >
                  Deal Info
                </TabsTrigger>
              </TabsList>

              <TabsContent value={STEPS.CLIENT_DETAILS}>
                <ClientDetailsForm />
              </TabsContent>

              <TabsContent value={STEPS.RFP_LINKS}>
                <RfpLinksForm />
              </TabsContent>

              <TabsContent value={STEPS.DEAL_INFO}>
                <DealInfoForm />
              </TabsContent>
            </Tabs>

            <div className="flex justify-between pt-4">
              {currentStep !== STEPS.CLIENT_DETAILS && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                >
                  Back
                </Button>
              )}
              
              {currentStep !== STEPS.DEAL_INFO ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={currentStep === STEPS.CLIENT_DETAILS && !isValid}
                  className="ml-auto"
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isSubmitting || !isValid}
                  className="ml-auto"
                >
                  Submit
                </Button>
              )}
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
} 