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

/**
 * Zoom visuel utilisateur.
 *
 * Le zoom ne touche PAS à la vraie page A4.
 * Il agit uniquement sur l'aperçu.
 */
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 1.5;
const ZOOM_STEP = 0.1;

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
     * Zoom uniquement visuel.
     *
     * 1 = 100 %
     */
    const [zoomScale, setZoomScale] =
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
     *
     * Calcule la taille permettant d'afficher la page
     * dans la largeur disponible.
     *
     * Ce scale est indépendant du zoom utilisateur.
     */
    useLayoutEffect(() => {
      if (captureMode) {
        setFitScale(1);
        return;
      }

      const compute = () => {
        const pane =
          paneRef.current;

        if (!pane) {
          return;
        }

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
     * Le contenu est réduit si nécessaire pour tenir
     * dans la page A4.
     *
     * Le zoom utilisateur n'intervient volontairement
     * PAS ici.
     */
    useLayoutEffect(() => {
      const compute = () => {
        const content =
          contentRef.current;

        if (!content) {
          return;
        }

        const natural =
          content.scrollHeight;

        if (natural <= 0) {
          return;
        }

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
     * ZOOM
     * =========================================================
     */

    const decreaseZoom = () => {
      setZoomScale(
        (current) =>
          Math.max(
            MIN_ZOOM,
            Number(
              (
                current -
                ZOOM_STEP
              ).toFixed(2)
            )
          )
      );
    };

    const increaseZoom = () => {
      setZoomScale(
        (current) =>
          Math.min(
            MAX_ZOOM,
            Number(
              (
                current +
                ZOOM_STEP
              ).toFixed(2)
            )
          )
      );
    };

    const resetZoom = () => {
      setZoomScale(1);
    };

    /**
     * =========================================================
     * RENDER
     * =========================================================
     */

    const previewScale =
      fitScale * zoomScale;

    return (
      <div
        ref={paneRef}
        className="
          preview-scroll
          relative
          w-full
          h-full
          overflow-auto
          flex
          items-start
          justify-center
          p-6
          pt-20
          sm:pt-20
          bg-slate-200
        "
      >
        {/* ===================================================
            CONTRÔLES DE ZOOM
        ==================================================== */}

        {!captureMode && (
          <div
            className="
              absolute
              z-20
              top-3
              right-3
              sm:top-4
              sm:right-4
              flex
              items-center
              gap-1
              rounded-xl
              border
              border-slate-200
              bg-white
              shadow-lg
              p-1
            "
          >
            {/* DÉZOOM */}

            <button
              type="button"
              onClick={
                decreaseZoom
              }
              disabled={
                zoomScale <=
                MIN_ZOOM
              }
              className="
                w-8
                h-8
                sm:w-9
                sm:h-9
                rounded-lg
                flex
                items-center
                justify-center
                text-slate-700
                text-lg
                font-medium
                hover:bg-slate-100
                active:bg-slate-200
                disabled:opacity-30
                disabled:cursor-not-allowed
                transition
              "
              title="Dézoomer"
              aria-label="Dézoomer"
            >
              −
            </button>

            {/* POURCENTAGE */}

            <button
              type="button"
              onClick={
                resetZoom
              }
              className="
                min-w-[54px]
                sm:min-w-[62px]
                h-8
                sm:h-9
                px-2
                rounded-lg
                text-[11px]
                sm:text-xs
                font-semibold
                text-slate-600
                hover:bg-slate-100
                transition
              "
              title="Réinitialiser le zoom"
              aria-label="Réinitialiser le zoom"
            >
              {Math.round(
                zoomScale * 100
              )}
              %
            </button>

            {/* ZOOM */}

            <button
              type="button"
              onClick={
                increaseZoom
              }
              disabled={
                zoomScale >=
                MAX_ZOOM
              }
              className="
                w-8
                h-8
                sm:w-9
                sm:h-9
                rounded-lg
                flex
                items-center
                justify-center
                text-slate-700
                text-lg
                font-medium
                hover:bg-slate-100
                active:bg-slate-200
                disabled:opacity-30
                disabled:cursor-not-allowed
                transition
              "
              title="Zoomer"
              aria-label="Zoomer"
            >
              +
            </button>
          </div>
        )}

        {/* ===================================================
            WRAPPER DE MISE À L'ÉCHELLE
        ==================================================== */}

        <div
          style={{
            width:
              PAGE_PX_WIDTH *
              previewScale,

            height:
              captureMode
                ? PAGE_PX_HEIGHT *
                  previewScale
                : PAGE_PX_HEIGHT *
                  previewScale,
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
                `scale(${previewScale})`,

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