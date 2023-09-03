import { DriverLoginResponseSchema } from '@api/http/controller/driver/driver.dto';

// TODO: create function for calling authenticated requests
export const getAuthenticated = async (address: string) => {
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

  const body = await DriverLoginResponseSchema.parseAsync(await response.json());
  return body;
};
