import { NextRequest, NextResponse } from 'next/server';
import { sub } from 'date-fns';
import { opportunitySchema } from '@/lib/types';
import { opportunities } from '../data';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const opportunity = opportunities.find((opp) => opp.id === id);

  if (!opportunity) {
    return NextResponse.json(
      { error: 'Opportunity not found' },
      { status: 404 }
    );
  }

  return NextResponse.json(opportunity);
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  console.log('DEBUG: PATCH request received for opportunity:', id);
  
  const oppIndex = opportunities.findIndex((opp) => opp.id === id);
  console.log('DEBUG: Found opportunity at index:', oppIndex);

  if (oppIndex === -1) {
    console.log('DEBUG: Opportunity not found:', id);
    return NextResponse.json(
      { error: 'Opportunity not found' },
      { status: 404 }
    );
  }

  const opportunity = opportunities[oppIndex];
  const data = await request.json();
  console.log('DEBUG: PATCH request data:', JSON.stringify(data, null, 2));
  console.log('DEBUG: Current opportunity state:', JSON.stringify(opportunity, null, 2));

  // If status is being updated to Review, set internalDeadline
  if (data.status === 'Review') {
    console.log('DEBUG: Status changing to Review, setting internal deadline');
    data.internalDeadline = sub(new Date(opportunity.dueDate), { days: 3 });
  }

  // Update the opportunity in memory
  const updatedOpportunity = {
    ...opportunity,
    ...data,
    updatedAt: new Date(),
  };
  opportunities[oppIndex] = updatedOpportunity;
  console.log('DEBUG: Updated opportunity in memory:', JSON.stringify(updatedOpportunity, null, 2));
  console.log('DEBUG: Current opportunities array:', JSON.stringify(opportunities, null, 2));

  // Validate the updated opportunity
  try {
    opportunitySchema.parse(updatedOpportunity);
    console.log('DEBUG: Updated opportunity validated successfully');
    return NextResponse.json(updatedOpportunity);
  } catch (error) {
    console.error('DEBUG: Validation error:', error);
    return NextResponse.json(
      { error: 'Invalid opportunity data' },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const oppIndex = opportunities.findIndex((opp) => opp.id === id);

  if (oppIndex === -1) {
    return NextResponse.json(
      { error: 'Opportunity not found' },
      { status: 404 }
    );
  }

  // Remove from mock database
  opportunities.splice(oppIndex, 1);

  return new NextResponse(null, { status: 204 });
} 