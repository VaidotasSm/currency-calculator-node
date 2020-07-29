import moment, { Moment } from 'moment';
import { get } from '../lib/httpClient';
import { SupportedCurrency, isSupportedCurrency } from './rate.service';

const API_URL = 'https://api.exchangeratesapi.io/latest';
const CACHE_DIFF_MINUTES = 60;

export interface CurrencyRates {
  rates: {
    [key in SupportedCurrency]?: number;
  };
  base: SupportedCurrency;
  date: string;
}

const currencyRatesCache: { [key in SupportedCurrency]?: { rates: CurrencyRates; updatedAt: Moment } } = {};

export async function getCurrencyRates(base: SupportedCurrency): Promise<CurrencyRates> {
  const cached = currencyRatesCache[base];
  if (!cached) {
    return fetchNewRates(base);
  }

  const now = moment();
  if (cached.rates.date === now.format('YYYY-MM-DD')) {
    return cached.rates;
  }

  if (cached.updatedAt && now.diff(cached.updatedAt, 'minutes') < CACHE_DIFF_MINUTES) {
    return cached.rates;
  }

  return fetchNewRates(base);
}

async function fetchNewRates(base: SupportedCurrency): Promise<CurrencyRates> {
  const fullUrl = `${API_URL}?base=${base}`;
  const { body } = await get<CurrencyRates>(fullUrl);

  currencyRatesCache[base] = { rates: body, updatedAt: moment() };
  return body;
}

export function clearCache() {
  Object.keys(currencyRatesCache).forEach((key) => {
    if (isSupportedCurrency(key)) {
      delete currencyRatesCache[key];
    }
  });
}
