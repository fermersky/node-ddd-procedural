import pool from '@infrastructure/db/pg/pool';

import app from '@api/http/app';
import { DriverLoginResponseSchema } from '@api/http/controller/driver/driver.dto';

let address: string;

beforeAll(async () => {
  address = await app.listen({ port: 0 });
});

afterAll(async () => {
  await app.close();
  await pool.end();
});

describe('Driver controller endpoints tests', () => {
  test('POST /driver/login returns 200 status and token on successful driver login', async () => {
    const response = await fetch(`${address}/driver/login`, {
      method: 'post',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        email: 'andrew@mail.com',
        password: '123',
      }),
    });

    expect(response.status).toBe(200);

    const body = await DriverLoginResponseSchema.parseAsync(await response.json());

    expect(body).toHaveProperty('token');
  });

  test('GET /driver/me returns 200 status and driver data based on the payload of an authorization token', async () => {
    // TODO: make authenticated request to /driver/me and check its data
  });
});
