import { pickRandomCategoryId } from '$lib/categories';
import { generateCuteImage } from '$lib/server/gemini';
import { sendCutePictureEmail } from '$lib/server/mail';
import {
  categoryLabel,
  logSend,
  markSubscriberConfirmed,
  type Subscriber
} from '$lib/server/subscriptions';

export async function sendWelcomePicture(subscriber: Subscriber, origin: string): Promise<string> {
  const categoryId = pickRandomCategoryId(subscriber.categoryIds);
  const image = await generateCuteImage(categoryId);
  const label = categoryLabel(categoryId);
  const unsubscribeUrl = `${origin}/unsubscribe?token=${subscriber.unsubscribeToken}`;

  await sendCutePictureEmail({
    to: subscriber.email,
    subject: `Welcome to CutePics — your first cute pic! ${label}`,
    headline: 'Welcome! Here is your first daily dose of cute.',
    body: `You signed up for cute pics and we delivered. Expect a new one every day at 18:00.`,
    categoryLabel: label,
    image,
    unsubscribeUrl
  });

  await logSend(subscriber.id, categoryId, 'welcome');
  await markSubscriberConfirmed(subscriber.id);

  return categoryId;
}

export async function sendDailyPicture(subscriber: Subscriber, origin: string): Promise<string> {
  const categoryId = pickRandomCategoryId(subscriber.categoryIds);
  const image = await generateCuteImage(categoryId);
  const label = categoryLabel(categoryId);
  const unsubscribeUrl = `${origin}/unsubscribe?token=${subscriber.unsubscribeToken}`;

  await sendCutePictureEmail({
    to: subscriber.email,
    subject: `Today's cute pic: ${label}`,
    headline: 'Your daily cute pic has arrived!',
    body: `Fresh cuteness, straight to your inbox. Same time tomorrow.`,
    categoryLabel: label,
    image,
    unsubscribeUrl
  });

  await logSend(subscriber.id, categoryId, 'daily');

  return categoryId;
}

export async function sendDailyPicturesToAll(origin: string): Promise<{ sent: number; failed: number }> {
  const { getActiveSubscribers } = await import('$lib/server/subscriptions');
  const subscribers = await getActiveSubscribers();

  let sent = 0;
  let failed = 0;

  for (const subscriber of subscribers) {
    try {
      await sendDailyPicture(subscriber, origin);
      sent += 1;
    } catch (error) {
      failed += 1;
      console.error(`Failed daily send for ${subscriber.email}:`, error);
    }
  }

  return { sent, failed };
}
