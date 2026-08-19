import type { Theme, TemplateId } from '@/types/types';

export const themes: Record<TemplateId, Theme> = {

  // =========================================================
  // MODERN
  // =========================================================

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

  // =========================================================
  // CLASSIC
  // =========================================================

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

  // =========================================================
  // MINIMAL
  // =========================================================

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

  // =========================================================
  // CORPORATE
  // =========================================================

  corporate: {
    id: 'corporate',
    name: 'Corporate',

    colors: {
      primary: '#1e40af',
      secondary: '#1e3a8a',
      accent: '#3b82f6',
      text: '#111827',
      muted: '#64748b',
      background: '#ffffff',
      surface: '#eff6ff',
      border: '#dbeafe',
    },

    fontHeading: 'Inter, system-ui, sans-serif',
    fontBody: 'Inter, system-ui, sans-serif',
  },

  // =========================================================
  // EDITORIAL
  // =========================================================

  editorial: {
    id: 'editorial',
    name: 'Editorial',

    colors: {
      primary: '#18181b',
      secondary: '#3f3f46',
      accent: '#b91c1c',
      text: '#27272a',
      muted: '#71717a',
      background: '#ffffff',
      surface: '#fafafa',
      border: '#e4e4e7',
    },

    fontHeading: 'Georgia, "Times New Roman", serif',
    fontBody: 'Inter, system-ui, sans-serif',
  },

  // =========================================================
  // EXECUTIVE
  // =========================================================

  executive: {
    id: 'executive',
    name: 'Executive',

    colors: {
      primary: '#111827',
      secondary: '#1f2937',
      accent: '#b08d57',
      text: '#111827',
      muted: '#6b7280',
      background: '#ffffff',
      surface: '#f9fafb',
      border: '#d1d5db',
    },

    fontHeading: 'Georgia, "Times New Roman", serif',
    fontBody: 'Inter, system-ui, sans-serif',
  },

  // =========================================================
  // SWISS
  // =========================================================

  swiss: {
    id: 'swiss',
    name: 'Swiss',

    colors: {
      primary: '#dc2626',
      secondary: '#18181b',
      accent: '#ef4444',
      text: '#18181b',
      muted: '#52525b',
      background: '#ffffff',
      surface: '#fafafa',
      border: '#d4d4d8',
    },

    fontHeading: 'Inter, system-ui, sans-serif',
    fontBody: 'Inter, system-ui, sans-serif',
  },

  // =========================================================
  // TECH
  // =========================================================

  tech: {
    id: 'tech',
    name: 'Tech',

    colors: {
      primary: '#7c3aed',
      secondary: '#4c1d95',
      accent: '#06b6d4',
      text: '#111827',
      muted: '#64748b',
      background: '#ffffff',
      surface: '#f5f3ff',
      border: '#ddd6fe',
    },

    fontHeading: "'JetBrains Mono', ui-monospace, monospace",
    fontBody: 'Inter, system-ui, sans-serif',
  },
};

// =============================================================
// ORDRE DES TEMPLATES
// =============================================================

export const themeOrder: TemplateId[] = [
  'modern',
  'classic',
  'minimal',
  'corporate',
  'editorial',
  'executive',
  'swiss',
  'tech',
];

// =============================================================
// POLICES
// =============================================================

export const fontFamilies: {
  id: string;
  label: string;
  stack: string;
}[] = [

  {
    id: 'inter',
    label: 'Inter (Sans)',
    stack: "'Inter', system-ui, sans-serif",
  },

  {
    id: 'georgia',
    label: 'Georgia (Serif)',
    stack: "Georgia, 'Times New Roman', serif",
  },

  {
    id: 'mono',
    label: 'Mono',
    stack: "'JetBrains Mono', ui-monospace, monospace",
  },

  {
    id: 'system',
    label: 'Système',
    stack: 'system-ui, -apple-system, sans-serif',
  },

];

// =============================================================
// RESOLVE FONT
// =============================================================

export function resolveFontStack(
  id: string,
  fallback: string
): string {

  return (
    fontFamilies.find(
      (f) => f.id === id
    )?.stack ?? fallback
  );
}

// =============================================================
// COLOR PRESETS
// =============================================================

export const colorPresets: {
  name: string;
  primary: string;
  accent: string;
}[] = [

  {
    name: 'Teal',
    primary: '#0f766e',
    accent: '#f59e0b',
  },

  {
    name: 'Navy',
    primary: '#1e3a5f',
    accent: '#b45309',
  },

  {
    name: 'Slate',
    primary: '#111827',
    accent: '#2563eb',
  },

  {
    name: 'Forest',
    primary: '#166534',
    accent: '#ca8a04',
  },

  {
    name: 'Plum',
    primary: '#7c2d12',
    accent: '#0ea5e9',
  },

  {
    name: 'Crimson',
    primary: '#991b1b',
    accent: '#0891b2',
  },

];