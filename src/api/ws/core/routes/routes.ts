import driver from '@domain/driver/driver.service';

import { bcryptService } from '@infrastructure/crypto';
import { context, pool } from '@infrastructure/db/pg';

import { GetAllDriversParams, GetAllDriversParamsSchema, WsMessage } from './routes.types';

const db = context(pool);
const bcrypt = bcryptService();

export const driverService = async () => {
  const session = await db.connect();
  return driver({ db: session, bcrypt });
};

export const routes = {
  getAllDrivers: async (params: GetAllDriversParams) => {
    await GetAllDriversParamsSchema.parseAsync(params);

    const service = await driverService();
    const drivers = await service.getAll();

    return drivers;
  },
};

export const handleMessage = async (msg: WsMessage): Promise<object> => {
  if (msg.query in routes) {
    return await routes[msg.query](msg.params);
  }

  throw new Error('Invalid query');
};
