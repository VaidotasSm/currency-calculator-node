import lolex, { InstalledClock } from 'lolex';
import moment from 'moment';
import nock from 'nock';
import { mockExchangeRateApiCall } from '../lib/test.utils';
import { clearCache } from './rate.cache';
import { getRate, SupportedCurrency } from './rate.service';

describe('rate.service', () => {
  afterEach(() => {
    clearCache();
    nock.cleanAll();
  });

  test.each([
    [SupportedCurrency.EUR, SupportedCurrency.EUR, 1],
    [SupportedCurrency.EUR, SupportedCurrency.EUR, 1],
    [SupportedCurrency.GBP, SupportedCurrency.GBP, 1],
    [SupportedCurrency.USD, SupportedCurrency.USD, 1],
    [SupportedCurrency.ILS, SupportedCurrency.ILS, 1],
  ])('should handle same currency - %p -> %p', async (from, to, expectedRate) => {
    const rate = await getRate(from, to);
    expect(rate).toBe(expectedRate);
  });

  test.each([
    [SupportedCurrency.EUR, SupportedCurrency.GBP, 0.90968],
    [SupportedCurrency.EUR, SupportedCurrency.ILS, 4.0021],
    [SupportedCurrency.EUR, SupportedCurrency.USD, 1.1717],
    [SupportedCurrency.GBP, SupportedCurrency.EUR, 1.0992876615952862],
    [SupportedCurrency.ILS, SupportedCurrency.EUR, 0.24986881887009318],
    [SupportedCurrency.USD, SupportedCurrency.EUR, 0.8534607834769993],
    [SupportedCurrency.GBP, SupportedCurrency.ILS, 4.399459150470495],
    [SupportedCurrency.GBP, SupportedCurrency.USD, 1.2880353530911968],
    [SupportedCurrency.USD, SupportedCurrency.GBP, 0.7763762055133567],
    [SupportedCurrency.USD, SupportedCurrency.ILS, 3.415635401553299],
    [SupportedCurrency.ILS, SupportedCurrency.GBP, 0.22730066714974637],
    [SupportedCurrency.ILS, SupportedCurrency.USD, 0.29277129507008814],
  ])('should convert - %p -> %p', async (from, to, expectedRate) => {
    nock.cleanAll();
    const scope = mockExchangeRateApiCall();
    const rate = await getRate(from, to);

    expect(scope.isDone()).toBe(true);
    expect(rate).toBe(expectedRate);
  });

  describe('cache', () => {
    let clock: InstalledClock;

    beforeEach(() => {
      clock = lolex.install();
    });

    afterEach(() => {
      clock.uninstall();
    });

    test('should use cached rates when todays cache', async () => {
      const scope1 = mockExchangeRateApiCall();
      const scope2 = mockExchangeRateApiCall();

      await getRate(SupportedCurrency.USD, SupportedCurrency.ILS);
      await getRate(SupportedCurrency.USD, SupportedCurrency.GBP);

      expect(scope1.isDone()).toBe(true);
      expect(scope2.isDone()).toBe(false);
    });

    test('should use cached rates when previous day cache but refresh time not expired', async () => {
      const scope1 = mockExchangeRateApiCall({
        date: moment().subtract(1, 'days').format('YYYY-MM-DD'),
      });
      const scope2 = mockExchangeRateApiCall();

      await getRate(SupportedCurrency.USD, SupportedCurrency.ILS);
      clock.tick('00:59:00');
      await getRate(SupportedCurrency.USD, SupportedCurrency.GBP);

      expect(scope1.isDone()).toBe(true);
      expect(scope2.isDone()).toBe(false);
    });

    test('should refresh cached rates when previous day cache and refresh time expired', async () => {
      const scope1 = mockExchangeRateApiCall({
        date: moment().subtract(1, 'days').format('YYYY-MM-DD'),
      });
      const scope2 = mockExchangeRateApiCall();

      await getRate(SupportedCurrency.USD, SupportedCurrency.ILS);
      clock.tick('01:01:00');
      await getRate(SupportedCurrency.USD, SupportedCurrency.GBP);

      expect(scope1.isDone()).toBe(true);
      expect(scope2.isDone()).toBe(true);
    });
  });
});
