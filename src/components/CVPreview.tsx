import { forwardRef, useImperativeHandle, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { CVData, TemplateId, ThemeColors } from '@/types/types';
import { themes, resolveFontStack } from '@/themes';
import ModernTemplate from '@/components/templates/ModernTemplate';
import ClassicTemplate from '@/components/templates/ClassicTemplate';
import MinimalTemplate from '@/components/templates/MinimalTemplate';

export interface CVPreviewHandle {
  getPageEl: () => HTMLElement | null;
}

interface Props {
  data: CVData;
  template: TemplateId;
  captureMode?: boolean;
}

const PAGE_PX_WIDTH = 210 * (96 / 25.4); // ~793.7px
const PAGE_PX_HEIGHT = 297 * (96 / 25.4); // ~1122.5px
const MIN_SCALE = 0.4;

function renderTemplate(data: CVData, template: TemplateId, colors: ThemeColors, fonts: { heading: string; body: string }, fontScale: number) {
  switch (template) {
    case 'classic':
      return <ClassicTemplate data={data} colors={colors} fonts={fonts} fontScale={fontScale} />;
    case 'minimal':
      return <MinimalTemplate data={data} colors={colors} fonts={fonts} fontScale={fontScale} />;
    default:
      return <ModernTemplate data={data} colors={colors} fonts={fonts} fontScale={fontScale} />;
  }
}

const CVPreview = forwardRef<CVPreviewHandle, Props>(({ data, template, captureMode = false }, ref) => {
  const paneRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [fitScale, setFitScale] = useState(1);
  const [contentScale, setContentScale] = useState(1);

  useImperativeHandle(ref, () => ({
    getPageEl: () => pageRef.current,
  }));

  // Resolve effective colors + fonts from theme + user overrides.
  const { colors, fonts, fontScale } = useMemo(() => {
    const theme = themes[template];
    const fontStack = resolveFontStack(data.style.fontFamily, theme.fontBody);
    const s = data.style;
    const colors: ThemeColors = {
      primary: s.primary || theme.colors.primary,
      secondary: s.secondary || theme.colors.secondary,
      accent: s.accent || theme.colors.accent,
      text: s.text || theme.colors.text,
      muted: s.muted || theme.colors.muted,
      background: theme.colors.background,
      surface: s.surface || theme.colors.surface,
      border: s.border || theme.colors.border,
    };
    return { colors, fonts: { heading: fontStack, body: fontStack }, fontScale: data.style.fontScale };
  }, [template, data.style]);

  // Fit the A4 page into the available pane width.
  useLayoutEffect(() => {
    if (captureMode) {
      setFitScale(1);
      return;
    }
    const compute = () => {
      const pane = paneRef.current;
      if (!pane) return;
      const available = pane.clientWidth - 48;
      setFitScale(Math.min(1, available / PAGE_PX_WIDTH));
    };
    compute();
    const ro = new ResizeObserver(compute);
    if (paneRef.current) ro.observe(paneRef.current);
    return () => ro.disconnect();
  }, [captureMode]);

  // Auto-scale: shrink content so it always fits within A4 height. Never grows beyond 1.
  useLayoutEffect(() => {
    const compute = () => {
      const content = contentRef.current;
      if (!content) return;
      const natural = content.scrollHeight;
      if (natural <= 0) return;
      const scale = Math.max(MIN_SCALE, Math.min(1, PAGE_PX_HEIGHT / natural));
      setContentScale(scale);
    };
    compute();
    const ro = new ResizeObserver(compute);
    if (contentRef.current) ro.observe(contentRef.current);
    return () => ro.disconnect();
  }, [data, template, colors, fonts, fontScale]);

  return (
    <div ref={paneRef} className="preview-scroll w-full h-full overflow-auto flex items-start justify-center p-6 bg-slate-200">
      <div
        style={{
          width: PAGE_PX_WIDTH * fitScale,
          height: captureMode ? PAGE_PX_HEIGHT * fitScale : 'auto',
        }}
        className="relative shrink-0"
      >
        <div style={{ transform: `scale(${fitScale})`, transformOrigin: 'top left', width: PAGE_PX_WIDTH }}>
          <div ref={pageRef} className="a4-page shadow-xl" style={{ width: `${210}mm`, minHeight: `${297}mm` }}>
            <div style={{ transform: `scale(${contentScale})`, transformOrigin: 'top left', width: `${100 / contentScale}%` }}>
              <div ref={contentRef}>{renderTemplate(data, template, colors, fonts, fontScale)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

CVPreview.displayName = 'CVPreview';
export default CVPreview;
