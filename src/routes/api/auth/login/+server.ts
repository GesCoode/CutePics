import { json, type RequestHandler } from '@sveltejs/kit';
import {
  createSession,
  findUserByEmail,
  setSessionCookie,
  verifyPassword
} from '$lib/server/auth';

export const POST: RequestHandler = async ({ request, cookies }) => {
  let body: { email?: string; password?: string };

  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const email = body.email?.trim() ?? '';
  const password = body.password ?? '';

  if (!email || !password) {
    return json({ error: 'Enter your email and password.' }, { status: 400 });
  }

  const account = await findUserByEmail(email);
  if (!account || !(await verifyPassword(password, account.password_hash))) {
    return json({ error: 'Invalid email or password.' }, { status: 401 });
  }

  const session = await createSession(account.id);
  setSessionCookie(cookies, session.id, session.expiresAt);

  return json({
    user: {
      id: account.id,
      email: account.email,
      name: account.name,
      createdAt: account.created_at.toISOString()
    }
  });
};
