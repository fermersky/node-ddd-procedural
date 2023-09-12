import fastify from 'fastify';

import { appConfig } from '@infrastructure/config';

import routes from './core/routes';

const app = fastify();

app.register(routes);

app.addHook('onReady', (done) => {
  console.log(`HTTP server is running on port ${appConfig.httpPort} 🚀`);
  console.dir(appConfig);

  done();
});

export default app;
