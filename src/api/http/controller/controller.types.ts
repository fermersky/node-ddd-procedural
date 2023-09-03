import { FastifyRequest } from 'fastify';

export interface IHandlerResult<TSchema> {
  status: number;
  body: TSchema;

  headers?: Record<string, string>;
}

export type FastifyHandlerResult<T> = Promise<IHandlerResult<T>>;
export type FastifyRouteHandlerFn<T> = (req: FastifyRequest) => FastifyHandlerResult<T>;
