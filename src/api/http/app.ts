import fastify from 'fastify';

import { appConfig } from '@infrastructure/config';

import routes from './core/routes';

const app = fastify();

app.register(routes);

app.addHook('onReady', () => {
  console.log(`server is running on port ${appConfig.httpPort} 🚀`);
  console.dir(appConfig);
});

export default app;
