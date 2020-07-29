import config from 'config';
import express, { Request, Response, NextFunction } from 'express';
import { info } from './lib/logger';
import { currencyRouter } from './models/currency.route';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/quote', currencyRouter);

app.use((_req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (!err) {
    return next();
  }
  return res.status(500).json({ message: 'Something went wrong' });
});

export { app };
