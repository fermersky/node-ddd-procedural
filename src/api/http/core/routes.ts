import { FastifyInstance } from 'fastify';

import { appConfig } from '@infrastructure/config';

import { driverController } from '../controller';
import { ApiHandler } from './handlers';

const logger = console;
const logging = appConfig.httpLogging;

export default async function routes(app: FastifyInstance) {
  app.get('/drivers', async (req, res) => {
    const controller = await driverController();
    await ApiHandler(req, res, { logging, logger })(controller.getAll);
  });

  app.post('/driver/login', async (req, res) => {
    const controller = await driverController();
    await ApiHandler(req, res, { logging, logger })(controller.login);
  });

  app.get('/driver/me', async (req, res) => {
    const controller = await driverController();
    await ApiHandler(req, res, { logging, logger })(controller.me);
  });
}
