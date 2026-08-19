import type { Theme, TemplateId } from '@/types/types';

export const themes: Record<TemplateId, Theme> = {
  modern: {
    id: 'modern',
    name: 'Modern',
    colors: {
      primary: '#0f766e',
      secondary: '#134e4a',
      accent: '#f59e0b',
      text: '#0f172a',
      muted: '#475569',
      background: '#ffffff',
      surface: '#f0fdfa',
      border: '#cbd5e1',
    },
    fontHeading: 'Inter, system-ui, sans-serif',
    fontBody: 'Inter, system-ui, sans-serif',
  },
  classic: {
    id: 'classic',
    name: 'Classic',
    colors: {
      primary: '#1e3a5f',
      secondary: '#0f2540',
      accent: '#b45309',
      text: '#1a1a1a',
      muted: '#525252',
      background: '#ffffff',
      surface: '#faf7f2',
      border: '#d6cfc4',
    },
    fontHeading: 'Georgia, "Times New Roman", serif',
    fontBody: 'Georgia, "Times New Roman", serif',
  },
  minimal: {
    id: 'minimal',
    name: 'Minimal',
    colors: {
      primary: '#111827',
      secondary: '#374151',
      accent: '#2563eb',
      text: '#111827',
      muted: '#6b7280',
      background: '#ffffff',
      surface: '#f9fafb',
      border: '#e5e7eb',
    },
    fontHeading: 'Inter, system-ui, sans-serif',
    fontBody: 'Inter, system-ui, sans-serif',
  },
};

export const themeOrder: TemplateId[] = ['modern', 'classic', 'minimal'];

export const fontFamilies: { id: string; label: string; stack: string }[] = [
  { id: 'inter', label: 'Inter (Sans)', stack: "'Inter', system-ui, sans-serif" },
  { id: 'georgia', label: 'Georgia (Serif)', stack: "Georgia, 'Times New Roman', serif" },
  { id: 'mono', label: 'Mono', stack: "'JetBrains Mono', ui-monospace, monospace" },
  { id: 'system', label: 'Système', stack: 'system-ui, -apple-system, sans-serif' },
];

export function resolveFontStack(id: string, fallback: string): string {
  return fontFamilies.find((f) => f.id === id)?.stack ?? fallback;
}

export const colorPresets: { name: string; primary: string; accent: string }[] = [
  { name: 'Teal', primary: '#0f766e', accent: '#f59e0b' },
  { name: 'Navy', primary: '#1e3a5f', accent: '#b45309' },
  { name: 'Slate', primary: '#111827', accent: '#2563eb' },
  { name: 'Forest', primary: '#166534', accent: '#ca8a04' },
  { name: 'Plum', primary: '#7c2d12', accent: '#0ea5e9' },
  { name: 'Crimson', primary: '#991b1b', accent: '#0891b2' },
];
