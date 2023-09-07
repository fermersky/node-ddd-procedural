import { FastifyReply, FastifyRequest } from 'fastify';
import { ZodError, z } from 'zod';

import { DomainError } from '@domain/domain.errors';

import { randomService } from '@infrastructure/crypto';

import { FastifyRouteHandlerFn } from '../controller/controller.types';
import { HttpError } from './http.errors';

type FastifyHTTPHandler = FastifyRouteHandlerFn<object>;

const TryCatchErrors = async (req: FastifyRequest, res: FastifyReply, cb: () => Promise<void>) => {
  try {
    await cb();
  } catch (error) {
    console.log(error);

    if (error instanceof HttpError) {
      const appError = error as HttpError;

      return res.status(appError.status).send({
        statusCode: appError.status,
        body: {
          error: appError.name,
          message: appError.message,
        },
      });
    } else if (error instanceof DomainError) {
      return res.status(400).send({
        statusCode: 400,
        body: {
          error: error.name,
          message: error.message,
        },
      });
    } else if (error instanceof ZodError) {
      return res.status(400).send({
        statusCode: 400,
        body: {
          error: 'Validation error',
          message: error,
        },
      });
    }

    return res.status(500).send({
      statusCode: 500,
      body: {
        error: 'Internal Server Error',
      },
    });
  }
};

const ApiHandlerOptionsSchema = z.object({
  logging: z.boolean().optional().default(false),
  logger: z
    .object({
      log: z.function(),
    })
    .optional()
    .default(console),
});

type ApiHandlerOptions = z.infer<typeof ApiHandlerOptionsSchema>;

export const ApiHandler =
  (
    req: FastifyRequest,
    res: FastifyReply,
    options: ApiHandlerOptions = { logging: false, logger: console },
  ) =>
  async (handler: FastifyHTTPHandler) => {
    await TryCatchErrors(req, res, async () => {
      const { logging, logger } = await ApiHandlerOptionsSchema.parseAsync(options);
      const requestId = await randomService().requestId();

      logging &&
        logger.log(`HTTP (requestId: ${requestId}) => ${new Date().toTimeString()} ${req.method} ${req.url}`);

      performance.mark(requestId);

      req.id = requestId;

      const { status, body, headers } = await handler(req);

      const { duration } = performance.measure('request to Now', requestId);

      logging &&
        logger.log(
          `HTTP (requestId: ${requestId}) <= ${new Date().toTimeString()} took ${duration.toFixed(2)} ms`,
        );

      if (headers) res.headers(headers);
      console.log(body);

      res.send(body).status(status);
    });
  };
