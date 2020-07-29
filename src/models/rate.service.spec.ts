import { SupportedCurrency, getRate } from './rate.service';
import { mockExchangeRateApiCall } from '../lib/test.utils';

describe('rate.service', () => {
  test.each([
    [SupportedCurrency.EUR, SupportedCurrency.EUR, 1],
    [SupportedCurrency.EUR, SupportedCurrency.GBP, 0.90968],
    [SupportedCurrency.EUR, SupportedCurrency.ILS, 4.0021],
    [SupportedCurrency.EUR, SupportedCurrency.USD, 1.1717],
    [SupportedCurrency.EUR, SupportedCurrency.EUR, 1],
    [SupportedCurrency.GBP, SupportedCurrency.EUR, 1.0992876615952862],
    [SupportedCurrency.ILS, SupportedCurrency.EUR, 0.24986881887009318],
    [SupportedCurrency.USD, SupportedCurrency.EUR, 0.8534607834769993],
    [SupportedCurrency.GBP, SupportedCurrency.ILS, 4.399459150470495],
    [SupportedCurrency.GBP, SupportedCurrency.USD, 1.2880353530911968],
    [SupportedCurrency.GBP, SupportedCurrency.GBP, 1],
    [SupportedCurrency.USD, SupportedCurrency.GBP, 0.7763762055133567],
    [SupportedCurrency.USD, SupportedCurrency.ILS, 3.415635401553299],
    [SupportedCurrency.USD, SupportedCurrency.USD, 1],
    [SupportedCurrency.ILS, SupportedCurrency.GBP, 0.22730066714974637],
    [SupportedCurrency.ILS, SupportedCurrency.USD, 0.29277129507008814],
    [SupportedCurrency.ILS, SupportedCurrency.ILS, 1],
  ])('should convert - %p -> %p', async (from, to, expectedRate) => {
    const scope = mockExchangeRateApiCall();
    const rate = await getRate(from, to);
    expect(scope.isDone()).toBe(true);
    expect(rate).toBe(expectedRate);
  });
});
