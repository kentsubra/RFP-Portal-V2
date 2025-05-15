import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { db } from '@/lib/firebase';
import { getOpportunitiesCollection } from '@/lib/converters/opportunity';
import { createOpportunitySchema } from '@/types/opportunity';
import { ZodError } from 'zod';

/**
 * POST /api/opportunities
 * Creates a new opportunity
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
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

      // Set the owner UID to the current user
      body.ownerUid = session.user.id;

      const validatedData = createOpportunitySchema.parse(body);

      // Add to Firestore
      const opportunitiesCollection = getOpportunitiesCollection(db);
      const docRef = await opportunitiesCollection.add(validatedData);
      
      // Get the created document
      const opportunitySnapshot = await docRef.get();
      const opportunity = opportunitySnapshot.data();

      return NextResponse.json(
        { success: true, opportunity },
        { status: 201 }
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
    console.error('Error creating opportunity:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create opportunity' },
      { status: 500 }
    );
  }
} 