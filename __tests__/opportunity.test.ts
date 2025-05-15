import { describe, it, expect } from 'vitest';
import { 
  opportunitySchema, 
  OpportunityPriority, 
  OpportunityStatus 
} from '@/types/opportunity';

describe('Opportunity Schema', () => {
  it('should validate a valid opportunity object', () => {
    // Create a sample valid opportunity
    const validOpportunity = {
      name: 'Enterprise Web Portal',
      client: 'Acme Corp',
      sbu: 'Digital Solutions',
      value: 250000,
      grossMargin: 35.5,
      priority: OpportunityPriority.HIGH,
      status: OpportunityStatus.IN_REVIEW,
      rfpDue: new Date('2025-01-15'),
      internalDeadline: new Date('2024-12-31'),
      ownerUid: 'user123',
      assignedTo: ['user456', 'user789']
    };

    // Validate with Zod schema
    const result = opportunitySchema.safeParse(validOpportunity);
    
    // Assert the validation passes
    expect(result.success).toBe(true);
    
    if (result.success) {
      const parsed = result.data;
      
      // Verify specific fields
      expect(parsed.name).toBe('Enterprise Web Portal');
      expect(parsed.client).toBe('Acme Corp');
      expect(parsed.value).toBe(250000);
      expect(parsed.priority).toBe(OpportunityPriority.HIGH);
      expect(parsed.status).toBe(OpportunityStatus.IN_REVIEW);
      expect(parsed.assignedTo).toHaveLength(2);
      expect(parsed.assignedTo).toContain('user456');
    }
  });

  it('should reject an invalid opportunity object', () => {
    // Create an invalid opportunity (missing required fields, invalid types)
    const invalidOpportunity = {
      name: 'AB', // Too short (min 3 chars)
      client: '',  // Empty
      value: -5000, // Negative value
      grossMargin: 120, // Over 100%
      priority: 'ULTRA', // Not a valid enum value
      status: OpportunityStatus.DRAFT,
      // Missing rfpDue and internalDeadline
      ownerUid: 'user123'
    };

    // Validate with Zod schema
    const result = opportunitySchema.safeParse(invalidOpportunity);
    
    // Assert the validation fails
    expect(result.success).toBe(false);
    
    if (!result.success) {
      // Check for specific validation errors
      const formattedErrors = result.error.format();
      
      expect(formattedErrors.name?._errors).toBeDefined();
      expect(formattedErrors.client?._errors).toBeDefined();
      expect(formattedErrors.value?._errors).toBeDefined();
      expect(formattedErrors.grossMargin?._errors).toBeDefined();
      expect(formattedErrors.priority?._errors).toBeDefined();
      expect(formattedErrors.rfpDue?._errors).toBeDefined();
      expect(formattedErrors.internalDeadline?._errors).toBeDefined();
    }
  });
}); 