import {
  ArrowRight,
  Check,
  ChevronDown,
  FileText,
  Github,
  Linkedin,
  Mail,
  Menu,
  Play,
  Sparkles,
  X,
} from 'lucide-react';

import {
  useEffect,
  useState,
} from 'react';

import type {
  CVData,
  TemplateId,
} from '@/types/types';

import {
  emptyCV,
} from '@/types/types';

import {
  themeOrder,
  themes,
} from '@/themes';

import CVTemplateThumbnail from '@/components/CVTemplateThumbnail';

interface LandingPageProps {
  onStart: () => void;
  onLegal: () => void;
  onPrivacy: () => void;
}

const templateDescriptions: Record<
  TemplateId,
  string
> = {
  modern:
    'Un design moderne et équilibré pour mettre ton profil en valeur.',
  classic:
    'Un style intemporel et élégant adapté aux candidatures classiques.',
  minimal:
    'Une présentation épurée qui laisse toute la place à ton contenu.',
  corporate:
    'Une présentation professionnelle pensée pour les environnements corporate.',
  editorial:
    'Une mise en page créative inspirée des magazines et du design éditorial.',
  executive:
    'Un rendu premium pour les profils expérimentés et les postes à responsabilités.',
  swiss:
    'Une grille structurée et précise inspirée du design suisse.',
  tech:
    'Un style moderne orienté tech, parfait pour les profils IT et numériques.',
};

const featureList = [
  'Création de CV directement dans le navigateur',
  '8 templates professionnels',
  'Prévisualisation A4 en temps réel',
  'Export PDF et PNG',
  'Sauvegarde automatique locale',
  'Import et export au format .cvgen',
];

const faqItems = [
  {
    question:
      'Mes données sont-elles envoyées sur un serveur ?',
    answer:
      'Non. Les CV sont sauvegardés localement dans le navigateur via IndexedDB. Tes données restent sur ton appareil.',
  },
  {
    question:
      'Puis-je créer plusieurs CV ?',
    answer:
      'Oui. Tu peux créer autant de CV que tu veux, les renommer, les dupliquer et les supprimer depuis ta bibliothèque.',
  },
  {
    question:
      'Puis-je changer de template après avoir créé mon CV ?',
    answer:
      'Oui. Le contenu de ton CV est séparé du template. Tu peux donc changer complètement de style sans perdre tes informations.',
  },
  {
    question:
      'Le PDF est-il au format A4 ?',
    answer:
      'Oui. Le rendu est conçu autour d’une véritable page A4 de 210 × 297 mm.',
  },
  {
    question:
      'Puis-je récupérer mon CV plus tard ?',
    answer:
      'Oui. Tant que les données du site sont conservées dans ton navigateur, tes CV restent disponibles. Tu peux également exporter un fichier .cvgen pour conserver une copie.',
  },
  {
    question:
      'Le générateur est-il gratuit ?',
    answer:
      'Oui. Le générateur fonctionne directement dans ton navigateur et ne nécessite pas de compte pour créer et exporter un CV.',
  },
];

function TemplatePreview({
  template,
  data,
  onClick,
}: {
  template: TemplateId;
  data: CVData;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        group
        block
        w-full
        min-w-0
        overflow-hidden
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-3
        text-left
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-slate-300
        hover:shadow-xl
        focus:outline-none
        focus:ring-2
        focus:ring-slate-900
        focus:ring-offset-2
      "
    >
      <div
        className="
          relative
          w-full
          min-w-0
          overflow-hidden
          rounded-xl
          bg-slate-100
        "
      >
        <div
          className="
            pointer-events-none
            w-full
            min-w-0
            overflow-hidden
          "
        >
          <CVTemplateThumbnail
            template={template}
            data={data}
            className="block w-full max-w-full"
          />
        </div>

        <div
          className="
            absolute
            inset-0
            flex
            items-end
            justify-center
            bg-gradient-to-t
            from-slate-950/60
            via-transparent
            to-transparent
            opacity-0
            transition-opacity
            duration-300
            group-hover:opacity-100
          "
        >
          <span
            className="
              mb-5
              rounded-full
              bg-white
              px-4
              py-2
              text-xs
              font-semibold
              text-slate-900
              shadow-lg
            "
          >
            Utiliser ce template
          </span>
        </div>
      </div>

      <div className="px-1 pb-1 pt-4">
        <div className="flex min-w-0 items-center justify-between gap-3">
          <h3 className="min-w-0 truncate text-sm font-bold text-slate-900">
            {themes[template].name}
          </h3>

          <ArrowRight
            className="
              h-4
              w-4
              shrink-0
              text-slate-300
              transition-all
              duration-300
              group-hover:translate-x-1
              group-hover:text-slate-900
            "
          />
        </div>

        <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
          {templateDescriptions[template]}
        </p>
      </div>
    </button>
  );
}

