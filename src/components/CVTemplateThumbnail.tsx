import React, {
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

interface Props {
  data: CVData;
  template: TemplateId;
  className?: string;
}

const A4_WIDTH = 794;
const A4_HEIGHT = 1123;

function renderTemplate(
  data: CVData,
  template: TemplateId,
  colors: ThemeColors,
  fonts: {
    heading: string;
    body: string;
  },
  fontScale: number,
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

    default:
      return null;
  }
}

export default function CVTemplateThumbnail({
  data,
  template,
  className = '',
}: Props) {
  const containerRef =
    useRef<HTMLDivElement>(null);

  const [scale, setScale] =
    useState(0.25);

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
        theme.fontBody,
      );

    const style =
      data.style;

    const colors: ThemeColors = {
      primary:
        style.primary ||
        theme.colors.primary,

      secondary:
        style.secondary ||
        theme.colors.secondary,

      accent:
        style.accent ||
        theme.colors.accent,

      text:
        style.text ||
        theme.colors.text,

      muted:
        style.muted ||
        theme.colors.muted,

      background:
        theme.colors.background,

      surface:
        style.surface ||
        theme.colors.surface,

      border:
        style.border ||
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
    data.style,
    template,
  ]);

  useLayoutEffect(() => {
    const element =
      containerRef.current;

    if (!element) {
      return;
    }

    const calculate =
      () => {
        const width =
          element.clientWidth;

        if (!width) {
          return;
        }

        setScale(
          width / A4_WIDTH,
        );
      };

    calculate();

    const observer =
      new ResizeObserver(
        calculate,
      );

    observer.observe(
      element,
    );

    return () =>
      observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={`
        relative
        w-full
        overflow-hidden
        bg-white
        ${className}
      `}
      style={{
        aspectRatio:
          `${A4_WIDTH} / ${A4_HEIGHT}`,
      }}
    >
      <div
        className="
          absolute
          left-0
          top-0
          origin-top-left
        "
        style={{
          width: A4_WIDTH,
          height: A4_HEIGHT,
          transform:
            `scale(${scale})`,
        }}
      >
        <div
          className="
            relative
            bg-white
          "
          style={{
            width: A4_WIDTH,
            height: A4_HEIGHT,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: A4_WIDTH,
              minHeight: A4_HEIGHT,
            }}
          >
            {renderTemplate(
              data,
              template,
              colors,
              fonts,
              fontScale,
            )}
          </div>
        </div>
      </div>
    </div>
  );
}