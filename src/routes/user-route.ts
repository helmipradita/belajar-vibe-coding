import { Elysia, t } from 'elysia';
import { EmailAlreadyRegisteredError, registerUser } from '../services/user-service';

export const userRoute = new Elysia({ prefix: '/api/users' }).post(
  '/',
  async ({ body, set }) => {
    try {
      await registerUser(body);

      return {
        data: 'OK',
      };
    } catch (error) {
      if (error instanceof EmailAlreadyRegisteredError) {
        set.status = 400;
        return {
          error: 'email sudah terdaftar',
        };
      }

      throw error;
    }
  },
  {
    body: t.Object({
      name: t.String({ minLength: 1 }),
      email: t.String({ format: 'email' }),
      password: t.String({ minLength: 8 }),
    }),
  },
);
