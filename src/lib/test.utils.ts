import moment from 'moment';
import nock from 'nock';
import { CurrencyRates } from '../models/rate.cache';

export function mockExchangeRateApiCall(responseOverride: Partial<CurrencyRates> = {}): nock.Scope {
  const scope = nock('https://api.exchangeratesapi.io')
    .get('/latest?base=EUR')
    .reply(
      200,
      {
        rates: {
          USD: 1.1717,
          GBP: 0.90968,
          ILS: 4.0021,
        },
        base: 'EUR',
        date: moment().format('YYYY-MM-DD'),
        ...responseOverride
      }
    );
  return scope;
}
