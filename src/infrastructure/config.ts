import 'dotenv/config';
import { z } from 'zod';

const EnvSchema = z.object({
  HTTP_LOGGING: z.string().default('false'),
  HTTP_PORT: z.coerce.number().default(8000),
  JWT_SECRET: z.string(),
});

export interface AppConfig {
  httpLogging: boolean;
  httpPort: number;
  jwtSecret: string;
}

function getConfig(): AppConfig {
  const envs = EnvSchema.parse(process.env);

  return {
    httpLogging: envs.HTTP_LOGGING === 'true' ? true : false,
    httpPort: Number(envs.HTTP_PORT),

    // secret envs should be wrapped by getters not to show them when do `console.log(config)`
    get jwtSecret(): string {
      return envs.JWT_SECRET;
    },
  };
}

export const appConfig = getConfig();
