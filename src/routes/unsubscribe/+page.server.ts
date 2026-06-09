import type { PageServerLoad } from './$types';
import { unsubscribeByToken } from '$lib/server/subscriptions';

export const load: PageServerLoad = async ({ url }) => {
  const token = url.searchParams.get('token')?.trim() ?? '';

  if (!token) {
    return { status: 'invalid' as const };
  }

  const removed = await unsubscribeByToken(token);
  return { status: removed ? ('success' as const) : ('invalid' as const) };
};
