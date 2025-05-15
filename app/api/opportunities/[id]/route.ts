import { NextResponse } from 'next/server';

// Mock data - same as in the parent route
const opportunities = [
  {
    id: '1',
    name: 'Enterprise CRM Implementation',
    client: 'Acme Corp',
    dueDate: new Date('2023-12-31'),
    value: 150000,
    priority: 'High',
    sbu: 'Enterprise Solutions',
    keyNotes: 'Key decision makers require ROI analysis',
    grossMargin: 25,
    assignedTo: 'Jane Smith',
    createdAt: new Date('2023-05-15'),
    updatedAt: new Date('2023-05-20'),
    status: 'Active',
  },
  {
    id: '2',
    name: 'Cloud Migration Project',
    client: 'TechGlobal',
    dueDate: new Date('2023-11-15'),
    value: 220000,
    priority: 'Medium',
    sbu: 'Cloud Services',
    keyNotes: 'Legacy system compatibility issues to address',
    grossMargin: 22,
    assignedTo: 'Michael Johnson',
    createdAt: new Date('2023-04-10'),
    updatedAt: new Date('2023-05-18'),
    status: 'Active',
  },
  {
    id: '3',
    name: 'Security Assessment',
    client: 'FinServ Inc',
    dueDate: new Date('2023-10-30'),
    value: 75000,
    priority: 'High',
    sbu: 'Security Solutions',
    keyNotes: 'Compliance with financial regulations required',
    grossMargin: 30,
    assignedTo: 'Sarah Williams',
    createdAt: new Date('2023-05-05'),
    updatedAt: new Date('2023-05-15'),
    status: 'Active',
  }
];

interface RequestContext {
  params: {
    id: string;
  };
}

export async function GET(request: Request, context: RequestContext) {
  const { id } = context.params;
  const opportunity = opportunities.find(o => o.id === id);
  
  if (!opportunity) {
    return NextResponse.json({ error: 'Opportunity not found' }, { status: 404 });
  }
  
  return NextResponse.json(opportunity);
}

export async function PATCH(request: Request, context: RequestContext) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id } = context.params;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const data = await request.json();
  
  // In a real app, validate data and update in database
  // For mock, we just return success
  
  return NextResponse.json({ success: true }, { status: 200 });
}

export async function DELETE(request: Request, context: RequestContext) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id } = context.params;
  
  // In a real app, delete from database
  // For mock, we just return success
  
  return NextResponse.json({ success: true }, { status: 200 });
} 