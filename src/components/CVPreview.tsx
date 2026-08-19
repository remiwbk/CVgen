import {
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import type {
  CVData,
  TemplateId,
  ThemeColors,
} from '@/types/types';

import {
  themes,
  resolveFontStack,
} from '@/themes';

import ModernTemplate from '@/components/templates/ModernTemplate';
import ClassicTemplate from '@/components/templates/ClassicTemplate';
import MinimalTemplate from '@/components/templates/MinimalTemplate';
import CorporateTemplate from '@/components/templates/CorporateTemplate';
import EditorialTemplate from '@/components/templates/EditorialTemplate';
import ExecutiveTemplate from '@/components/templates/ExecutiveTemplate';
import SwissTemplate from '@/components/templates/SwissTemplate';
import TechTemplate from '@/components/templates/TechTemplate';

export interface CVPreviewHandle {
  getPageEl: () => HTMLElement | null;
}

interface Props {
  data: CVData;
  template: TemplateId;
  captureMode?: boolean;
}

/**
 * A4 en pixels à 96 DPI.
 *
 * 210mm × 297mm
 */
const PAGE_PX_WIDTH =
  210 * (96 / 25.4);

const PAGE_PX_HEIGHT =
  297 * (96 / 25.4);

const MIN_SCALE = 0.4;

function renderTemplate(
  data: CVData,
  template: TemplateId,
  colors: ThemeColors,
  fonts: {
    heading: string;
    body: string;
  },
  fontScale: number
) {
  switch (template) {

    case 'modern':
      return (
        <ModernTemplate
          data={data}
          colors={colors}
          fonts={fonts}
          fontScale={fontScale}
        />
      );

    case 'classic':
      return (
        <ClassicTemplate
          data={data}
          colors={colors}
          fonts={fonts}
          fontScale={fontScale}
        />
      );

    case 'minimal':
      return (
        <MinimalTemplate
          data={data}
          colors={colors}
          fonts={fonts}
          fontScale={fontScale}
        />
      );

    case 'corporate':
      return (
        <CorporateTemplate
          data={data}
          colors={colors}
          fonts={fonts}
          fontScale={fontScale}
        />
      );

    case 'editorial':
      return (
        <EditorialTemplate
          data={data}
          colors={colors}
          fonts={fonts}
          fontScale={fontScale}
        />
      );

    case 'executive':
      return (
        <ExecutiveTemplate
          data={data}
          colors={colors}
          fonts={fonts}
          fontScale={fontScale}
        />
      );

    case 'swiss':
      return (
        <SwissTemplate
          data={data}
          colors={colors}
          fonts={fonts}
          fontScale={fontScale}
        />
      );

    case 'tech':
      return (
        <TechTemplate
          data={data}
          colors={colors}
          fonts={fonts}
          fontScale={fontScale}
        />
      );
  }
}

const CVPreview = forwardRef<
  CVPreviewHandle,
  Props
>(
  (
    {
      data,
      template,
      captureMode = false,
    },
    ref
  ) => {
    const paneRef =
      useRef<HTMLDivElement>(null);

    const pageRef =
      useRef<HTMLDivElement>(null);

    const contentRef =
      useRef<HTMLDivElement>(null);

    const [fitScale, setFitScale] =
      useState(1);

    const [contentScale, setContentScale] =
      useState(1);

    /**
     * Rend la page A4 accessible à App.tsx.
     */
    useImperativeHandle(
      ref,
      () => ({
        getPageEl: () =>
          pageRef.current,
      }),
      []
    );

    /**
     * =========================================================
     * THEME
     * =========================================================
     */

    const {
      colors,
      fonts,
      fontScale,
    } = useMemo(() => {
      const theme =
        themes[template];

      const fontStack =
        resolveFontStack(
          data.style.fontFamily,
          theme.fontBody
        );

      const s = data.style;

      const colors: ThemeColors = {
        primary:
          s.primary ||
          theme.colors.primary,

        secondary:
          s.secondary ||
          theme.colors.secondary,

        accent:
          s.accent ||
          theme.colors.accent,

        text:
          s.text ||
          theme.colors.text,

        muted:
          s.muted ||
          theme.colors.muted,

        background:
          theme.colors.background,

        surface:
          s.surface ||
          theme.colors.surface,

        border:
          s.border ||
          theme.colors.border,
      };

      return {
        colors,

        fonts: {
          heading: fontStack,
          body: fontStack,
        },

        fontScale:
          data.style.fontScale,
      };
    }, [
      template,
      data.style,
    ]);

    /**
     * =========================================================
     * FIT PREVIEW
     * =========================================================
     */

    useLayoutEffect(() => {
      if (captureMode) {
        setFitScale(1);
        return;
      }

      const compute = () => {
        const pane =
          paneRef.current;

        if (!pane) return;

        const available =
          pane.clientWidth - 48;

        const scale =
          Math.min(
            1,
            available /
              PAGE_PX_WIDTH
          );

        setFitScale(scale);
      };

      compute();

      const ro =
        new ResizeObserver(
          compute
        );

      if (paneRef.current) {
        ro.observe(
          paneRef.current
        );
      }

      return () =>
        ro.disconnect();
    }, [captureMode]);

    /**
     * =========================================================
     * AUTO-SCALE DU CONTENU
     * =========================================================
     *
     * On conserve ton comportement :
     * le contenu est réduit si nécessaire pour tenir dans A4.
     */
    useLayoutEffect(() => {
      const compute = () => {
        const content =
          contentRef.current;

        if (!content) return;

        const natural =
          content.scrollHeight;

        if (natural <= 0) return;

        const scale =
          Math.max(
            MIN_SCALE,
            Math.min(
              1,
              PAGE_PX_HEIGHT /
                natural
            )
          );

        setContentScale(scale);
      };

      compute();

      const ro =
        new ResizeObserver(
          compute
        );

      if (contentRef.current) {
        ro.observe(
          contentRef.current
        );
      }

      return () =>
        ro.disconnect();
    }, [
      data,
      template,
      colors,
      fonts,
      fontScale,
    ]);

    /**
     * =========================================================
     * RENDER
     * =========================================================
     */

    return (
      <div
        ref={paneRef}
        className="
          preview-scroll
          w-full
          h-full
          overflow-auto
          flex
          items-start
          justify-center
          p-6
          bg-slate-200
        "
      >
        {/* ===================================================
            WRAPPER DE MISE À L'ÉCHELLE
        ==================================================== */}

        <div
          style={{
            width:
              PAGE_PX_WIDTH *
              fitScale,

            height:
              captureMode
                ? PAGE_PX_HEIGHT *
                  fitScale
                : 'auto',
          }}
          className="
            relative
            shrink-0
          "
        >
          {/* =================================================
              SCALE DE L'APERÇU
          ================================================== */}

          <div
            style={{
              transform:
                `scale(${fitScale})`,

              transformOrigin:
                'top left',

              width:
                PAGE_PX_WIDTH,
            }}
          >
            {/* ===============================================
                VRAIE PAGE A4

                C'est CET élément que l'on exporte.
            ================================================ */}

            <div
              ref={pageRef}
              className="
                a4-page
                cv-export-page
                bg-white
              "
              style={{
                width: '210mm',
                minWidth: '210mm',

                height: '297mm',
                minHeight: '297mm',

                position:
                  'relative',

                overflow:
                  'hidden',

                boxSizing:
                  'border-box',
              }}
            >
              {/* =============================================
                  SCALE DU CONTENU
              ============================================== */}

              <div
                style={{
                  transform:
                    `scale(${contentScale})`,

                  transformOrigin:
                    'top left',

                  width:
                    `${100 / contentScale}%`,
                }}
              >
                <div
                  ref={contentRef}
                >
                  {renderTemplate(
                    data,
                    template,
                    colors,
                    fonts,
                    fontScale
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

CVPreview.displayName =
  'CVPreview';

export default CVPreview;