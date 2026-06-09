import { json, type RequestHandler } from '@sveltejs/kit';
import {
  clearSessionCookie,
  createSession,
  createUser,
  findUserByEmail,
  setSessionCookie,
  verifyPassword
} from '$lib/server/auth';

export const POST: RequestHandler = async ({ request, cookies }) => {
  let body: { email?: string; name?: string; password?: string };

  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const email = body.email?.trim() ?? '';
  const name = body.name?.trim() ?? '';
  const password = body.password ?? '';

  if (!email || !name) {
    return json({ error: 'Enter an account name and email.' }, { status: 400 });
  }

  if (password.length < 6) {
    return json({ error: 'Password must be at least 6 characters.' }, { status: 400 });
  }

  const existing = await findUserByEmail(email);
  if (existing) {
    return json({ error: 'An account with this email already exists.' }, { status: 409 });
  }

  const user = await createUser(email, name, password);
  const session = await createSession(user.id);
  setSessionCookie(cookies, session.id, session.expiresAt);

  return json({ user });
};
