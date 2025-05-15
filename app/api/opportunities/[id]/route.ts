import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { opportunityConverter, OPPORTUNITIES_COLLECTION } from '@/lib/converters/opportunity';
import { updateOpportunitySchema } from '@/types/opportunity';

interface RouteParams {
  params: {
    id: string;
  };
}

/**
 * GET /api/opportunities/[id] - Get a single opportunity
 */
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;

    // Get the user session
    const session = await getServerSession();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get document from Firestore
    const opportunityRef = doc(db, OPPORTUNITIES_COLLECTION, id).withConverter(opportunityConverter);
    const opportunityDoc = await getDoc(opportunityRef);
    
    if (!opportunityDoc.exists()) {
      return NextResponse.json(
        { success: false, error: 'Opportunity not found' },
        { status: 404 }
      );
    }

    const opportunity = opportunityDoc.data();
    
    // Check if user has access to this opportunity
    if (opportunity.ownerUid !== session.user.id && !opportunity.assignedTo.includes(session.user.id)) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true, data: opportunity });
  } catch (error) {
    console.error('Error fetching opportunity:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'An unknown error occurred' 
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/opportunities/[id] - Update an opportunity
 */
export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;

    // Get the user session
    const session = await getServerSession();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get existing opportunity
    const opportunityRef = doc(db, OPPORTUNITIES_COLLECTION, id).withConverter(opportunityConverter);
    const opportunityDoc = await getDoc(opportunityRef);
    
    if (!opportunityDoc.exists()) {
      return NextResponse.json(
        { success: false, error: 'Opportunity not found' },
        { status: 404 }
      );
    }

    const opportunity = opportunityDoc.data();
    
    // Check if user has permission to update
    if (opportunity.ownerUid !== session.user.id) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await req.json();
    
    // Validate with Zod schema
    const validationResult = updateOpportunitySchema.safeParse({
      ...body,
      id,
    });

    if (!validationResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation error', 
          details: validationResult.error.format() 
        },
        { status: 400 }
      );
    }

    // Get the validated data
    // Destructure ID but don't use it as it's already available in the URL params
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _, ...updateData } = validationResult.data;

    // Update document
    await updateDoc(opportunityRef, {
      ...updateData,
      updatedAt: new Date(),
    });

    // Get updated document
    const updatedDoc = await getDoc(opportunityRef);
    
    return NextResponse.json({ 
      success: true, 
      data: updatedDoc.data(),
    });
  } catch (error) {
    console.error('Error updating opportunity:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'An unknown error occurred' 
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/opportunities/[id] - Delete an opportunity
 */
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;

    // Get the user session
    const session = await getServerSession();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get existing opportunity
    const opportunityRef = doc(db, OPPORTUNITIES_COLLECTION, id).withConverter(opportunityConverter);
    const opportunityDoc = await getDoc(opportunityRef);
    
    if (!opportunityDoc.exists()) {
      return NextResponse.json(
        { success: false, error: 'Opportunity not found' },
        { status: 404 }
      );
    }

    const opportunity = opportunityDoc.data();
    
    // Check if user has permission to delete
    if (opportunity.ownerUid !== session.user.id) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Delete document
    await deleteDoc(opportunityRef);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Opportunity deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting opportunity:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'An unknown error occurred' 
      },
      { status: 500 }
    );
  }
} 