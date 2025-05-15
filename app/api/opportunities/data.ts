let opportunities = [
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
    status: 'New',
    createdAt: new Date('2023-05-15'),
    updatedAt: new Date('2023-05-20'),
  },
];

export function getOpportunities() {
  return opportunities;
}

export function resetOpportunities() {
  opportunities = [
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
      status: 'New',
      createdAt: new Date('2023-05-15'),
      updatedAt: new Date('2023-05-20'),
    },
  ];
}

export { opportunities }; 