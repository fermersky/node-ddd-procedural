import { z } from 'zod';

import { EntitySchema } from '..';

export const WorkShiftSchema = EntitySchema.extend({
  start: z.string(),
  end: z.string(),
  driverId: z.string(),
});

export type WorkShift = z.infer<typeof WorkShiftSchema>;
