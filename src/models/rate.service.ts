import BigNumber from 'bignumber.js';
import { get } from '../lib/httpClient';

export enum SupportedCurrency {
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
  ILS = 'ILS',
}

const API_URL = 'https://api.exchangeratesapi.io/latest';
const BaseCurrency = SupportedCurrency.EUR;
const fullUrl = `${API_URL}?base=${SupportedCurrency.EUR}`;

const supportedCurrencies = Object.values(SupportedCurrency);

export function isSupportedCurrency(currency: any): currency is SupportedCurrency {
  if (typeof currency !== 'string') {
    return false;
  }
  return !!supportedCurrencies.find((c) => c === currency);
}

export async function convertCurrency(
  from: SupportedCurrency,
  to: SupportedCurrency,
  amountCents: number
): Promise<{ exchangeRate: number; amount: number }> {
  const rate = await getRate(from, to);
  return {
    exchangeRate: rate,
    amount: new BigNumber(amountCents).multipliedBy(rate).toNumber(),
  };
}

export async function getRate(from: SupportedCurrency, to: SupportedCurrency): Promise<number> {
  const { body } = await get<CurrencyRatesResponse>(fullUrl);
  if (from === to) {
    return 1;
  }
  if (from === BaseCurrency) {
    return fromBase(body, to);
  }
  if (to === BaseCurrency) {
    return toBase(body, from);
  }

  const rate1b = new BigNumber(toBase(body, from));
  const rate2b = new BigNumber(toBase(body, to));
  return rate1b.dividedBy(rate2b).toNumber();
}

function fromBase(rates: CurrencyRatesResponse, to: SupportedCurrency): number {
  if (to === BaseCurrency) {
    return 1;
  }
  return rates.rates[to]!;
}

function toBase(rates: CurrencyRatesResponse, from: SupportedCurrency): number {
  if (from === BaseCurrency) {
    return 1;
  }
  return 1 / rates.rates[from]!;
}

interface CurrencyRatesResponse {
  rates: {
    [key in SupportedCurrency]?: number;
  };
  base: SupportedCurrency;
  date: string;
}
