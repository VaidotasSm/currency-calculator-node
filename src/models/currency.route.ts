import { Router } from 'express';
import { isNil } from 'lodash';
import { isSupportedCurrency, convertCurrency } from './rate.service';

const currencyRouter = Router();

currencyRouter.get('/', async (req, res) => {
  const currencyFrom = req.query.base_currency;
  const currencyTo = req.query.quote_currency;
  const amountCents: number | false = !isNil(req.query.base_amount) && parseInt(req.query.base_amount as string, 10);

  if (!amountCents) {
    return res.status(400).json({ message: 'Incorrect amount for "base_amount"' });
  }
  if (!isSupportedCurrency(currencyFrom)) {
    return res.status(400).json({ message: 'Not supported currency for "base_currency"' });
  }
  if (!isSupportedCurrency(currencyTo)) {
    return res.status(400).json({ message: 'Not supported currency for "quote_currency"' });
  }

  const { exchangeRate, amount } = await convertCurrency(currencyFrom, currencyTo, amountCents);
  return res.status(200).json({
    exchange_rate: exchangeRate,
    quote_amount: amount,
  });
});

export { currencyRouter };
