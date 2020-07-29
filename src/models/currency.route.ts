import { Router, Request } from 'express';
import { isNil } from 'lodash';
import { isSupportedCurrency, convertCurrency, SupportedCurrency } from './rate.service';
import { clearCache } from './rate.cache';

const currencyRouter = Router();

currencyRouter.get('/', async (req, res) => {
  let parseResult;
  try {
    parseResult = parseRequestParams(req);
  } catch (errorFields) {
    return res.status(400).json({
      message: 'Incorrect request',
      fields: errorFields,
    });
  }

  const { from, to, amount: amountParam } = parseResult;
  const { exchangeRate, amount } = await convertCurrency(from, to, amountParam);
  return res.status(200).json({
    exchange_rate: exchangeRate,
    quote_amount: amount,
  });
});

function parseRequestParams(req: Request): { from: SupportedCurrency; to: SupportedCurrency; amount: number } {
  const from = req.query.base_currency;
  const to = req.query.quote_currency;
  const amount: number | false = !isNil(req.query.base_amount) && parseInt(req.query.base_amount as string, 10);

  if (isSupportedCurrency(from) && isSupportedCurrency(to) && (amount || amount === 0)) {
    return {
      from,
      to,
      amount,
    };
  }

  const errorFields: any = {};
  if (!amount) {
    errorFields.base_amount = 'Incorrect amount for "base_amount"';
  }
  if (!isSupportedCurrency(from)) {
    errorFields.base_currency = 'Not supported currency for "base_currency"';
  }
  if (!isSupportedCurrency(to)) {
    errorFields.quote_currency = 'Not supported currency for "quote_currency"';
  }
  throw errorFields;
}

currencyRouter.delete('/cache', () => {
  clearCache();
});

export { currencyRouter };
