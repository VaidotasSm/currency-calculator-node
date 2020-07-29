import config from 'config';
import { app } from './app';
import { info } from './lib/logger';

const appHandle = app.listen(config.get('app.port'), () => {
  info('Started...');
});

export { appHandle };
