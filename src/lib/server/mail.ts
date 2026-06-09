import nodemailer from 'nodemailer';
import { env } from '$env/dynamic/private';

function smtpConfigured(): boolean {
  return Boolean(env.SMTP_HOST && env.SMTP_FROM);
}

function createTransport() {
  const port = Number(env.SMTP_PORT ?? 587);
  const secure = env.SMTP_SECURE === 'true' || port === 465;

  return nodemailer.createTransport({
    host: env.SMTP_HOST,
    port,
    secure,
    auth:
      env.SMTP_USER && env.SMTP_PASS
        ? {
            user: env.SMTP_USER,
            pass: env.SMTP_PASS
          }
        : undefined
  });
}

export async function sendVerificationEmail(to: string, verifyUrl: string): Promise<void> {
  const subject = 'Activate your MemLyra account';
  const text = `Click this link to activate your account: ${verifyUrl}\n\nIf this was not you, then ignore this mail.`;
  const html = `
    <p>Click this link to activate your account:</p>
    <p><a href="${verifyUrl}">${verifyUrl}</a></p>
    <p>If this was not you, then ignore this mail.</p>
  `;

  if (!smtpConfigured()) {
    console.warn('SMTP is not configured. Verification link:', verifyUrl);
    return;
  }

  const transport = createTransport();
  await transport.sendMail({
    from: env.SMTP_FROM,
    to,
    subject,
    text,
    html
  });
}