export default function LandingPage({
  onStart,
  onLegal,
  onPrivacy,
}: LandingPageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const [activeFaq, setActiveFaq] =
    useState<number | null>(null);

  const [activeTheme, setActiveTheme] =
    useState<TemplateId>('modern');

  const [visible, setVisible] =
    useState(false);

  /*
   * ============================================================
   * HERO : APPARITION INITIALE
   * ============================================================
   */

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setVisible(true);
    }, 50);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  /*
   * ============================================================
   * HERO : ROTATION AUTOMATIQUE DES TEMPLATES
   * ============================================================
   */

  useEffect(() => {
    if (themeOrder.length <= 1) {
      return;
    }

    const mediaQuery = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    );

    if (mediaQuery.matches) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveTheme((currentTheme) => {
        const currentIndex =
          themeOrder.indexOf(currentTheme);

        const nextIndex =
          currentIndex === -1
            ? 0
            : (currentIndex + 1) %
              themeOrder.length;

        return themeOrder[nextIndex];
      });
    }, 3000);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  /*
   * ============================================================
   * SCROLL REVEAL
   * ============================================================
   */

  useEffect(() => {
    const elements =
      document.querySelectorAll(
        '[data-scroll-reveal]'
      );

    if (
      !('IntersectionObserver' in window)
    ) {
      elements.forEach((element) => {
        element.classList.add(
          'scroll-reveal-visible'
        );
      });

      return;
    }

    const mediaQuery =
      window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      );

    if (mediaQuery.matches) {
      elements.forEach((element) => {
        element.classList.add(
          'scroll-reveal-visible'
        );
      });

      return;
    }

    const observer =
      new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (
              entry.isIntersecting
            ) {
              entry.target.classList.add(
                'scroll-reveal-visible'
              );

              observer.unobserve(
                entry.target
              );
            }
          });
        },
        {
          threshold: 0,
          rootMargin:
            '0px 0px -20px 0px',
        }
      );

    elements.forEach((element) => {
      observer.observe(element);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  /*
   * ============================================================
   * NAVIGATION
   * ============================================================
   */

  const scrollTo = (
    id: string
  ) => {
    setMobileMenuOpen(false);

    document
      .getElementById(id)
      ?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
  };

  return (
    <div className="min-h-screen w-full min-w-0 overflow-x-hidden bg-white text-slate-900">

      {/* =====================================================
          GLOBAL ANIMATIONS
      ====================================================== */}

      <style>
        {`
          /*
           * --------------------------------------------------
           * SCROLL REVEAL
           * --------------------------------------------------
           */

          [data-scroll-reveal] {
            opacity: 0;
            transform: translateY(16px);
            transition:
              opacity 500ms ease-out,
              transform 500ms cubic-bezier(0.22, 1, 0.36, 1);
          }

          [data-scroll-reveal].scroll-reveal-visible {
            opacity: 1;
            transform: translateY(0);
          }

          [data-scroll-reveal-delay="1"] {
            transition-delay: 100ms;
          }

          [data-scroll-reveal-delay="2"] {
            transition-delay: 180ms;
          }

          [data-scroll-reveal-delay="3"] {
            transition-delay: 260ms;
          }

          /*
           * --------------------------------------------------
           * TEMPLATE PREVIEW
           * --------------------------------------------------
           */

          @keyframes templateFade {
            0% {
              opacity: 0;
              transform: translateY(8px) scale(0.995);
            }

            100% {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          /*
           * --------------------------------------------------
           * TEMPLATE LABEL
           * --------------------------------------------------
           */

          @keyframes templateLabel {
            0% {
              opacity: 0;
              transform: translateX(8px);
            }

            100% {
              opacity: 1;
              transform: translateX(0);
            }
          }

          /*
           * --------------------------------------------------
           * REDUCED MOTION
           * --------------------------------------------------
           */

          @media (prefers-reduced-motion: reduce) {
            [data-scroll-reveal] {
              opacity: 1;
              transform: none;
              transition: none;
            }

            * {
              scroll-behavior: auto !important;
            }
          }
        `}
      </style>

      {/* =====================================================
          NAVBAR
      ====================================================== */}

      <header
        className="
          fixed
          inset-x-0
          top-0
          z-50
          w-full
          border-b
          border-slate-200/70
          bg-white/85
          backdrop-blur-xl
        "
      >
        <div
          className="
            mx-auto
            flex
            h-16
            w-full
            max-w-7xl
            min-w-0
            items-center
            justify-between
            gap-3
            px-4
            sm:px-8
            lg:px-10
          "
        >
          <button
            type="button"
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: 'smooth',
              })
            }
            className="
              flex
              min-w-0
              shrink
              items-center
              gap-2.5
              text-left
            "
          >
            <div
              className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-slate-900
                text-white
              "
            >
              <FileText className="h-4 w-4" />
            </div>

            <div className="min-w-0 leading-none">
              <div className="truncate text-sm font-bold tracking-tight">
                CV Studio
              </div>

              <div className="mt-1 truncate text-[10px] text-slate-400">
                Générateur de CV
              </div>
            </div>
          </button>

          <nav className="hidden shrink-0 items-center gap-7 md:flex">
            <button
              type="button"
              onClick={() =>
                scrollTo('templates')
              }
              className="text-sm text-slate-500 transition hover:text-slate-900"
            >
              Templates
            </button>

            <button
              type="button"
              onClick={() =>
                scrollTo('features')
              }
              className="text-sm text-slate-500 transition hover:text-slate-900"
            >
              Fonctionnalités
            </button>

            <button
              type="button"
              onClick={() =>
                scrollTo('faq')
              }
              className="text-sm text-slate-500 transition hover:text-slate-900"
            >
              FAQ
            </button>
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={onStart}
              className="
                hidden
                items-center
                rounded-xl
                bg-slate-900
                px-4
                py-2.5
                text-xs
                font-semibold
                text-white
                shadow-sm
                transition
                hover:-translate-y-0.5
                hover:bg-slate-700
                sm:inline-flex
              "
            >
              Créer mon CV

              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </button>

            <button
              type="button"
              onClick={() =>
                setMobileMenuOpen(
                  (value) => !value
                )
              }
              className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-lg
                text-slate-600
                hover:bg-slate-100
                md:hidden
              "
              aria-label="Menu"
              aria-expanded={
                mobileMenuOpen
              }
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div
            className="
              border-t
              border-slate-100
              bg-white
              px-4
              py-4
              sm:px-8
              md:hidden
            "
          >
            <div className="mx-auto flex max-w-7xl flex-col gap-1">
              <button
                type="button"
                onClick={() =>
                  scrollTo('templates')
                }
                className="
                  rounded-lg
                  px-3
                  py-3
                  text-left
                  text-sm
                  text-slate-600
                  hover:bg-slate-50
                "
              >
                Templates
              </button>

              <button
                type="button"
                onClick={() =>
                  scrollTo('features')
                }
                className="
                  rounded-lg
                  px-3
                  py-3
                  text-left
                  text-sm
                  text-slate-600
                  hover:bg-slate-50
                "
              >
                Fonctionnalités
              </button>

              <button
                type="button"
                onClick={() =>
                  scrollTo('faq')
                }
                className="
                  rounded-lg
                  px-3
                  py-3
                  text-left
                  text-sm
                  text-slate-600
                  hover:bg-slate-50
                "
              >
                FAQ
              </button>

              <button
                type="button"
                onClick={onStart}
                className="
                  mt-2
                  w-full
                  rounded-xl
                  bg-slate-900
                  px-4
                  py-3
                  text-sm
                  font-semibold
                  text-white
                "
              >
                Créer mon CV
              </button>
            </div>
          </div>
        )}
      </header>

      {/* =====================================================
          HERO
      ====================================================== */}

      <main className="w-full min-w-0">

        <section
          className="
            relative
            w-full
            overflow-hidden
            pt-24
            pb-16
            sm:pt-32
            sm:pb-20
            lg:pt-40
            lg:pb-28
          "
        >
          <div
            className="
              pointer-events-none
              absolute
              inset-0
              -z-10
              overflow-hidden
            "
          >
            <div
              className="
                absolute
                left-1/2
                top-[-250px]
                h-[500px]
                w-[500px]
                -translate-x-1/2
                rounded-full
                bg-slate-100
                blur-3xl
                sm:top-[-300px]
                sm:h-[700px]
                sm:w-[900px]
              "
            />

            <div
              className="
                absolute
                left-[5%]
                top-[30%]
                h-24
                w-24
                rounded-full
                bg-slate-100
                blur-3xl
                sm:left-[10%]
                sm:h-32
                sm:w-32
              "
            />

            <div
              className="
                absolute
                right-[2%]
                top-[40%]
                h-28
                w-28
                rounded-full
                bg-slate-100
                blur-3xl
                sm:right-[5%]
                sm:h-40
                sm:w-40
              "
            />
          </div>

          <div
            className="
              mx-auto
              w-full
              max-w-7xl
              min-w-0
              px-4
              sm:px-8
              lg:px-10
            "
          >
            <div
              className="
                grid
                min-w-0
                items-center
                gap-12
                sm:gap-14
                lg:grid-cols-[0.9fr_1.1fr]
                lg:gap-16
              "
            >
              <div
                className={`
                  mx-auto
                  w-full
                  min-w-0
                  max-w-xl
                  transition-all
                  duration-1000
                  lg:mx-0
                  ${
                    visible
                      ? 'translate-y-0 opacity-100'
                      : 'translate-y-8 opacity-0'
                  }
                `}
              >
                <div
                  className="
                    mb-5
                    inline-flex
                    max-w-full
                    items-center
                    gap-2
                    rounded-full
                    border
                    border-slate-200
                    bg-white
                    px-3
                    py-1.5
                    text-xs
                    font-medium
                    text-slate-600
                    shadow-sm
                    sm:mb-6
                  "
                >
                  <Sparkles className="h-3.5 w-3.5 shrink-0 text-slate-900" />

                  <span className="min-w-0">
                    Un CV qui te ressemble, en quelques minutes
                  </span>
                </div>

                <h1
                  className="
                    max-w-full
                    break-words
                    text-[2.5rem]
                    font-black
                    leading-[0.98]
                    tracking-[-0.045em]
                    text-slate-950
                    xs:text-[2.7rem]
                    sm:text-6xl
                    lg:text-7xl
                  "
                >
                  Crée ton CV professionnel
                  <br />
                  <span className="text-slate-400">
                    gratuitement.
                  </span>
                </h1>

                <p
                  className="
                    mt-5
                    max-w-lg
                    text-[15px]
                    leading-6
                    text-slate-500
                    sm:mt-7
                    sm:text-lg
                    sm:leading-7
                  "
                >
                  Crée un CV professionnel en quelques
                  minutes. Choisis ton design, renseigne
                  tes expériences et exporte directement
                  ton CV au format A4.
                </p>

                <div
                  className="
                    mt-7
                    flex
                    w-full
                    max-w-full
                    flex-col
                    gap-3
                    sm:mt-9
                    sm:flex-row
                  "
                >
                  <button
                    type="button"
                    onClick={onStart}
                    className="
                      group
                      inline-flex
                      min-h-[50px]
                      w-full
                      min-w-0
                      items-center
                      justify-center
                      rounded-xl
                      bg-slate-900
                      px-4
                      py-3.5
                      text-center
                      text-sm
                      font-semibold
                      text-white
                      shadow-xl
                      shadow-slate-900/10
                      transition-all
                      duration-300
                      hover:-translate-y-1
                      hover:bg-slate-700
                      sm:w-auto
                      sm:px-5
                    "
                  >
                    <span className="truncate">
                      Créer mon CV gratuitement
                    </span>

                    <ArrowRight
                      className="
                        ml-2
                        h-4
                        w-4
                        shrink-0
                        transition-transform
                        group-hover:translate-x-1
                      "
                    />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      scrollTo('templates')
                    }
                    className="
                      inline-flex
                      min-h-[50px]
                      w-full
                      min-w-0
                      items-center
                      justify-center
                      rounded-xl
                      border
                      border-slate-200
                      bg-white
                      px-4
                      py-3.5
                      text-center
                      text-sm
                      font-semibold
                      text-slate-700
                      transition
                      hover:border-slate-300
                      hover:bg-slate-50
                      sm:w-auto
                      sm:px-5
                    "
                  >
                    <Play className="mr-2 h-3.5 w-3.5 shrink-0 fill-current" />

                    <span className="truncate">
                      Voir les templates
                    </span>
                  </button>
                </div>

                <div
                  className="
                    mt-7
                    flex
                    max-w-full
                    flex-wrap
                    items-center
                    gap-x-4
                    gap-y-2
                    text-xs
                    text-slate-400
                    sm:mt-8
                    sm:gap-x-5
                  "
                >
                  <span className="flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5 shrink-0 text-slate-700" />
                    Sans inscription
                  </span>

                  <span className="flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5 shrink-0 text-slate-700" />
                    Données locales
                  </span>

                  <span className="flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5 shrink-0 text-slate-700" />
                    Export PDF
                  </span>
                </div>
              </div>

              <div
                className={`
                  relative
                  w-full
                  min-w-0
                  transition-all
                  delay-150
                  duration-1000
                  ${
                    visible
                      ? 'translate-y-0 opacity-100'
                      : 'translate-y-12 opacity-0'
                  }
                `}
              >
                <div
                  className="
                    absolute
                    -inset-4
                    rounded-[2rem]
                    bg-slate-100
                    blur-2xl
                    sm:-inset-5
                  "
                />

                <div
                  className="
                    relative
                    mx-auto
                    w-full
                    max-w-[620px]
                    min-w-0
                    overflow-hidden
                    rounded-2xl
                    border
                    border-slate-200
                    bg-slate-100
                    p-3
                    shadow-2xl
                    shadow-slate-900/10
                    sm:p-5
                    lg:p-6
                  "
                >
                  <div
                    className="
                      w-full
                      min-w-0
                      overflow-hidden
                      rounded-xl
                      bg-white
                    "
                  >
                    <div
                      key={activeTheme}
                      className="
                        animate-[templateFade_500ms_ease-out]
                      "
                    >
                      <CVTemplateThumbnail
                        template={activeTheme}
                        data={emptyCV}
                        className="
                          block
                          h-auto
                          w-full
                          max-w-full
                        "
                      />
                    </div>
                  </div>

                  <div
                    className="
                      absolute
                      bottom-4
                      left-1/2
                      flex
                      max-w-[calc(100%-1.5rem)]
                      -translate-x-1/2
                      items-center
                      gap-1
                      overflow-x-auto
                      rounded-full
                      border
                      border-slate-200
                      bg-white/95
                      p-1.5
                      shadow-lg
                      backdrop-blur
                      sm:bottom-7
                      sm:gap-1.5
                    "
                  >
                    {themeOrder.map(
                      (template) => (
                        <button
                          key={template}
                          type="button"
                          onClick={() =>
                            setActiveTheme(
                              template
                            )
                          }
                          title={
                            themes[
                              template
                            ].name
                          }
                          aria-label={`Choisir le template ${themes[template].name}`}
                          className={`
                            h-2.5
                            w-2.5
                            shrink-0
                            rounded-full
                            transition-all
                            duration-300
                            ${
                              activeTheme ===
                              template
                                ? 'scale-125 bg-slate-900'
                                : 'bg-slate-300 hover:scale-110 hover:bg-slate-500'
                            }
                          `}
                        />
                      )
                    )}
                  </div>
                </div>

                <div
                  className="
                    absolute
                    -right-3
                    top-8
                    hidden
                    max-w-[160px]
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    px-3
                    py-2
                    text-xs
                    font-semibold
                    shadow-xl
                    sm:block
                  "
                >
                  <span
                    key={activeTheme}
                    className="
                      block
                      animate-[templateLabel_500ms_ease-out]
                    "
                  >
                    {themes[activeTheme].name}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SOCIAL PROOF */}

        <section
          className="border-y border-slate-100 bg-slate-50/70"
        >
          <div
            className="
              mx-auto
              flex
              w-full
              max-w-5xl
              flex-wrap
              items-center
              justify-center
              gap-x-5
              gap-y-3
              px-4
              py-6
              text-center
              text-xs
              text-slate-400
              sm:gap-x-12
              sm:px-8
            "
          >
            <span className="font-medium">
              Pensé pour les candidatures modernes
            </span>

            <span className="hidden h-4 w-px bg-slate-200 sm:block" />

            <span>Format A4</span>
            <span>PDF</span>
            <span>PNG</span>
            <span>8 templates</span>
            <span>100 % navigateur</span>
          </div>
        </section>

        {/* FEATURES */}

        <section
          id="features"
          className="
            scroll-mt-20
            py-20
            sm:py-32
          "
        >
          <div
            className="
              mx-auto
              w-full
              max-w-7xl
              min-w-0
              px-4
              sm:px-8
              lg:px-10
            "
          >
            <div
              data-scroll-reveal
              className="
                grid
                min-w-0
                gap-12
                lg:grid-cols-[0.8fr_1.2fr]
                lg:gap-14
              "
            >
              <div className="w-full min-w-0 max-w-lg">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                  Simple et efficace
                </span>

                <h2
                  className="
                    mt-4
                    text-3xl
                    font-black
                    tracking-tight
                    text-slate-950
                    sm:text-4xl
                  "
                >
                  Tout ce qu'il faut.
                  <br />
                  Rien de superflu.
                </h2>

                <p className="mt-5 text-sm leading-6 text-slate-500 sm:text-base">
                  CV Studio est conçu pour aller
                  rapidement de l'idée à un CV prêt à
                  envoyer, sans inscription compliquée ni
                  éditeur inutilement complexe.
                </p>

                <button
                  type="button"
                  onClick={onStart}
                  className="
                    mt-7
                    inline-flex
                    w-full
                    items-center
                    justify-center
                    rounded-xl
                    bg-slate-900
                    px-4
                    py-3
                    text-xs
                    font-semibold
                    text-white
                    transition
                    hover:bg-slate-700
                    sm:w-auto
                  "
                >
                  Commencer maintenant
                  <ArrowRight className="ml-2 h-3.5 w-3.5" />
                </button>
              </div>

              <div className="grid min-w-0 gap-3 sm:grid-cols-2">
                {featureList.map(
                  (feature, index) => (
                    <div
                      key={feature}
                      data-scroll-reveal
                      data-scroll-reveal-delay={
                        String(
                          (index % 3) + 1
                        )
                      }
                      className="
                        group
                        min-w-0
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                        p-5
                        transition-all
                        duration-300
                        hover:-translate-y-1
                        hover:shadow-lg
                      "
                    >
                      <div className="flex min-w-0 items-start gap-4">
                        <div
                          className="
                            flex
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            bg-slate-100
                            text-xs
                            font-bold
                            text-slate-700
                            transition
                            group-hover:bg-slate-900
                            group-hover:text-white
                          "
                        >
                          {String(
                            index + 1
                          ).padStart(2, '0')}
                        </div>

                        <p className="min-w-0 pt-1 text-sm font-semibold leading-5 text-slate-800">
                          {feature}
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </section>

        {/* TEMPLATES */}

        <section
          id="templates"
          className="
            scroll-mt-20
            border-y
            border-slate-100
            bg-slate-50
            py-16
            sm:py-32
          "
        >
          <div
            className="
              mx-auto
              w-full
              max-w-7xl
              min-w-0
              px-4
              sm:px-8
              lg:px-10
            "
          >
            <div
              data-scroll-reveal
              className="mx-auto w-full max-w-2xl text-center"
            >
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                Tes choix
              </span>

              <h2
                className="
                  mt-4
                  text-3xl
                  font-black
                  tracking-tight
                  text-slate-950
                  sm:text-4xl
                "
              >
                8 styles.
                <br />
                Un seul objectif : te démarquer.
              </h2>

              <p className="mt-5 text-sm leading-6 text-slate-500 sm:text-base">
                Chaque template est conçu pour conserver
                une vraie mise en page A4 et rester lisible
                par les recruteurs.
              </p>
            </div>

            <div
              className="
                mt-8
                -mx-4
                flex
                snap-x
                snap-mandatory
                gap-4
                overflow-x-auto
                px-4
                pb-4
                scrollbar-none
                sm:mx-0
                sm:mt-14
                sm:grid
                sm:grid-cols-2
                sm:gap-5
                sm:overflow-visible
                sm:px-0
                sm:pb-0
                lg:grid-cols-4
              "
            >
              {themeOrder.map(
                (template, index) => (
                  <div
                    key={template}
                    data-scroll-reveal
                    data-scroll-reveal-delay={
                      String(
                        (index % 3) + 1
                      )
                    }
                    className="
                      w-[calc(100vw-3rem)]
                      min-w-[calc(100vw-3rem)]
                      snap-center
                      sm:w-auto
                      sm:min-w-0
                    "
                  >
                    <TemplatePreview
                      template={template}
                      data={emptyCV}
                      onClick={() => {
                        setActiveTheme(
                          template
                        );

                        window.scrollTo({
                          top: 0,
                          behavior:
                            'smooth',
                        });

                        window.setTimeout(
                          () => {
                            onStart();
                          },
                          350
                        );
                      }}
                    />
                  </div>
                )
              )}
            </div>

            <div
              className="
                mt-2
                flex
                items-center
                justify-center
                gap-2
                text-[11px]
                text-slate-400
                sm:hidden
              "
            >
              <span>
                Fais glisser pour voir les 8 templates
              </span>

              <ArrowRight className="h-3 w-3" />
            </div>
          </div>
        </section>

        {/* CTA */}

        <section className="py-20 sm:py-32">
          <div
            data-scroll-reveal
            className="
              mx-auto
              w-full
              max-w-5xl
              px-4
              sm:px-8
            "
          >
            <div
              className="
                relative
                overflow-hidden
                rounded-[1.5rem]
                bg-slate-950
                px-5
                py-14
                text-center
                text-white
                shadow-2xl
                sm:rounded-[2rem]
                sm:px-12
                sm:py-20
              "
            >
              <div
                className="
                  pointer-events-none
                  absolute
                  -left-20
                  -top-20
                  h-64
                  w-64
                  rounded-full
                  bg-white/5
                  blur-3xl
                "
              />

              <div
                className="
                  pointer-events-none
                  absolute
                  -bottom-24
                  -right-20
                  h-72
                  w-72
                  rounded-full
                  bg-white/5
                  blur-3xl
                "
              />

              <div className="relative">
                <Sparkles className="mx-auto h-6 w-6 text-slate-400" />

                <h2
                  className="
                    mt-5
                    text-3xl
                    font-black
                    tracking-tight
                    sm:text-4xl
                  "
                >
                  Ton prochain CV commence ici.
                </h2>

                <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
                  Quelques minutes suffisent pour créer un
                  CV propre, professionnel et prêt à
                  envoyer.
                </p>

                <button
                  type="button"
                  onClick={onStart}
                  className="
                    mt-8
                    inline-flex
                    items-center
                    rounded-xl
                    bg-white
                    px-5
                    py-3.5
                    text-sm
                    font-bold
                    text-slate-950
                    transition-all
                    hover:-translate-y-1
                    hover:bg-slate-100
                  "
                >
                  Créer mon CV
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}

        <section
          id="faq"
          className="
            scroll-mt-20
            border-t
            border-slate-100
            bg-slate-50/60
            py-20
            sm:py-32
          "
        >
          <div
            className="
              mx-auto
              w-full
              max-w-3xl
              min-w-0
              px-4
              sm:px-8
            "
          >
            <div
              data-scroll-reveal
              className="text-center"
            >
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                FAQ
              </span>

              <h2
                className="
                  mt-4
                  text-3xl
                  font-black
                  tracking-tight
                  text-slate-950
                  sm:text-4xl
                "
              >
                Les questions fréquentes.
              </h2>
            </div>

            <div className="mt-10 space-y-2 sm:mt-12">
              {faqItems.map(
                (item, index) => {
                  const isOpen =
                    activeFaq ===
                    index;

                  return (
                    <div
                      key={
                        item.question
                      }
                      data-scroll-reveal
                      data-scroll-reveal-delay={
                        String(
                          (index % 3) + 1
                        )
                      }
                      className="
                        min-w-0
                        overflow-hidden
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                      "
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setActiveFaq(
                            isOpen
                              ? null
                              : index
                          )
                        }
                        className="
                          flex
                          w-full
                          min-w-0
                          items-center
                          justify-between
                          gap-4
                          px-4
                          py-5
                          text-left
                          sm:px-5
                        "
                      >
                        <span className="min-w-0 text-sm font-semibold text-slate-800">
                          {item.question}
                        </span>

                        <ChevronDown
                          className={`
                            h-4
                            w-4
                            shrink-0
                            text-slate-400
                            transition-transform
                            duration-300
                            ${
                              isOpen
                                ? 'rotate-180'
                                : ''
                            }
                          `}
                        />
                      </button>

                      <div
                        className={`
                          grid
                          transition-all
                          duration-300
                          ${
                            isOpen
                              ? 'grid-rows-[1fr]'
                              : 'grid-rows-[0fr]'
                          }
                        `}
                      >
                        <div className="min-h-0 overflow-hidden">
                          <p className="px-4 pb-5 text-sm leading-6 text-slate-500 sm:px-5">
                            {item.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </section>
      </main>

      {/* =====================================================
          FOOTER
      ====================================================== */}

      <footer className="w-full border-t border-slate-200 bg-white">
        <div
          data-scroll-reveal
          className="
            mx-auto
            flex
            w-full
            max-w-7xl
            flex-col
            gap-7
            px-4
            py-8
            sm:px-8
            lg:flex-row
            lg:items-center
            lg:justify-between
            lg:px-10
          "
        >
          <div className="flex items-center gap-2.5">
            <div
              className="
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center
                rounded-lg
                bg-slate-900
                text-white
              "
            >
              <FileText className="h-3.5 w-3.5" />
            </div>

            <div>
              <div className="text-xs font-bold text-slate-900">
                CV Studio
              </div>

              <div className="text-[10px] text-slate-400">
                Générateur de CV
              </div>
            </div>
          </div>

          <div
            className="
              flex
              w-full
              flex-wrap
              items-center
              gap-x-5
              gap-y-3
              text-xs
              text-slate-400
              lg:w-auto
            "
          >
            <button
              type="button"
              onClick={() =>
                scrollTo('templates')
              }
              className="hover:text-slate-900"
            >
              Templates
            </button>

            <button
              type="button"
              onClick={() =>
                scrollTo('faq')
              }
              className="hover:text-slate-900"
            >
              FAQ
            </button>

            <span className="max-w-full">
              Les données restent dans ton navigateur
            </span>
          </div>

          <div
            className="
              flex
              w-full
              flex-wrap
              items-center
              gap-2
              lg:w-auto
              lg:justify-end
            "
          >
            <a
              href="https://github.com/remiwbk/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center
                rounded-lg
                text-slate-400
                transition
                hover:bg-slate-100
                hover:text-slate-900
              "
            >
              <Github className="h-4 w-4" />
            </a>

            <a
              href="https://www.linkedin.com/in/rémi-dupire/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center
                rounded-lg
                text-slate-400
                transition
                hover:bg-slate-100
                hover:text-slate-900
              "
            >
              <Linkedin className="h-4 w-4" />
            </a>

            <a
              href="mailto:dupire.re@gmail.com"
              aria-label="Email"
              className="
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center
                rounded-lg
                text-slate-400
                transition
                hover:bg-slate-100
                hover:text-slate-900
              "
            >
              <Mail className="h-4 w-4" />
            </a>

            <button
              type="button"
              onClick={onLegal}
              className="
                whitespace-nowrap
                px-1
                text-xs
                text-slate-400
                transition
                hover:text-slate-900
              "
            >
              Mentions légales
            </button>

            <button
              type="button"
              onClick={onPrivacy}
              className="
                whitespace-nowrap
                px-1
                text-xs
                text-slate-400
                transition
                hover:text-slate-900
              "
            >
              Politique de confidentialité
            </button>
          </div>
        </div>

        <div className="border-t border-slate-100">
          <div
            className="
              mx-auto
              w-full
              max-w-7xl
              px-4
              py-4
              text-center
              text-[10px]
              text-slate-400
              sm:px-8
              lg:px-10
            "
          >
            CV Studio — Générateur de CV · 2026
          </div>
        </div>
      </footer>
    </div>
  );
}