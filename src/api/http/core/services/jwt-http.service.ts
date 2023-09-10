import { FastifyRequest } from 'fastify';

import { AppConfig } from '@infrastructure/config';
import { IJwtService } from '@infrastructure/crypto/jwt.service';

import { HttpUnauthorized } from '../http.errors';

export interface IDriverJwtPayload {
  email: string;
  id: string;
}

interface IJwtHttpServiceDeps {
  jwt: IJwtService;
  appConfig: AppConfig;
}

export interface IJwtHttpService {
  validateRequest<T = IDriverJwtPayload>(req: FastifyRequest): Promise<T>;
  createToken<T extends object>(payload: T): Promise<string>;
}

export default function ({ jwt, appConfig }: IJwtHttpServiceDeps): IJwtHttpService {
  return {
    async validateRequest<T>(req: FastifyRequest): Promise<T> {
      try {
        const token = req.headers['authorization']?.split(' ')[1];

        if (token == null) {
          throw new HttpUnauthorized('Token is missing');
        }

        const tokenValid = await jwt.verify(token, appConfig.jwtSecret);

        if (!tokenValid) {
          throw new HttpUnauthorized('Token verification failed');
        }

        return tokenValid as T;
      } catch (error) {
        console.log(error);

        throw new HttpUnauthorized('Token verification failed');
      }
    },

    async createToken(payload) {
      const token = await jwt.sign(payload, appConfig.jwtSecret, {
        expiresIn: Date.now() + 15 * 60 * 1000,
      });

      return token as string;
    },
  };
}
