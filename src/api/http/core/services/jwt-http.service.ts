import { FastifyRequest } from 'fastify';

import { Config } from '@infrastructure/config';
import { IJwtService } from '@infrastructure/crypto';

import { HttpUnauthorized } from '../http.errors';

export interface IDriverJwtPayload {
  email: string;
  id: string;
}

interface IJwtHttpServiceDeps {
  jwt: IJwtService;
  appConfig: Config;
}

export interface IJwtHttpService {
  validateRequest<T extends IDriverJwtPayload>(req: FastifyRequest): Promise<T>;
  createToken<T extends IDriverJwtPayload>(payload: T): Promise<string>;
}

export default function ({ jwt, appConfig }: IJwtHttpServiceDeps): IJwtHttpService {
  return {
    async validateRequest<T extends IDriverJwtPayload>(req: FastifyRequest): Promise<T> {
      try {
        const token = req.headers['authorization']?.split(' ')[1];

        if (token == null) {
          throw new HttpUnauthorized('Token is missing');
        }

        const tokenValid = await jwt.verify(token, appConfig.JWT_SECRET);

        if (!tokenValid) {
          throw new HttpUnauthorized('Token verification failed');
        }

        return tokenValid as T;
      } catch (error) {
        console.log(error);

        throw new HttpUnauthorized('Token verification failed');
      }
    },

    async createToken<T extends IDriverJwtPayload>(payload: T): Promise<string> {
      const token = await jwt.sign(payload, appConfig.JWT_SECRET, {
        expiresIn: Date.now() + 15 * 60 * 1000,
      });

      return token as string;
    },
  };
}
