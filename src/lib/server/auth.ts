import bcrypt from 'bcryptjs';
import { dev } from '$app/environment';
import { randomBytes } from 'node:crypto';
import { getSql } from '$lib/server/db';

export const SESSION_COOKIE = 'memlyra_session';
const SESSION_DAYS = 30;
const BCRYPT_ROUNDS = 12;

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  createdAt: string;
};

type DbUser = {
  id: string;
  email: string;
  name: string;
  password_hash: string;
  created_at: Date;
};

type UserRow = Pick<DbUser, 'id' | 'email' | 'name' | 'created_at'>;

function toSessionUser(row: Pick<DbUser, 'id' | 'email' | 'name' | 'created_at'>): SessionUser {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    createdAt: row.created_at.toISOString()
  };
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function sessionExpiryDate(): Date {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_DAYS);
  return expiresAt;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

export async function verifyPassword(password: string, passwordHash: string): Promise<boolean> {
  return bcrypt.compare(password, passwordHash);
}

export async function findUserByEmail(email: string): Promise<DbUser | null> {
  const sql = getSql();
  const rows = await sql<DbUser[]>`
    SELECT id, email, name, password_hash, created_at
    FROM users
    WHERE lower(email) = ${normalizeEmail(email)}
    LIMIT 1
  `;

  return rows[0] ?? null;
}

export async function createUser(email: string, name: string, password: string): Promise<SessionUser> {
  const sql = getSql();
  const normalizedEmail = normalizeEmail(email);
  const trimmedName = name.trim();
  const passwordHash = await hashPassword(password);

  const rows = await sql<UserRow[]>`
    INSERT INTO users (email, name, password_hash)
    VALUES (${normalizedEmail}, ${trimmedName}, ${passwordHash})
    RETURNING id, email, name, created_at
  `;

  return toSessionUser(rows[0]);
}

export async function createSession(userId: string): Promise<{ id: string; expiresAt: Date }> {
  const sql = getSql();
  const id = randomBytes(32).toString('hex');
  const expiresAt = sessionExpiryDate();

  await sql`
    INSERT INTO sessions (id, user_id, expires_at)
    VALUES (${id}, ${userId}, ${expiresAt})
  `;

  return { id, expiresAt };
}

export async function deleteSession(sessionId: string): Promise<void> {
  const sql = getSql();
  await sql`DELETE FROM sessions WHERE id = ${sessionId}`;
}

export async function validateSession(sessionId: string): Promise<SessionUser | null> {
  const sql = getSql();

  const rows = await sql<UserRow[]>`
    SELECT u.id, u.email, u.name, u.created_at
    FROM sessions s
    JOIN users u ON u.id = s.user_id
    WHERE s.id = ${sessionId}
      AND s.expires_at > NOW()
    LIMIT 1
  `;

  const user = rows[0];
  if (!user) {
    await sql`DELETE FROM sessions WHERE id = ${sessionId}`;
    return null;
  }

  return toSessionUser(user);
}

export async function updateUserName(userId: string, name: string): Promise<SessionUser | null> {
  const sql = getSql();
  const trimmedName = name.trim();

  const rows = await sql<UserRow[]>`
    UPDATE users
    SET name = ${trimmedName}
    WHERE id = ${userId}
    RETURNING id, email, name, created_at
  `;

  return rows[0] ? toSessionUser(rows[0]) : null;
}

export async function deleteUser(userId: string): Promise<void> {
  const sql = getSql();
  await sql`DELETE FROM users WHERE id = ${userId}`;
}

export function setSessionCookie(
  cookies: import('@sveltejs/kit').Cookies,
  sessionId: string,
  expiresAt: Date
): void {
  cookies.set(SESSION_COOKIE, sessionId, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: !dev,
    expires: expiresAt
  });
}

export function clearSessionCookie(cookies: import('@sveltejs/kit').Cookies): void {
  cookies.delete(SESSION_COOKIE, { path: '/' });
}
