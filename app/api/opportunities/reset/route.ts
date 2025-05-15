import { NextResponse } from 'next/server';
import { resetOpportunities } from '../data';

export async function POST() {
  resetOpportunities();
  return NextResponse.json({ ok: true });
} 