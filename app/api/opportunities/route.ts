import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, addDoc } from 'firebase/firestore';
import { opportunityConverter, OPPORTUNITIES_COLLECTION } from '@/lib/converters/opportunity';
import { createOpportunitySchema } from '@/types/opportunity';

/**
 * GET /api/opportunities - Get opportunities for the current user
 */
export async function GET() {
  try {
    // Get the user session
    const session = await getServerSession();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Query opportunities for the current user
    const opportunitiesRef = collection(db, OPPORTUNITIES_COLLECTION).withConverter(opportunityConverter);
    const q = query(opportunitiesRef, where('ownerUid', '==', session.user.id));
    const querySnapshot = await getDocs(q);
    
    // Convert to array of opportunities
    const opportunities = querySnapshot.docs.map(doc => doc.data());

    return NextResponse.json({ success: true, data: opportunities });
  } catch (error) {
    console.error('Error fetching opportunities:', error);
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
 * POST /api/opportunities - Create a new opportunity
 */
export async function POST(req: NextRequest) {
  try {
    // Get the user session
    const session = await getServerSession();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await req.json();
    
    // Validate with Zod schema
    const validationResult = createOpportunitySchema.safeParse({
      ...body,
      ownerUid: session.user.id,
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
    const data = validationResult.data;

    // Add to Firestore
    const opportunitiesRef = collection(db, OPPORTUNITIES_COLLECTION).withConverter(opportunityConverter);
    const docRef = await addDoc(opportunitiesRef, {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({ 
      success: true, 
      data: { 
        id: docRef.id,
        ...data 
      } 
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating opportunity:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'An unknown error occurred' 
      },
      { status: 500 }
    );
  }
} 