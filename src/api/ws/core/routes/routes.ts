import { driverService as driver } from '@domain/driver';

import { bcryptService } from '@infrastructure/crypto';
import { context, pool } from '@infrastructure/db/pg';

import { driverRoutes } from './driver/driver.routes';
import {
  IWsDriverRouteHandlers,
  IWsIncomingMessage,
  IWsWorkShiftRouteHandlers,
  WsHandlerResult,
} from './driver/driver.routes.types';

const db = context(pool);
const bcrypt = bcryptService();

export type WsRouteHandlers = IWsWorkShiftRouteHandlers | IWsDriverRouteHandlers; // & other route handlers;

export const routes: WsRouteHandlers = { ...driverRoutes };

export const handleMessage = async (msg: IWsIncomingMessage): WsHandlerResult<object, string> => {
  const session = await db.connect();
  const driverService = driver({ db: session, bcrypt });

  if (msg.query in driverRoutes) {
    return await driverRoutes[msg.query as keyof IWsDriverRouteHandlers](msg.params, { driverService });
  }

  throw new Error('Invalid query');
};
