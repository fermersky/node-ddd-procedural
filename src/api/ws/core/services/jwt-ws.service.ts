import uWS from 'uWebSockets.js';

import { IDriverJwtPayload, IJwtValidationService } from '@api/shared/services';

interface IJwtWsServiceDeps {
  jwt: IJwtValidationService;
}

export interface IJwtHttpService {
  validateRequest<T = IDriverJwtPayload>(req: uWS.HttpRequest): Promise<T>;
  createToken<T extends object>(payload: T): Promise<string>;
}

export default function ({ jwt }: IJwtWsServiceDeps): IJwtHttpService {
  return {
    async validateRequest<T>(req: uWS.HttpRequest): Promise<T> {
      try {
        const token = req.getHeader('authorization')?.split(' ')[1];

        if (token == null) {
          throw new Error('Token is missing');
        }

        const tokenValid = await jwt.validateToken(token);

        return tokenValid as T;
      } catch (error) {
        console.log(error);

        throw new Error('Token verification failed');
      }
    },

    async createToken(payload) {
      return await jwt.createToken(payload);
    },
  };
}
