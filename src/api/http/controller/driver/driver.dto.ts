import { z } from 'zod';

import { Driver } from '@domain/driver';

export const GetDriverSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  firstName: z.string(),
  lastName: z.string(),
  workShifts: z
    .array(
      z.object({
        id: z.string(),
        start: z.string(),
        end: z.string(),
      }),
    )
    .optional(),
});

export const GetDriversSchema = z.array(GetDriverSchema);

export type GetDriverResponseBody = z.infer<typeof GetDriverSchema>;

export type GetDriversResponseBody = GetDriverResponseBody[];

export function fromDomain(driver: Driver): GetDriverResponseBody {
  let workShifts = undefined;

  if (driver.workShifts) {
    workShifts = driver.workShifts.map((ws) => ({
      id: ws.id,
      start: ws.start,
      end: ws.end,
      driverId: ws.driverId,
    }));
  }
  return {
    id: driver.id,
    firstName: driver.firstName,
    lastName: driver.lastName,
    email: driver.email,
    phone: driver.phone,
    workShifts,
  };
}

export const DriverLoginResponseSchema = z.object({
  token: z.string(),
});

export type DriverLoginResponseBody = z.infer<typeof DriverLoginResponseSchema>;

export const DriverLoginSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export type DriverLoginRequestBody = z.infer<typeof DriverLoginSchema>;
