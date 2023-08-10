import fastify from 'fastify';

import { appConfig } from '@infrastructure/config';

import routes from './core/routes';

const app = fastify();

app.register(routes);

app.addHook('onReady', () => {
  console.log(`server is running on port ${appConfig.HTTP_PORT} 🚀`);
  console.log(appConfig);
});

app.listen({ port: appConfig.HTTP_PORT });

export default app;
