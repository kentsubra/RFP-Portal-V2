import { z } from 'zod';

// Enums
export enum OpportunityStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  SUBMITTED = 'submitted',
  WON = 'won',
  LOST = 'lost',
  CANCELLED = 'cancelled',
}

export enum OpportunityPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

// Base schema for opportunity
export const opportunityBaseSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, { message: 'Opportunity name is required (min 3 characters)' }),
  client: z.string().min(2, { message: 'Client name is required (min 2 characters)' }),
  value: z.number().min(0, { message: 'Value must be a positive number' }),
  rfpDue: z.date({ required_error: 'RFP due date is required' }),
  internalDeadline: z.date({ required_error: 'Internal deadline is required' }),
  sbu: z.string().min(1, { message: 'SBU is required' }),
  grossMargin: z.number().min(0).max(100, { message: 'Gross margin must be between 0 and 100' }),
  priority: z.nativeEnum(OpportunityPriority),
  status: z.nativeEnum(OpportunityStatus),
  ownerUid: z.string().min(1, { message: 'Owner is required' }),
  assignedTo: z.array(z.string()),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// Schema for opportunity creation
export const createOpportunitySchema = opportunityBaseSchema.omit({ 
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Schema for opportunity updates
export const updateOpportunitySchema = opportunityBaseSchema.partial().extend({
  id: z.string().min(1, { message: 'Opportunity ID is required for updates' }),
});

// Type definitions based on schemas
export type OpportunityBase = z.infer<typeof opportunityBaseSchema>;
export type CreateOpportunity = z.infer<typeof createOpportunitySchema>;
export type UpdateOpportunity = z.infer<typeof updateOpportunitySchema>;

// Type for Firestore document
export interface OpportunityDoc extends Omit<OpportunityBase, 'id'> {
  createdAt: Date;
  updatedAt: Date;
}

// Response types for API
export type OpportunityResponse = {
  success: boolean;
  data?: OpportunityBase;
  error?: string;
};

export type OpportunitiesResponse = {
  success: boolean;
  data?: OpportunityBase[];
  error?: string;
}; 