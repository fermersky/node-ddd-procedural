import { FastifyRequest } from 'fastify';

export type HandlerResult<TSchema> = {
  status: number;
  body: TSchema;

  headers?: Record<string, string>;
};

export type FastifyHandlerResult<T> = Promise<HandlerResult<T>>;
export type FastifyRouteHandlerFn<T> = (req: FastifyRequest) => FastifyHandlerResult<T>;
