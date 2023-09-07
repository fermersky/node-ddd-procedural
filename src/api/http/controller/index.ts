import driver from '@domain/driver/driver.service';

import { appConfig } from '@infrastructure/config';
import { bcryptService, jwtService } from '@infrastructure/crypto';
import context from '@infrastructure/db/pg/context';
import pool from '@infrastructure/db/pg/pool';

import jwtHttpService from '../core/services/jwt-http.service';
import driverHttpController from './driver/driver.controller';

// infrastructure
const db = context(pool);
const bcrypt = bcryptService();

// application services
const jwt = jwtHttpService({ jwt: jwtService(), appConfig });

// http controllers
export const driverController = async () => {
  const session = await db.connect();
  const driverService = driver({ db: session, bcrypt });

  return driverHttpController({ jwt, driverService });
};
