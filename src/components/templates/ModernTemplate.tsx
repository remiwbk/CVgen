import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Calendar,
  Linkedin,
  Github,
  Car,
} from 'lucide-react';

import {
  useDroppable,
} from '@dnd-kit/core';

import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import type {
  CVData,
  ThemeColors,
  CVSectionId,
  CVSectionColumn,
} from '@/types/types';

import SortableSection from '@/components/SortableSection';

interface Props {
  data: CVData;
  colors: ThemeColors;
  fonts: {
    heading: string;
    body: string;
  };
  fontScale: number;
  captureMode?: boolean;
}

/**
 * =========================================================
 * ORDRE PAR DÉFAUT
 * =========================================================
 *
 * On conserve exactement l'ordre global du CV.
 * =========================================================
 */

const DEFAULT_SECTION_ORDER: CVSectionId[] = [
  'summary',
  'experiences',
  'education',
  'skills',
  'projects',
  'interests',
];

/**
 * =========================================================
 * COLONNES PAR DÉFAUT
 * =========================================================
 *
 * Layout original du Modern :
 *
 * LEFT  = 1 colonne sur 3
 * RIGHT = 2 colonnes sur 3
 *
 * Gauche :
 *   Profil
 *   Compétences
 *   Centres d'intérêt
 *   Projets
 *
 * Droite :
 *   Expériences
 *   Formation
 * =========================================================
 */

const DEFAULT_SECTION_COLUMNS: Record<
  CVSectionId,
  CVSectionColumn
> = {
  summary: 'left',
  skills: 'left',
  interests: 'left',
  projects: 'left',

  experiences: 'right',
  education: 'right',
};

/**
 * =========================================================
 * COLONNE DROPPABLE
 * =========================================================
 */

function ModernColumn({
  id,
  children,
  className,
}: {
  id:
    | 'section-column-left'
    | 'section-column-right';

  children: React.ReactNode;

  className?: string;
}) {
  const {
    setNodeRef,
    isOver,
  } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`
        relative
        min-w-0
        min-h-full
        rounded-sm
        transition

        ${
          isOver
            ? 'bg-slate-50/40'
            : ''
        }

        ${className ?? ''}
      `}
    >
      {children}
    </div>
  );
}

/**
 * =========================================================
 * CALCUL ÂGE
 * =========================================================
 */

function calculateAge(
  birthDate: string | undefined
): number | null {
  if (!birthDate) return null;

  const birth =
    new Date(birthDate);

  if (
    Number.isNaN(
      birth.getTime()
    )
  ) {
    return null;
  }

  const today =
    new Date();

  let age =
    today.getFullYear() -
    birth.getFullYear();

  const hasHadBirthday =
    today.getMonth() >
      birth.getMonth() ||
    (
      today.getMonth() ===
        birth.getMonth() &&
      today.getDate() >=
        birth.getDate()
    );

  if (!hasHadBirthday) {
    age--;
  }

  return age;
}

/**
 * =========================================================
 * TEMPLATE
 * =========================================================
 */

