import nock from 'nock';

export function mockExchangeRateApiCall(): nock.Scope {
  const scope = nock('https://api.exchangeratesapi.io')
    .get('/latest?base=EUR')
    .reply(200, {
      rates: {
        USD: 1.1717,
        GBP: 0.90968,
        ILS: 4.0021,
      },
      base: 'EUR',
      date: '2020-07-28',
    });
  return scope;
}
