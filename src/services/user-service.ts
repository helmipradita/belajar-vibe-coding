import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import { hash } from 'bcryptjs';

export class EmailAlreadyRegisteredError extends Error {
  constructor() {
    super('email sudah terdaftar');
  }
}

export const registerUser = async (input: {
  name: string;
  email: string;
  password: string;
}) => {
  const existingUser = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, input.email))
    .limit(1);

  if (existingUser.length > 0) {
    throw new EmailAlreadyRegisteredError();
  }

  const hashedPassword = await hash(input.password, 10);

  await db.insert(users).values({
    name: input.name,
    email: input.email,
    password: hashedPassword,
  });
};
