import { z } from 'zod';

import { Driver, IDriverService } from '@domain/driver';

export const WsMessageSchema = z.object({
  query: z.string(),
  params: z.any(),
});

export interface IWsIncomingMessage {
  params: any;
  query: string;
}

export interface IWsHandlerResult<TSchema, Q> {
  status: number;
  data: TSchema;
  event: Q;
}

export type WsHandlerResult<T, Q> = Promise<IWsHandlerResult<T, Q>>;

export const GetAllDriversParamsSchema = z.object({
  skip: z.number().default(0),
  take: z.number().default(5),
});

export type GetAllDriversParams = z.infer<typeof GetAllDriversParamsSchema>;

export interface IWsHandlerDeps {
  driverService: IDriverService;
}

export const DriverLoginSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export type DriverLoginParams = z.infer<typeof DriverLoginSchema>;

export type WsLoginHandler = (
  params: DriverLoginParams,
  deps: IWsHandlerDeps,
) => WsHandlerResult<{ token: string }, 'login'>;

export type WsGetAllDriversHandler = (
  params: GetAllDriversParams,
  deps: IWsHandlerDeps,
) => WsHandlerResult<GetDriverResult[], 'getAllDrivers'>;

export interface IWsDriverRouteHandlers {
  login: WsLoginHandler;
  getAllDrivers: WsGetAllDriversHandler;
}

export interface IWsWorkShiftRouteHandlers {
  getWorkShiftById: () => void; // just for a placeholder
}

export type WsQuery = keyof IWsDriverRouteHandlers | keyof IWsWorkShiftRouteHandlers;

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

export type GetDriverResult = z.infer<typeof GetDriverSchema>;

export function fromDomain(driver: Driver): GetDriverResult {
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
