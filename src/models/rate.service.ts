import BigNumber from 'bignumber.js';
import { CurrencyRates, getCurrencyRates } from './rate.cache';

export enum SupportedCurrency {
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
  ILS = 'ILS',
}

const BaseCurrency = SupportedCurrency.EUR;

const supportedCurrencies = Object.values(SupportedCurrency);

export async function convertCurrency(
  from: SupportedCurrency,
  to: SupportedCurrency,
  amountCents: number
): Promise<{ exchangeRate: number; amountCents: number }> {
  const rate = await getRate(from, to);
  return {
    exchangeRate: rate,
    amountCents: Math.floor(new BigNumber(amountCents).multipliedBy(rate).toNumber()),
  };
}

export async function getRate(from: SupportedCurrency, to: SupportedCurrency): Promise<number> {
  if (from === to) {
    return 1;
  }

  const rates = await getCurrencyRates(BaseCurrency);
  if (from === BaseCurrency) {
    return fromBase(rates, to);
  }
  if (to === BaseCurrency) {
    return toBase(rates, from);
  }

  const rateFrom = new BigNumber(toBase(rates, from));
  const rateTo = new BigNumber(toBase(rates, to));
  return rateFrom.dividedBy(rateTo).toNumber();
}

function fromBase(rates: CurrencyRates, to: SupportedCurrency): number {
  if (to === BaseCurrency) {
    return 1;
  }
  return rates.rates[to]!;
}

function toBase(rates: CurrencyRates, from: SupportedCurrency): number {
  if (from === BaseCurrency) {
    return 1;
  }
  return 1 / rates.rates[from]!;
}

export function isSupportedCurrency(currency: any): currency is SupportedCurrency {
  if (typeof currency !== 'string') {
    return false;
  }
  return !!supportedCurrencies.find((c) => c === currency);
}
