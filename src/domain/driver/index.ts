import { z } from 'zod';

import { EntitySchema } from '../domain.entity';

export const DriverSchema = EntitySchema.extend({
  password: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  first_name: z.string(),
  last_name: z.string(),
});

export type Driver = z.infer<typeof DriverSchema>;

export * from './driver.service';
export * from './driver.interface';
export * from './driver.errors';
