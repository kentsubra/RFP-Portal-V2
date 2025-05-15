import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { db } from '@/lib/firebase';
import { getOpportunitiesCollection } from '@/lib/converters/opportunity';
import { updateOpportunitySchema } from '@/types/opportunity';
import { ZodError } from 'zod';

/**
 * PATCH /api/opportunities/[id]
 * Updates an existing opportunity
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Opportunity ID is required' },
        { status: 400 }
      );
    }

    // Get the opportunity to update
    const opportunitiesCollection = getOpportunitiesCollection(db);
    const opportunityRef = opportunitiesCollection.doc(id);
    const opportunitySnapshot = await opportunityRef.get();

    // Check if opportunity exists
    if (!opportunitySnapshot.exists) {
      return NextResponse.json(
        { success: false, error: 'Opportunity not found' },
        { status: 404 }
      );
    }

    // Get the current opportunity data
    const existingOpportunity = opportunitySnapshot.data();
    
    // Validate opportunity data exists
    if (!existingOpportunity) {
      return NextResponse.json(
        { success: false, error: 'Opportunity data is missing' },
        { status: 500 }
      );
    }

    // Check if user is authorized to update the opportunity
    // (either the owner or assigned to the opportunity)
    const userId = session.user.id;
    if (
      existingOpportunity.ownerUid !== userId &&
      !existingOpportunity.assignedTo.includes(userId)
    ) {
      return NextResponse.json(
        { success: false, error: 'Not authorized to update this opportunity' },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();

    // Validate with Zod schema
    try {
      // Parse dates from ISO strings
      if (typeof body.rfpDue === 'string') {
        body.rfpDue = new Date(body.rfpDue);
      }
      if (typeof body.internalDeadline === 'string') {
        body.internalDeadline = new Date(body.internalDeadline);
      }

      const validatedData = updateOpportunitySchema.parse(body);

      // Update the document
      await opportunityRef.update(validatedData);
      
      // Get the updated document
      const updatedSnapshot = await opportunityRef.get();
      const updatedOpportunity = updatedSnapshot.data();

      return NextResponse.json(
        { success: true, opportunity: updatedOpportunity },
        { status: 200 }
      );
    } catch (error) {
      if (error instanceof ZodError) {
        return NextResponse.json(
          { success: false, error: error.errors },
          { status: 400 }
        );
      }
      throw error;
    }
  } catch (error) {
    console.error('Error updating opportunity:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update opportunity' },
      { status: 500 }
    );
  }
} 