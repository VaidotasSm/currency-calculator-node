import request from 'supertest';
import nock from 'nock';
import { app } from '../app';
import { mockExchangeRateApiCall } from '../lib/test.utils';

describe('/quote', () => {
  describe('Non-Happy Path', () => {
    it('should detect incorrect base_currency', async () => {
      const res = await request(app)
        .get('/quote')
        .query({ base_currency: 'EUR1', quote_currency: 'USD', base_amount: 100 });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ message: 'Not supported currency for "base_currency"' });
    });

    it('should detect incorrect quote_currency', async () => {
      const res = await request(app)
        .get('/quote')
        .query({ base_currency: 'EUR', quote_currency: 'USD1', base_amount: 100 });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ message: 'Not supported currency for "quote_currency"' });
    });

    it('should detect incorrect base_currency', async () => {
      const res = await request(app)
        .get('/quote')
        .query({ base_currency: 'EUR', quote_currency: 'USD', base_amount: 'WRONG AMOUNT' });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ message: 'Incorrect amount for "base_amount"' });
    });
  });

  describe('Happy Path', () => {
    it('should convert same currency', async () => {
      const res = await request(app)
        .get('/quote')
        .query({ base_currency: 'USD', quote_currency: 'USD', base_amount: 100 });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ exchange_rate: 1, quote_amount: 100 });
    });

    it.only('should convert different currency', async () => {
      const scope = mockExchangeRateApiCall();
      const res = await request(app)
        .get('/quote')
        .query({ base_currency: 'EUR', quote_currency: 'USD', base_amount: 100 });

      expect(scope.isDone()).toBe(true);
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ exchange_rate: 1.1717, quote_amount: 100 * 1.1717 });
    });
  });
});
