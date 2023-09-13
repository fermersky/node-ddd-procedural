import { jwtWsService } from '../../services';
import { DriverLoginSchema, GetAllDriversParamsSchema, IWsDriverRouteHandlers } from './driver.routes.types';

export const driverRoutes: IWsDriverRouteHandlers = {
  getAllDrivers: async (params, { driverService }) => {
    await GetAllDriversParamsSchema.parseAsync(params);

    const drivers = await driverService.getAll();

    return { data: drivers, status: 200, event: 'getAllDrivers' };
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
};
