import { json, type RequestHandler } from '@sveltejs/kit';
import { clearSessionCookie, deleteSession, deleteUser, SESSION_COOKIE } from '$lib/server/auth';

export const DELETE: RequestHandler = async ({ locals, cookies }) => {
  if (!locals.user) {
    return json({ error: 'Not authenticated.' }, { status: 401 });
  }

  const sessionId = cookies.get(SESSION_COOKIE);
  if (sessionId) {
    await deleteSession(sessionId);
  }

  await deleteUser(locals.user.id);
  clearSessionCookie(cookies);

  return json({ ok: true });
};
