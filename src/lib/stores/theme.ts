import { browser } from '$app/environment';
import { writable } from 'svelte/store';

const STORAGE_KEY = 'hueprint-theme';

declare global {
  interface Window {
    __HUEPRINT_THEME__?: boolean;
  }
}

function readPreference(): boolean {
  if (!browser) return false;
  if (typeof window.__HUEPRINT_THEME__ === 'boolean') {
    return window.__HUEPRINT_THEME__;
  }
  return localStorage.getItem(STORAGE_KEY) === 'dark';
}

function applyToDocument(isDark: boolean) {
  if (!browser) return;
  document.documentElement.classList.toggle('dark', isDark);
  localStorage.setItem(STORAGE_KEY, isDark ? 'dark' : 'light');
}

function initialDark(): boolean {
  if (browser && typeof window.__HUEPRINT_THEME__ === 'boolean') {
    return window.__HUEPRINT_THEME__;
  }
  return false;
}

/** False during prerender; on client, matches app.html inline script before first paint. */
export const isDark = writable(initialDark());

/** Sync store + storage with the class already set in app.html. */
export function initTheme() {
  if (!browser) return;
  const dark = readPreference();
  isDark.set(dark);
  applyToDocument(dark);
}

export function setDark(value: boolean) {
  isDark.set(value);
  if (browser) window.__HUEPRINT_THEME__ = value;
  applyToDocument(value);
}