export default function ModernTemplate({
  data,
  colors,
  fonts,
  fontScale,
  captureMode = false,
}: Props) {
  const fs = (n: number) =>
    `${n * fontScale}px`;

  const hasSkills =
    data.skills.some(
      (c) =>
        c.items.length > 0
    );

  const age =
    calculateAge(
      data.birthDate
    );

  /**
   * =========================================================
   * ORDRE DES SECTIONS
   * =========================================================
   */

  const sectionOrder: CVSectionId[] =
    data.sectionOrder?.length
      ? data.sectionOrder
      : DEFAULT_SECTION_ORDER;

  /**
   * =========================================================
   * COLONNE D'UNE SECTION
   * =========================================================
   */

  const getSectionColumn = (
    sectionId: CVSectionId
  ): CVSectionColumn => {
    return (
      data.sectionColumns?.[
        sectionId
      ] ??
      DEFAULT_SECTION_COLUMNS[
        sectionId
      ]
    );
  };

  /**
   * =========================================================
   * ORDRE DANS CHAQUE COLONNE
   * =========================================================
   */

  const leftOrder =
    sectionOrder.filter(
      (sectionId) =>
        getSectionColumn(
          sectionId
        ) === 'left'
    );

  const rightOrder =
    sectionOrder.filter(
      (sectionId) =>
        getSectionColumn(
          sectionId
        ) === 'right'
    );

  /**
   * =========================================================
   * RENDER SECTION
   * =========================================================
   */

  const renderSection = (
    sectionId: CVSectionId
  ) => {
    switch (sectionId) {
      /**
       * =====================================================
       * PROFIL
       * =====================================================
       */

      case 'summary':
        if (!data.summary) {
          return null;
        }

        return (
          <SortableSection
            key="summary"
            id="summary"
            enabled={!captureMode}
          >
            <section>
              <h2
                style={{
                  color:
                    colors.primary,
                  fontFamily:
                    fonts.heading,
                  fontSize:
                    fs(13),
                }}
                className="
                  font-bold
                  uppercase
                  tracking-widest
                  mb-3
                  pb-2
                  border-b-2
                "
              >
                Profil
              </h2>

              <p
                style={{
                  fontSize:
                    fs(13),
                  color:
                    colors.muted,
                  whiteSpace:
                    'pre-line',
                }}
                className="
                  leading-relaxed
                "
              >
                {data.summary}
              </p>
            </section>
          </SortableSection>
        );

      /**
       * =====================================================
       * COMPÉTENCES
       * =====================================================
       */

      case 'skills':
        if (!hasSkills) {
          return null;
        }

        return (
          <SortableSection
            key="skills"
            id="skills"
            enabled={!captureMode}
          >
            <section>
              <h2
                style={{
                  color:
                    colors.primary,
                  fontFamily:
                    fonts.heading,
                  fontSize:
                    fs(13),
                }}
                className="
                  font-bold
                  uppercase
                  tracking-widest
                  mb-3
                  pb-2
                  border-b-2
                "
              >
                Compétences
              </h2>

              <div className="space-y-3">
                {data.skills.map(
                  (cat) =>
                    cat.items.length >
                      0 ? (
                      <div
                        key={
                          cat.id
                        }
                      >
                        <h3
                          style={{
                            fontSize:
                              fs(12),
                            color:
                              colors.secondary,
                          }}
                          className="
                            font-semibold
                            mb-1.5
                          "
                        >
                          {
                            cat.name
                          }
                        </h3>

                        <div className="flex flex-wrap gap-1.5">
                          {cat.items.map(
                            (
                              s,
                              i
                            ) => (
                              <span
                                key={
                                  i
                                }
                                style={{
                                  background:
                                    colors.surface,
                                  color:
                                    colors.secondary,
                                  borderColor:
                                    colors.border,
                                  fontSize:
                                    fs(11),
                                }}
                                className="
                                  font-medium
                                  px-2
                                  py-0.5
                                  rounded-full
                                  border
                                "
                              >
                                {
                                  s
                                }
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    ) : null
                )}
              </div>
            </section>
          </SortableSection>
        );

      /**
       * =====================================================
       * INTÉRÊTS
       * =====================================================
       */

      case 'interests':
        if (
          data.interests.length ===
          0
        ) {
          return null;
        }

        return (
          <SortableSection
            key="interests"
            id="interests"
            enabled={!captureMode}
          >
            <section>
              <h2
                style={{
                  color:
                    colors.primary,
                  fontFamily:
                    fonts.heading,
                  fontSize:
                    fs(13),
                }}
                className="
                  font-bold
                  uppercase
                  tracking-widest
                  mb-3
                  pb-2
                  border-b-2
                "
              >
                Centres d'intérêt
              </h2>

              <div className="flex flex-wrap gap-1.5">
                {data.interests.map(
                  (
                    it,
                    i
                  ) => (
                    <span
                      key={i}
                      style={{
                        background:
                          colors.surface,
                        color:
                          colors.secondary,
                        borderColor:
                          colors.border,
                        fontSize:
                          fs(11),
                      }}
                      className="
                        font-medium
                        px-2
                        py-0.5
                        rounded-full
                        border
                      "
                    >
                      {
                        it
                      }
                    </span>
                  )
                )}
              </div>
            </section>
          </SortableSection>
        );

      /**
       * =====================================================
       * PROJETS
       * =====================================================
       */

      case 'projects':
        if (
          data.projects.length ===
          0
        ) {
          return null;
        }

        return (
          <SortableSection
            key="projects"
            id="projects"
            enabled={!captureMode}
          >
            <section>
              <h2
                style={{
                  color:
                    colors.primary,
                  fontFamily:
                    fonts.heading,
                  fontSize:
                    fs(13),
                }}
                className="
                  font-bold
                  uppercase
                  tracking-widest
                  mb-3
                  pb-2
                  border-b-2
                "
              >
                Projets
              </h2>

              <div className="space-y-3">
                {data.projects.map(
                  (p) => (
                    <div
                      key={
                        p.id
                      }
                    >
                      <h3
                        style={{
                          fontSize:
                            fs(13),
                          color:
                            colors.text,
                        }}
                        className="
                          font-semibold
                        "
                      >
                        {
                          p.name
                        }
                      </h3>

                      {p.url && (
                        <a
                          href={
                            p.url.startsWith(
                              'http'
                            )
                              ? p.url
                              : `https://${p.url}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            fontSize:
                              fs(11),
                            color:
                              colors.accent,
                            textDecoration:
                              'underline',
                          }}
                          className="
                            inline-block
                          "
                        >
                          {
                            p.url
                          }
                        </a>
                      )}

                      {p.description && (
                        <p
                          style={{
                            fontSize:
                              fs(11),
                            color:
                              colors.muted,
                            whiteSpace:
                              'pre-line',
                          }}
                          className="
                            mt-1
                            leading-snug
                          "
                        >
                          {
                            p.description
                          }
                        </p>
                      )}
                    </div>
                  )
                )}
              </div>
            </section>
          </SortableSection>
        );

      /**
       * =====================================================
       * EXPÉRIENCES
       * =====================================================
       */

      case 'experiences':
        if (
          data.experiences.length ===
          0
        ) {
          return null;
        }

        return (
          <SortableSection
            key="experiences"
            id="experiences"
            enabled={!captureMode}
          >
            <section>
              <h2
                style={{
                  color:
                    colors.primary,
                  fontFamily:
                    fonts.heading,
                  fontSize:
                    fs(13),
                }}
                className="
                  font-bold
                  uppercase
                  tracking-widest
                  mb-4
                  pb-2
                  border-b-2
                "
              >
                Expériences
              </h2>

              <div className="space-y-4">
                {data.experiences.map(
                  (exp) => (
                    <div
                      key={
                        exp.id
                      }
                      className="
                        relative
                        pl-5
                        border-l-2
                      "
                      style={{
                        borderColor:
                          colors.border,
                      }}
                    >
                      <span
                        className="
                          absolute
                          -left-[5px]
                          top-1.5
                          w-2
                          h-2
                          rounded-full
                        "
                        style={{
                          background:
                            colors.accent,
                        }}
                      />

                      <div className="flex items-baseline justify-between gap-3">
                        <h3
                          style={{
                            fontSize:
                              fs(15),
                            color:
                              colors.text,
                          }}
                          className="
                            font-semibold
                          "
                        >
                          {
                            exp.role
                          }
                        </h3>

                        <span
                          style={{
                            fontSize:
                              fs(11),
                            color:
                              colors.muted,
                          }}
                          className="
                            flex
                            items-center
                            gap-1
                            shrink-0
                          "
                        >
                          <Calendar className="w-3 h-3" />
                          {
                            exp.period
                          }
                        </span>
                      </div>

                      <p
                        style={{
                          fontSize:
                            fs(13),
                          color:
                            colors.secondary,
                        }}
                        className="
                          font-medium
                        "
                      >
                        {
                          exp.company
                        }
                      </p>

                      {exp.description && (
                        <p
                          style={{
                            fontSize:
                              fs(13),
                            color:
                              colors.muted,
                            whiteSpace:
                              'pre-line',
                          }}
                          className="
                            mt-1
                            leading-relaxed
                          "
                        >
                          {
                            exp.description
                          }
                        </p>
                      )}
                    </div>
                  )
                )}
              </div>
            </section>
          </SortableSection>
        );

      /**
       * =====================================================
       * FORMATION
       * =====================================================
       */

      case 'education':
        if (
          data.education.length ===
          0
        ) {
          return null;
        }

        return (
          <SortableSection
            key="education"
            id="education"
            enabled={!captureMode}
          >
            <section>
              <h2
                style={{
                  color:
                    colors.primary,
                  fontFamily:
                    fonts.heading,
                  fontSize:
                    fs(13),
                }}
                className="
                  font-bold
                  uppercase
                  tracking-widest
                  mb-4
                  pb-2
                  border-b-2
                "
              >
                Formation
              </h2>

              <div className="space-y-3">
                {data.education.map(
                  (ed) => (
                    <div
                      key={
                        ed.id
                      }
                    >
                      <div className="flex items-baseline justify-between gap-3">
                        <h3
                          style={{
                            fontSize:
                              fs(15),
                            color:
                              colors.text,
                          }}
                          className="
                            font-semibold
                          "
                        >
                          {
                            ed.degree
                          }
                        </h3>

                        <span
                          style={{
                            fontSize:
                              fs(11),
                            color:
                              colors.muted,
                          }}
                          className="
                            shrink-0
                          "
                        >
                          {
                            ed.period
                          }
                        </span>
                      </div>

                      <p
                        style={{
                          fontSize:
                            fs(13),
                          color:
                            colors.secondary,
                        }}
                        className="
                          font-medium
                        "
                      >
                        {
                          ed.school
                        }
                      </p>

                      {ed.description && (
                        <p
                          style={{
                            fontSize:
                              fs(13),
                            color:
                              colors.muted,
                            whiteSpace:
                              'pre-line',
                          }}
                          className="
                            mt-1
                            leading-relaxed
                          "
                        >
                          {
                            ed.description
                          }
                        </p>
                      )}
                    </div>
                  )
                )}
              </div>
            </section>
          </SortableSection>
        );

      default:
        return null;
    }
  };

  /**
   * =========================================================
   * RENDER
   * =========================================================
   */

  return (
    <div
      style={{
        fontFamily:
          fonts.body,
        color:
          colors.text,
        fontSize:
          fs(14),
      }}
      className="
        w-full
        h-full
      "
    >
      {/* =====================================================
          HEADER
      ====================================================== */}

      <header
        className="
          px-10
          py-8
          flex
          items-center
          justify-between
          gap-6
        "
        style={{
          background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
          color: '#fff',
        }}
      >
        {data.photo && (
          <img
            src={data.photo}
            alt={data.name}
            crossOrigin="anonymous"
            className="
              rounded-full
              object-cover
              border-4
              border-white/30
              shadow-lg
              shrink-0
            "
            style={{
              width: `${
                96 *
                (data.photoScale ??
                  1)
              }px`,
              height: `${
                96 *
                (data.photoScale ??
                  1)
              }px`,
            }}
          />
        )}

        <div
          className={
            data.photo
              ? 'flex-1 text-center'
              : ''
          }
        >
          <h1
            style={{
              fontFamily:
                fonts.heading,
              fontSize:
                fs(36),
            }}
            className="
              font-bold
              tracking-tight
              leading-tight
            "
          >
            {data.name}
          </h1>

          <p
            style={{
              fontSize:
                fs(18),
            }}
            className="
              font-medium
              mt-1
              opacity-90
            "
          >
            {data.title}
          </p>
        </div>

        <div
          style={{
            fontSize:
              fs(13),
          }}
          className="
            space-y-1.5
            opacity-95
            shrink-0
          "
        >
          {data.email && (
            <a
              href={`mailto:${data.email}`}
              style={{
                color:
                  'inherit',
                textDecoration:
                  'none',
              }}
              className="
                flex
                items-center
                gap-2
                justify-end
              "
            >
              <Mail className="w-4 h-4" />

              <span>
                {
                  data.email
                }
              </span>
            </a>
          )}

          {data.phone && (
            <a
              href={`tel:${data.phone.replace(
                /\s/g,
                ''
              )}`}
              style={{
                color:
                  'inherit',
                textDecoration:
                  'none',
              }}
              className="
                flex
                items-center
                gap-2
                justify-end
              "
            >
              <Phone className="w-4 h-4" />

              <span>
                {
                  data.phone
                }
              </span>
            </a>
          )}

          {data.location && (
            <span
              className="
                flex
                items-center
                gap-2
                justify-end
              "
            >
              <MapPin className="w-4 h-4" />

              <span>
                {
                  data.location
                }
              </span>
            </span>
          )}

          {age !== null && (
            <span
              className="
                flex
                items-center
                gap-2
                justify-end
              "
            >
              <Calendar className="w-4 h-4" />

              <span>
                {
                  age
                } ans
              </span>
            </span>
          )}

          {data.hasDrivingLicense && (
            <span
              className="
                flex
                items-center
                gap-2
                justify-end
              "
            >
              <Car className="w-4 h-4" />

              <span>
                Permis B
              </span>
            </span>
          )}

          {data.website && (
            <a
              href={
                data.website.startsWith(
                  'http'
                )
                  ? data.website
                  : `https://${data.website}`
              }
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color:
                  'inherit',
                textDecoration:
                  'none',
              }}
              className="
                flex
                items-center
                gap-2
                justify-end
              "
            >
              <Globe className="w-4 h-4" />

              <span>
                {
                  data.website
                }
              </span>
            </a>
          )}

          {data.linkedin && (
            <a
              href={
                data.linkedin.startsWith(
                  'http'
                )
                  ? data.linkedin
                  : `https://${data.linkedin}`
              }
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color:
                  'inherit',
                textDecoration:
                  'none',
              }}
              className="
                flex
                items-center
                gap-2
                justify-end
              "
            >
              <Linkedin className="w-4 h-4" />

              <span>
                {
                  data.linkedin
                }
              </span>
            </a>
          )}

          {data.github && (
            <a
              href={
                data.github.startsWith(
                  'http'
                )
                  ? data.github
                  : `https://${data.github}`
              }
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color:
                  'inherit',
                textDecoration:
                  'none',
              }}
              className="
                flex
                items-center
                gap-2
                justify-end
              "
            >
              <Github className="w-4 h-4" />

              <span>
                {
                  data.github
                }
              </span>
            </a>
          )}
        </div>
      </header>

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <div className="
        px-10
        py-8
        grid
        grid-cols-3
        gap-8
      ">
        {/* ===================================================
            LEFT — 1/3 EXACTEMENT COMME L'ORIGINAL
        ==================================================== */}

        <ModernColumn
          id="section-column-left"
          className="col-span-1"
        >
          <SortableContext
            items={
              leftOrder
            }
            strategy={
              verticalListSortingStrategy
            }
          >
            <aside className="
              space-y-7
            ">
              {leftOrder.map(
                (sectionId) =>
                  renderSection(
                    sectionId
                  )
              )}
            </aside>
          </SortableContext>
        </ModernColumn>

        {/* ===================================================
            RIGHT — 2/3 EXACTEMENT COMME L'ORIGINAL
        ==================================================== */}

        <ModernColumn
          id="section-column-right"
          className="col-span-2"
        >
          <SortableContext
            items={
              rightOrder
            }
            strategy={
              verticalListSortingStrategy
            }
          >
            <main className="
              space-y-7
            ">
              {rightOrder.map(
                (sectionId) =>
                  renderSection(
                    sectionId
                  )
              )}
            </main>
          </SortableContext>
        </ModernColumn>
      </div>
    </div>
  );
}