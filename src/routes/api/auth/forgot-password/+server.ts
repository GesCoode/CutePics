import { json, type RequestHandler } from '@sveltejs/kit';
import { createPasswordResetToken, findUserByEmail } from '$lib/server/auth';
import { sendPasswordResetEmail } from '$lib/server/mail';
import { getAppOrigin } from '$lib/server/origin';

const GENERIC_MESSAGE =
  'If an account exists for that email, a password reset link has been sent.';

export const POST: RequestHandler = async ({ request, url }) => {
  let body: { email?: string };

  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const email = body.email?.trim() ?? '';
  if (!email) {
    return json({ error: 'Enter your email address.' }, { status: 400 });
  }

  const account = await findUserByEmail(email);
  if (account?.email_verified) {
    try {
      const resetToken = await createPasswordResetToken(account.id);
      const resetUrl = `${getAppOrigin(url)}/reset-password?token=${resetToken}`;
      await sendPasswordResetEmail(account.email, resetUrl);
    } catch (error) {
      console.error('Failed to send password reset email', error);
    }
  }

  return json({ message: GENERIC_MESSAGE });
};
