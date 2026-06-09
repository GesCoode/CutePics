import { json, type RequestHandler } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { getAppOrigin } from '$lib/server/origin';
import { sendDailyPicturesToAll } from '$lib/server/pictures';

function authorized(request: Request): boolean {
  const secret = env.CRON_SECRET;
  if (!secret) return false;

  const auth = request.headers.get('authorization');
  if (auth === `Bearer ${secret}`) return true;

  const headerSecret = request.headers.get('x-cron-secret');
  return headerSecret === secret;
}

export const POST: RequestHandler = async ({ request, url }) => {
  if (!authorized(request)) {
    return json({ error: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const origin = getAppOrigin(url);
    const result = await sendDailyPicturesToAll(origin);
    return json({ ok: true, ...result });
  } catch (error) {
    console.error('Daily cron failed:', error);
    return json({ error: 'Daily send failed.' }, { status: 500 });
  }
};

export const GET: RequestHandler = async (event) => POST(event);
