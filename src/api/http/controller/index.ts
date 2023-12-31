import driver from '@domain/driver/driver.service';

import { bcryptService } from '@infrastructure/crypto';
import { context, pool } from '@infrastructure/db/pg';

import { jwtHttpService } from '../core/services';
import driverHttpController from './driver/driver.controller';

// infrastructure
const db = context(pool);
const bcrypt = bcryptService();

// http controllers
export const driverController = async () => {
  const session = await db.connect();
  const driverService = driver({ db: session, bcrypt });

  return driverHttpController({ jwt: jwtHttpService, driverService });
};
