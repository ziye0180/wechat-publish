import { useState, useCallback, useEffect } from 'react';
import type { Theme } from '../lib/themes/types';

const STORAGE_KEY = 'raphael-custom-themes';

function loadFromStorage(): Theme[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (t: unknown) =>
        t &&
        typeof t === 'object' &&
        typeof (t as Theme).id === 'string' &&
        typeof (t as Theme).name === 'string' &&
        typeof (t as Theme).styles === 'object'
    );
  } catch {
    return [];
  }
}

function saveToStorage(themes: Theme[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(themes));
}

export function useCustomThemes() {
  const [customThemes, setCustomThemes] = useState<Theme[]>(loadFromStorage);

  useEffect(() => {
    saveToStorage(customThemes);
  }, [customThemes]);

  const addTheme = useCallback((theme: Theme) => {
    setCustomThemes((prev) => [...prev, theme]);
  }, []);

  const removeTheme = useCallback((themeId: string) => {
    setCustomThemes((prev) => prev.filter((t) => t.id !== themeId));
  }, []);

  return { customThemes, addTheme, removeTheme };
}
