import { AppConfig } from '@infrastructure/config';
import { IJwtService } from '@infrastructure/crypto/jwt.service';

export interface IDriverJwtPayload {
  email: string;
  id: string;
}

interface IJwtValidationServiceDeps {
  jwt: IJwtService;
  appConfig: AppConfig;
}

export interface IJwtValidationService {
  validateToken<T = IDriverJwtPayload>(token: string): Promise<T>;
  createToken<T extends object>(payload: T): Promise<string>;
}

export default function ({ jwt, appConfig }: IJwtValidationServiceDeps): IJwtValidationService {
  return {
    async validateToken<T>(token: string): Promise<T> {
      try {
        const tokenValid = await jwt.verify(token, appConfig.jwtSecret);

        if (!tokenValid) {
          throw new Error('Token verification failed');
        }

        return tokenValid as T;
      } catch (error) {
        console.log(error);

        throw new Error('Token verification failed');
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
