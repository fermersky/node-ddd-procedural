import 'dotenv/config';
import { z } from 'zod';

const EnvSchema = z.object({
  HTTP_LOGGING: z.boolean().default(false),
  HTTP_PORT: z.number().default(8000),
  JWT_SECRET: z.string(),
});

export type Config = z.infer<typeof EnvSchema>;

function getConfig(overrides?: any): Config {
  const envs = EnvSchema.parse({
    HTTP_LOGGING: process.env['HTTP_LOGGING'] === 'true' ? true : false,
    JWT_SECRET: process.env['JWT_SECRET'],
    HTTP_PORT: Number(process.env['HTTP_PORT']),
  });

  return envs;
}

export const appConfig = getConfig();
