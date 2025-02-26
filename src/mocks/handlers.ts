import { http, HttpResponse } from 'msw';
import { mockUsers, mockActivities, mockSubmissions } from './mockData';

export const handlers = [
  // Auth endpoints
  http.post('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword', async () => {
    return HttpResponse.json({
      idToken: 'mock-id-token',
      email: 'test@example.com',
      refreshToken: 'mock-refresh-token',
      expiresIn: '3600',
      localId: 'user1',
    });
  }),

  // User endpoints
  http.get('*/users/:userId', async ({ params }) => {
    const user = mockUsers.find(u => u.id === params.userId);
    return HttpResponse.json(user || null);
  }),

  // Activities endpoints
  http.get('*/activities', async () => {
    return HttpResponse.json(mockActivities);
  }),

  // Submissions endpoints
  http.get('*/submissions', async () => {
    return HttpResponse.json(mockSubmissions);
  }),
];