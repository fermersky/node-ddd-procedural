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
) => WsHandlerResult<Driver[], 'getAllDrivers'>;

export interface IWsDriverRouteHandlers {
  login: WsLoginHandler;
  getAllDrivers: WsGetAllDriversHandler;
}

export interface IWsWorkShiftRouteHandlers {
  getWorkShiftById: () => void; // just for a placeholder
}

export type WsQuery = keyof IWsDriverRouteHandlers | keyof IWsWorkShiftRouteHandlers;
