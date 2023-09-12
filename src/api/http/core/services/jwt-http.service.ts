import { FastifyRequest } from 'fastify';

import { IDriverJwtPayload, IJwtValidationService } from '@api/shared/services/jwt-validation.service';

import { HttpUnauthorized } from '../http.errors';

interface IJwtHttpServiceDeps {
  jwt: IJwtValidationService;
}

export interface IJwtHttpService {
  validateRequest<T = IDriverJwtPayload>(req: FastifyRequest): Promise<T>;
  createToken<T extends object>(payload: T): Promise<string>;
}

export default function jwtHttpService({ jwt }: IJwtHttpServiceDeps): IJwtHttpService {
  return {
    async validateRequest<T>(req: FastifyRequest): Promise<T> {
      try {
        const token = req.headers['authorization']?.split(' ')[1];

        if (token == null) {
          throw new HttpUnauthorized('Token is missing');
        }

        const tokenValid = await jwt.validateToken(token);

        return tokenValid as T;
      } catch (error) {
        console.log(error);

        throw new HttpUnauthorized('Token verification failed');
      }
    },

    async createToken(payload) {
      return await jwt.createToken(payload);
    },
  };
}
