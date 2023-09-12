import { Driver, driverService as driver } from '@domain/driver';

import { bcryptService } from '@infrastructure/crypto';
import { context, pool } from '@infrastructure/db/pg';

import { DriverLoginRequestBody, DriverLoginSchema } from '@api/http/controller/driver/driver.dto';

import { jwtWsService } from '../services';
import { GetAllDriversParams, GetAllDriversParamsSchema, IWsMessage, WsHandlerResult } from './routes.types';

const db = context(pool);
const bcrypt = bcryptService();

export const driverService = async () => {
  const session = await db.connect();
  return driver({ db: session, bcrypt });
};

export const routes = {
  getAllDrivers: async (params: GetAllDriversParams): WsHandlerResult<Driver[]> => {
    await GetAllDriversParamsSchema.parseAsync(params);

    const service = await driverService();
    const drivers = await service.getAll();

    return { data: drivers, status: 200, event: 'getAllDrivers' };
  },

  login: async (params: DriverLoginRequestBody): WsHandlerResult<{ token: string }> => {
    await DriverLoginSchema.parseAsync(params);

    const service = await driverService();
    const driver = await service.authenticate(params.email, params.password);

    const token = await jwtWsService.createToken({
      id: driver.id,
      email: driver.email,
    });

    return { data: { token }, status: 200, event: 'login' };
  },
};

export const handleMessage = async (msg: IWsMessage): WsHandlerResult<object> => {
  if (msg.query in routes) {
    return await routes[msg.query](msg.params);
  }

  throw new Error('Invalid query');
};
