import { redirect } from '@sveltejs/kit';
import { SESSION_COOKIE, validateSession } from '$lib/server/auth';
import type { Handle } from '@sveltejs/kit';

const protectedPrefixes = ['/dashboard'];

export const handle: Handle = async ({ event, resolve }) => {
  const sessionId = event.cookies.get(SESSION_COOKIE);

  try {
    event.locals.user = sessionId ? await validateSession(sessionId) : null;
  } catch (error) {
    console.error('Failed to validate session', error);
    event.locals.user = null;
  }

  const { pathname } = event.url;
  const isProtected = protectedPrefixes.some((prefix) => pathname.startsWith(prefix));
  const isAuthPage = pathname === '/login' || pathname === '/register';

  if (isProtected && !event.locals.user) {
    throw redirect(303, '/login');
  }

  if (isAuthPage && event.locals.user) {
    throw redirect(303, '/dashboard');
  }

  return resolve(event);
};
