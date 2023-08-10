import { z } from 'zod';

import { Driver } from '@domain/driver';

const GetDriverSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  first_name: z.string(),
  last_name: z.string(),
});

export type GetDriverResponseBody = z.infer<typeof GetDriverSchema>;

export type GetDriversResponseBody = GetDriverResponseBody[];

export function fromDomain(driver: Driver): GetDriverResponseBody {
  return {
    id: driver.id,
    first_name: driver.first_name,
    last_name: driver.last_name,
    email: driver.email,
    phone: driver.phone,
  };
}

const DriverLoginResponseSchema = z.object({
  token: z.string(),
});

export type DriverLoginResponseBody = z.infer<typeof DriverLoginResponseSchema>;

export const DriverSignInSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export type DriverSignInRequestBody = z.infer<typeof DriverSignInSchema>;
