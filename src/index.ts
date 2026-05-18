import { Elysia } from 'elysia';
import { db } from './db';
import { sql } from 'drizzle-orm';

const app = new Elysia()
  .get('/health', async () => {
    await db.execute(sql`select 1`);

    return {
      status: 'ok',
      database: 'connected',
    };
  })
  .listen(process.env.PORT ? Number(process.env.PORT) : 3000);

console.log(`Server is running at ${app.server?.hostname}:${app.server?.port}`);
