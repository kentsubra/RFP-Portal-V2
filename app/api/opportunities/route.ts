import { NextResponse } from 'next/server';
import { opportunities } from './data';

export async function GET() {
  return NextResponse.json(opportunities);
}

export async function POST(request: Request) {
  const data = await request.json();
  
  // In a real app, validate data and save to database
  const newOpportunity = {
    ...data,
    id: Date.now().toString(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  // Add to shared array for completeness (not used in E2E)
  opportunities.push(newOpportunity);
  return NextResponse.json({ id: newOpportunity.id }, { status: 201 });
}

// Individual opportunity route handlers will be in [id]/route.ts 