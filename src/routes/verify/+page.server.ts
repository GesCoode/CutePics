import type { PageServerLoad } from './$types';
import { verifyEmailWithToken } from '$lib/server/auth';

export const load: PageServerLoad = async ({ url }) => {
  const token = url.searchParams.get('token');

  if (!token) {
    return { status: 'invalid' as const };
  }

  const verified = await verifyEmailWithToken(token);
  return { status: verified ? ('success' as const) : ('invalid' as const) };
};
