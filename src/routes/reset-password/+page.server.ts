import type { PageServerLoad } from './$types';
import { isPasswordResetTokenValid } from '$lib/server/auth';

export const load: PageServerLoad = async ({ url }) => {
  const token = url.searchParams.get('token');

  if (!token) {
    return { status: 'invalid' as const, token: '' };
  }

  const valid = await isPasswordResetTokenValid(token);
  return {
    status: valid ? ('ready' as const) : ('invalid' as const),
    token
  };
};
