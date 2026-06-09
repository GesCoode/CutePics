import { derived, writable } from 'svelte/store';

export type User = {
  id: string;
  email: string;
  name: string;
  createdAt: string;
};

export const user = writable<User | null>(null);
export const isLoggedIn = derived(user, ($user) => $user !== null);

export function setUser(next: User | null) {
  user.set(next);
}

export async function signOut(): Promise<void> {
  await fetch('/api/auth/logout', { method: 'POST' });
  user.set(null);
}

export async function updateProfile(name: string): Promise<boolean> {
  const trimmedName = name.trim();
  if (!trimmedName) return false;

  const response = await fetch('/api/auth/profile', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: trimmedName })
  });

  if (!response.ok) return false;

  const data = (await response.json()) as { user: User };
  user.set(data.user);
  return true;
}

export async function deleteCurrentAccount(): Promise<boolean> {
  const response = await fetch('/api/auth/account', { method: 'DELETE' });
  if (!response.ok) return false;

  user.set(null);
  return true;
}

export function getAccountStartDate(currentUser: User | null): Date {
  if (!currentUser?.createdAt) return new Date();
  return new Date(currentUser.createdAt);
}
