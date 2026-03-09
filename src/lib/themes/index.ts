import type { Theme } from './types';
import { classicThemes } from './classic';
import { modernThemes } from './modern';
import { extraThemes } from './extra';

export type { Theme };
export { extractThemeFromHtml } from './extractTheme';
export const THEMES: Theme[] = [...classicThemes, ...modernThemes, ...extraThemes];

export interface ThemeGroup {
  label: string;
  themes: Theme[];
}

export const THEME_GROUPS: ThemeGroup[] = [
  { label: '经典', themes: classicThemes },
  { label: '潮流', themes: modernThemes },
  { label: '更多风格', themes: extraThemes },
];

export function getAllThemes(customThemes: Theme[]): Theme[] {
  return [...THEMES, ...customThemes];
}

export function getAllThemeGroups(customThemes: Theme[]): ThemeGroup[] {
  const groups = [...THEME_GROUPS];
  if (customThemes.length > 0) {
    groups.push({ label: '自定义', themes: customThemes });
  }
  return groups;
}
