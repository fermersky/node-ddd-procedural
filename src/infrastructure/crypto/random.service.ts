import crypto from 'node:crypto';
import { promisify } from 'node:util';

interface IRandomService {
  requestId: () => Promise<string>;
}

export default function (): IRandomService {
  return {
    async requestId() {
      const randomBytes = promisify(crypto.randomBytes);
      const buf = await randomBytes(5);

      return buf.toString('hex');
    },
  };
}
