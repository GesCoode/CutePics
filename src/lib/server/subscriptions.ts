import { randomBytes } from 'node:crypto';
import { getCategoryById, VALID_CATEGORY_IDS } from '$lib/categories';
import { getSql } from '$lib/server/db';

export type Subscriber = {
  id: string;
  email: string;
  unsubscribeToken: string;
  active: boolean;
  createdAt: string;
  confirmedAt: string | null;
  lastSentAt: string | null;
  categoryIds: string[];
};

type SubscriberRow = {
  id: string;
  email: string;
  unsubscribe_token: string;
  active: boolean;
  created_at: Date;
  confirmed_at: Date | null;
  last_sent_at: Date | null;
};

function mapSubscriber(row: SubscriberRow, categoryIds: string[]): Subscriber {
  return {
    id: row.id,
    email: row.email,
    unsubscribeToken: row.unsubscribe_token,
    active: row.active,
    createdAt: row.created_at.toISOString(),
    confirmedAt: row.confirmed_at?.toISOString() ?? null,
    lastSentAt: row.last_sent_at?.toISOString() ?? null,
    categoryIds
  };
}

export function validateCategoryIds(categoryIds: string[]): string[] {
  const unique = [...new Set(categoryIds.filter((id) => VALID_CATEGORY_IDS.has(id)))];
  if (unique.length === 0) {
    throw new Error('Pick at least one category.');
  }
  return unique;
}

export async function createOrUpdateSubscription(
  email: string,
  categoryIds: string[]
): Promise<Subscriber> {
  const sql = getSql();
  const normalizedEmail = email.trim().toLowerCase();
  const validCategories = validateCategoryIds(categoryIds);

  const existing = await sql<SubscriberRow[]>`
    SELECT id, email, unsubscribe_token, active, created_at, confirmed_at, last_sent_at
    FROM subscribers
    WHERE email = ${normalizedEmail}
    LIMIT 1
  `;

  let subscriberId: string;
  let row: SubscriberRow;

  if (existing.length > 0) {
    subscriberId = existing[0].id;
    row = existing[0];
    await sql`
      UPDATE subscribers
      SET active = TRUE
      WHERE id = ${subscriberId}
    `;
    await sql`DELETE FROM subscriber_categories WHERE subscriber_id = ${subscriberId}`;
  } else {
    const unsubscribeToken = randomBytes(24).toString('hex');
    const inserted = await sql<SubscriberRow[]>`
      INSERT INTO subscribers (email, unsubscribe_token)
      VALUES (${normalizedEmail}, ${unsubscribeToken})
      RETURNING id, email, unsubscribe_token, active, created_at, confirmed_at, last_sent_at
    `;
    subscriberId = inserted[0].id;
    row = inserted[0];
  }

  for (const categoryId of validCategories) {
    await sql`
      INSERT INTO subscriber_categories (subscriber_id, category_id)
      VALUES (${subscriberId}, ${categoryId})
    `;
  }

  return mapSubscriber(row, validCategories);
}

export async function getSubscriberById(id: string): Promise<Subscriber | null> {
  const sql = getSql();
  const rows = await sql<SubscriberRow[]>`
    SELECT id, email, unsubscribe_token, active, created_at, confirmed_at, last_sent_at
    FROM subscribers
    WHERE id = ${id}
    LIMIT 1
  `;

  if (rows.length === 0) return null;

  const categoryIds = await getCategoryIdsForSubscriber(rows[0].id);
  return mapSubscriber(rows[0], categoryIds);
}

async function getCategoryIdsForSubscriber(subscriberId: string): Promise<string[]> {
  const sql = getSql();
  const rows = await sql<{ category_id: string }[]>`
    SELECT category_id FROM subscriber_categories WHERE subscriber_id = ${subscriberId}
  `;
  return rows.map((row) => row.category_id);
}

export async function getActiveSubscribers(): Promise<Subscriber[]> {
  const sql = getSql();
  const rows = await sql<SubscriberRow[]>`
    SELECT id, email, unsubscribe_token, active, created_at, confirmed_at, last_sent_at
    FROM subscribers
    WHERE active = TRUE
    ORDER BY created_at ASC
  `;

  const subscribers: Subscriber[] = [];
  for (const row of rows) {
    const categoryIds = await getCategoryIdsForSubscriber(row.id);
    if (categoryIds.length === 0) continue;
    subscribers.push(mapSubscriber(row, categoryIds));
  }

  return subscribers;
}

export async function markSubscriberConfirmed(subscriberId: string): Promise<void> {
  const sql = getSql();
  await sql`
    UPDATE subscribers
    SET confirmed_at = COALESCE(confirmed_at, NOW()), last_sent_at = NOW()
    WHERE id = ${subscriberId}
  `;
}

export async function logSend(
  subscriberId: string,
  categoryId: string,
  kind: 'welcome' | 'daily'
): Promise<void> {
  const sql = getSql();
  await sql`
    INSERT INTO send_log (subscriber_id, category_id, kind)
    VALUES (${subscriberId}, ${categoryId}, ${kind})
  `;
  await sql`
    UPDATE subscribers SET last_sent_at = NOW() WHERE id = ${subscriberId}
  `;
}

export async function unsubscribeByToken(token: string): Promise<boolean> {
  const sql = getSql();
  const result = await sql`
    UPDATE subscribers SET active = FALSE WHERE unsubscribe_token = ${token} AND active = TRUE
  `;
  return result.count > 0;
}

export function categoryLabel(categoryId: string): string {
  return getCategoryById(categoryId)?.label ?? categoryId;
}
