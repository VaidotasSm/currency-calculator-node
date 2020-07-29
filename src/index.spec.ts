import request from 'supertest';
import { app } from './app';

describe('/', () => {
  it('should handle non existing route', async () => {
    const res = await request(app).get('/non-existing');

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: 'Not found' });
  });
});
