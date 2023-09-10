import bcrypt from 'bcrypt';

export interface IBcryptService {
  compare(password: string | Buffer, hash: string): Promise<boolean>;
}

export default function (): IBcryptService {
  return {
    async compare(password, hash) {
      return new Promise((resolve, reject) => {
        bcrypt.compare(password, hash, (err, same) => {
          if (err) {
            reject(err);
          }

          resolve(same);
        });
      });
    },
  };
}
