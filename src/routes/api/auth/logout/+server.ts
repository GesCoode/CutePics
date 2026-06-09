import { json, type RequestHandler } from '@sveltejs/kit';
import { clearSessionCookie, deleteSession, SESSION_COOKIE } from '$lib/server/auth';

export const POST: RequestHandler = async ({ cookies }) => {
  const sessionId = cookies.get(SESSION_COOKIE);

  if (sessionId) {
    await deleteSession(sessionId);
  }

  clearSessionCookie(cookies);
  return json({ ok: true });
};
