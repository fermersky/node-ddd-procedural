import { z } from 'zod';

import { DriverLoginResponseSchema } from '@api/http/controller/driver/driver.dto';

export const makeRequest = async <TSchema>(
  address: string,
  schema: z.Schema<TSchema>,
  options?: RequestInit | undefined,
): Promise<{ body: TSchema; status: number }> => {
  const response = await fetch(`${address}`, options);

  const json = await schema.parseAsync(await response.json());

  return { body: json, status: response.status };
};

export const makeAuthenticatedRequest = async <TSchema>(
  address: string,
  schema: z.Schema<TSchema>,
  options?: RequestInit | undefined,
): Promise<{ body: TSchema; status: number }> => {
  const { host, protocol } = new URL(address);

  const { body } = await makeRequest(`${protocol}//${host}/driver/login`, DriverLoginResponseSchema, {
    method: 'post',
    body: JSON.stringify({
      email: 'andrew@mail.com',
      password: '123',
    }),
    headers: {
      'content-type': 'application/json',
    },
  });

  const responseBody = await makeRequest(
    address,
    schema,
    Object.assign(options ?? {}, {
      headers: { authorization: `Bearer ${body.token}`, 'content-type': 'application/json' },
    }),
  );

  return responseBody;
};
