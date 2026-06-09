import { json, type RequestHandler } from '@sveltejs/kit';
import { getAppOrigin } from '$lib/server/origin';
import { sendWelcomePicture } from '$lib/server/pictures';
import { createOrUpdateSubscription } from '$lib/server/subscriptions';

export const POST: RequestHandler = async ({ request, url }) => {
  let body: { email?: string; categories?: string[] };

  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const email = body.email?.trim() ?? '';
  const categories = body.categories ?? [];

  if (!email) {
    return json({ error: 'Please enter your email address.' }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: 'Please enter a valid email address.' }, { status: 400 });
  }

  try {
    const subscriber = await createOrUpdateSubscription(email, categories);
    const origin = getAppOrigin(url);
    await sendWelcomePicture(subscriber, origin);

    return json({
      ok: true,
      email: subscriber.email
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not sign up.';
    console.error('Subscribe failed:', error);
    return json({ error: message }, { status: 400 });
  }
};
