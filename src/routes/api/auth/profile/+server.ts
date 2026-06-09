import { json, type RequestHandler } from '@sveltejs/kit';
import { updateUserName } from '$lib/server/auth';

export const PATCH: RequestHandler = async ({ locals, request }) => {
  if (!locals.user) {
    return json({ error: 'Not authenticated.' }, { status: 401 });
  }

  let body: { name?: string };

  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const name = body.name?.trim() ?? '';
  if (!name) {
    return json({ error: 'Enter a display name.' }, { status: 400 });
  }

  const user = await updateUserName(locals.user.id, name);
  if (!user) {
    return json({ error: 'Could not update profile.' }, { status: 500 });
  }

  return json({ user });
};
