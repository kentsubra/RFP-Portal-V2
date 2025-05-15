import { http, HttpResponse } from 'msw';

const mockOpportunity = {
  id: 'mock-id',
  name: 'Mock Opportunity',
  client: 'Acme Corp',
  status: 'New',
  value: 50000,
};

export const handlers = [
  // GET list for dashboard
  http.get('/api/opportunities', () => {
    return HttpResponse.json([mockOpportunity]);
  }),

  // POST new opportunity
  http.post('/api/opportunities', () => {
    return HttpResponse.json({ id: 'mock-id' }, { status: 201 });
  }),

  // PATCH opportunity
  http.patch('/api/opportunities/:id', () => {
    return new HttpResponse(null, { status: 200 });
  }),
]; 