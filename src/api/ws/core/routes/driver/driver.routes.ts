import { IDriverJwtPayload } from '@api/shared/services';

import { jwtWsService } from '../../services';
import {
  DriverLoginSchema,
  DriverMeSchema,
  GetAllDriversParamsSchema,
  IWsDriverRouteHandlers,
  fromDomain,
} from './driver.routes.types';

export const driverRoutes: IWsDriverRouteHandlers = {
  getAllDrivers: async (params, { driverService }) => {
    await GetAllDriversParamsSchema.parseAsync(params);

    const drivers = await driverService.getAll();

    return { data: drivers.map(fromDomain), status: 200, event: 'getAllDrivers' };
  },

  login: async (params, { driverService }) => {
    await DriverLoginSchema.parseAsync(params);

    const driver = await driverService.authenticate(params.email, params.password);

    const token = await jwtWsService.createToken({
      id: driver.id,
      email: driver.email,
    });

    return { data: { token }, status: 200, event: 'login' };
  },

  me: async (params, { driverService, jwt, appConfig }) => {
    await DriverMeSchema.parseAsync(params);

    const { email } = await jwt.verify<IDriverJwtPayload>(params.token, appConfig.jwtSecret);
    const driver = await driverService.findByEmail(email);

    return { data: fromDomain(driver), status: 200, event: 'me' };
  },
};
