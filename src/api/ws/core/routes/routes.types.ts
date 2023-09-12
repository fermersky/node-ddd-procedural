import { z } from 'zod';

import { routes } from '@api/ws/core/routes/routes';

export const WsMessageSchema = z.object({
  query: z.string(),
  params: z.any(),
});

export type WsQuery = keyof typeof routes;

export interface WsMessage {
  params: any;
  query: WsQuery;
}

export const GetAllDriversParamsSchema = z.object({
  skip: z.number().default(0),
  take: z.number().default(5),
});

export type GetAllDriversParams = z.infer<typeof GetAllDriversParamsSchema>;