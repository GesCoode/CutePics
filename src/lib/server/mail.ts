import nodemailer from 'nodemailer';
import { env } from '$env/dynamic/private';
import { APP_NAME } from '$lib/app';

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

async function sendEmail(options: {
  to: string;
  subject: string;
  text: string;
  html: string;
  logLabel: string;
  logUrl?: string;
  attachments?: Array<{
    filename: string;
    content: Buffer;
    cid?: string;
    contentType?: string;
  }>;
}): Promise<void> {
  if (!smtpConfigured()) {
    console.warn(`SMTP is not configured. ${options.logLabel}:`, options.logUrl ?? options.text);
    return;
  }

  const transport = createTransport();
  await transport.sendMail({
    from: env.SMTP_FROM,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
    attachments: options.attachments
  });
}

export async function sendCutePictureEmail(options: {
  to: string;
  subject: string;
  headline: string;
  body: string;
  categoryLabel: string;
  image: { buffer: Buffer; mimeType: string };
  unsubscribeUrl: string;
}): Promise<void> {
  const ext = options.image.mimeType === 'image/jpeg' ? 'jpg' : 'png';
  const filename = `cutepics-${Date.now()}.${ext}`;
  const cid = 'cutepic';

  const text = `${options.headline}\n\n${options.body}\n\nCategory: ${options.categoryLabel}\n\nUnsubscribe: ${options.unsubscribeUrl}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #5c3d52;">
      <h1 style="color: #ff6b95; font-size: 24px;">${options.headline}</h1>
      <p style="font-size: 16px; line-height: 1.5;">${options.body}</p>
      <p style="font-size: 14px; color: #a88996;">Today's category: <strong>${options.categoryLabel}</strong></p>
      <p style="margin: 24px 0;">
        <img src="cid:${cid}" alt="${options.categoryLabel}" style="max-width: 100%; border-radius: 16px;" />
      </p>
      <p style="font-size: 12px; color: #a88996;">
        <a href="${options.unsubscribeUrl}" style="color: #ff6b95;">Unsubscribe</a>
      </p>
    </div>
  `;

  await sendEmail({
    to: options.to,
    subject: options.subject,
    text,
    html,
    logLabel: 'Cute picture email',
    attachments: [
      {
        filename,
        content: options.image.buffer,
        cid,
        contentType: options.image.mimeType
      }
    ]
  });
}

export async function sendVerificationEmail(to: string, verifyUrl: string): Promise<void> {
  const subject = `Activate your ${APP_NAME} account`;
  const text = `Click this link to activate your account: ${verifyUrl}\n\nIf this was not you, then ignore this mail.`;
  const html = `
    <p>Click this link to activate your account:</p>
    <p><a href="${verifyUrl}">${verifyUrl}</a></p>
    <p>If this was not you, then ignore this mail.</p>
  `;

  await sendEmail({
    to,
    subject,
    text,
    html,
    logLabel: 'Verification link',
    logUrl: verifyUrl
  });
}

export async function sendPasswordResetEmail(to: string, resetUrl: string): Promise<void> {
  const subject = `Reset your ${APP_NAME} password`;
  const text = `Click this link to reset your password: ${resetUrl}\n\nThis link expires in one hour. If this was not you, ignore this email.`;
  const html = `
    <p>Click this link to reset your password:</p>
    <p><a href="${resetUrl}">${resetUrl}</a></p>
    <p>This link expires in one hour. If this was not you, ignore this email.</p>
  `;

  await sendEmail({
    to,
    subject,
    text,
    html,
    logLabel: 'Password reset link',
    logUrl: resetUrl
  });
}
