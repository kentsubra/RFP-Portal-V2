import { z } from "zod";

// Opportunity schema using Zod for validation
export const opportunitySchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  client: z.string().min(1, "Client is required"),
  dueDate: z.date(),
  value: z.number().positive("Value must be positive"),
  priority: z.enum(["High", "Medium", "Low"]),
  sbu: z.string().min(1, "SBU is required"),
  keyNotes: z.string().optional(),
  grossMargin: z.number().min(0, "Gross margin must be non-negative").max(100, "Gross margin must be less than or equal to 100"),
  assignedTo: z.string().min(1, "Assignee is required"),
  status: z.enum(["New", "Sizing", "Drafting", "Review", "Submitted", "Won", "Lost"]).default("New"),
  internalDeadline: z.date().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// TypeScript type derived from the Zod schema
export type Opportunity = z.infer<typeof opportunitySchema>;

// Form schema for the Opportunity drawer
export const opportunityFormSchema = opportunitySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  status: z.enum(["New", "Sizing", "Drafting", "Review", "Submitted", "Won", "Lost"]),
});

export type OpportunityFormValues = z.infer<typeof opportunityFormSchema>; 