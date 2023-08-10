import { FastifyRequest } from 'fastify';

import { IDriverService } from '@domain/driver';

import { IDriverJwtPayload, IJwtHttpService } from '../core/services/jwt-http.service';
import {
  DriverLoginResponseBody,
  DriverSignInSchema,
  GetDriverResponseBody,
  GetDriversResponseBody,
  fromDomain,
} from '../dto/driver.dto';

interface IDriverControllerDeps {
  driverService: IDriverService;
  jwt: IJwtHttpService;
}

export default function ({ driverService, jwt }: IDriverControllerDeps) {
  return {
    async getAll(req: FastifyRequest): Promise<GetDriversResponseBody> {
      await jwt.validateRequest<IDriverJwtPayload>(req);

      const drivers = await driverService.getAll();

      return drivers.map(fromDomain);
    },

    async me(req: FastifyRequest): Promise<GetDriverResponseBody> {
      const { email } = await jwt.validateRequest(req);

      const driver = await driverService.findByEmail(email);

      return fromDomain(driver);
    },

    async login(req: FastifyRequest): Promise<DriverLoginResponseBody> {
      const { email, password } = await DriverSignInSchema.parseAsync(req.body);

      const driver = await driverService.authenticate(email, password);

      const token = await jwt.createToken({
        id: driver.id,
        email: driver.email,
      });

      return { token };
    },
  };
}
