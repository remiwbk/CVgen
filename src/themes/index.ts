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
  secondary: string;
  accent: string;
  text: string;
  muted: string;
  surface: string;
  border: string;
}[] = [

  // -----------------------------------------------------------
  // OCEAN
  // -----------------------------------------------------------

  {
    name: 'Ocean',
    primary: '#0F766E',
    secondary: '#134E4A',
    accent: '#F59E0B',
    text: '#0F172A',
    muted: '#64748B',
    surface: '#F0FDFA',
    border: '#CCFBF1',
  },

  // -----------------------------------------------------------
  // NAVY
  // -----------------------------------------------------------

  {
    name: 'Navy',
    primary: '#1E3A5F',
    secondary: '#0F2540',
    accent: '#D97706',
    text: '#172033',
    muted: '#64748B',
    surface: '#F5F8FC',
    border: '#D6E0EB',
  },

  // -----------------------------------------------------------
  // SLATE
  // -----------------------------------------------------------

  {
    name: 'Slate',
    primary: '#1E293B',
    secondary: '#334155',
    accent: '#2563EB',
    text: '#0F172A',
    muted: '#64748B',
    surface: '#F8FAFC',
    border: '#E2E8F0',
  },

  // -----------------------------------------------------------
  // FOREST
  // -----------------------------------------------------------

  {
    name: 'Forest',
    primary: '#166534',
    secondary: '#14532D',
    accent: '#CA8A04',
    text: '#172116',
    muted: '#647064',
    surface: '#F3F8F3',
    border: '#D5E5D6',
  },

  // -----------------------------------------------------------
  // PLUM
  // -----------------------------------------------------------

  {
    name: 'Plum',
    primary: '#6B21A8',
    secondary: '#581C87',
    accent: '#0891B2',
    text: '#24152F',
    muted: '#6B7280',
    surface: '#FAF5FF',
    border: '#E9D5FF',
  },

  // -----------------------------------------------------------
  // CRIMSON
  // -----------------------------------------------------------

  {
    name: 'Crimson',
    primary: '#991B1B',
    secondary: '#7F1D1D',
    accent: '#0E7490',
    text: '#2A1515',
    muted: '#6B7280',
    surface: '#FEF2F2',
    border: '#FECACA',
  },

  // -----------------------------------------------------------
  // CHARCOAL
  // -----------------------------------------------------------

  {
    name: 'Charcoal',
    primary: '#18181B',
    secondary: '#3F3F46',
    accent: '#B08D57',
    text: '#18181B',
    muted: '#71717A',
    surface: '#FAFAFA',
    border: '#E4E4E7',
  },

  // -----------------------------------------------------------
  // INDIGO
  // -----------------------------------------------------------

  {
    name: 'Indigo',
    primary: '#3730A3',
    secondary: '#312E81',
    accent: '#7C3AED',
    text: '#1E1B4B',
    muted: '#6B7280',
    surface: '#F5F3FF',
    border: '#DDD6FE',
  },

];