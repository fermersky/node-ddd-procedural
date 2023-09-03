import { FastifyInstance } from 'fastify';

import { appConfig } from '@infrastructure/config';

import { driverController } from '../controller';
import { ApiHandler } from './handlers';

const logger = console;
const logging = appConfig.httpLogging;

export default async function routes(app: FastifyInstance) {
  app.get('/drivers', async (req, res) => {
    await ApiHandler(req, res, { logging, logger })(driverController.getAll);
  });

  app.post('/driver/login', async (req, res) => {
    await ApiHandler(req, res, { logging, logger })(driverController.login);
  });

  app.get('/driver/me', async (req, res) => {
    await ApiHandler(req, res, { logging, logger })(driverController.me);
  });
}
