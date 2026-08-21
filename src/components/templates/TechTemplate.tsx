import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Linkedin,
  Github,
  Terminal,
  Calendar,
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
 * Design original du Tech :
 *
 * GAUCHE :
 * - Profil
 * - Stack technique
 * - Intérêts
 *
 * DROITE :
 * - Expérience
 * - Formation
 * - Projets
 * =========================================================
 */

const DEFAULT_SECTION_COLUMNS: Record<
  CVSectionId,
  CVSectionColumn
> = {
  summary: 'left',
  skills: 'left',
  interests: 'left',

  experiences: 'right',
  education: 'right',
  projects: 'right',
};

/**
 * =========================================================
 * TYPES DES ZONES DROPPABLES
 * =========================================================
 */

type TechColumnId =
  | 'section-column-left'
  | 'section-column-right';

/**
 * =========================================================
 * COLONNE DROPPABLE
 * =========================================================
 *
 * Une colonne possède :
 *
 * 1. une zone globale pour permettre le changement
 *    de colonne ;
 *
 * 2. une petite zone "bottom" juste après son contenu
 *    pour permettre le drop en toute fin de colonne.
 * =========================================================
 */

function TechColumn({
  id,
  children,
}: {
  id: TechColumnId;
  children: React.ReactNode;
}) {
  const {
    setNodeRef,
    isOver,
  } = useDroppable({
    id,
  });

  const bottomId =
    id ===
    'section-column-left'
      ? 'section-column-bottom-left'
      : 'section-column-bottom-right';

  const {
    setNodeRef:
      setBottomNodeRef,
    isOver:
      isBottomOver,
  } = useDroppable({
    id: bottomId,
  });

  return (
    <div
      ref={setNodeRef}
      className={`
        relative
        min-w-0
        min-h-full
        w-full
        rounded-sm
        transition

        ${
          isOver
            ? 'bg-slate-50/40'
            : ''
        }
      `}
    >
      {/* ===================================================
          CONTENU DE LA COLONNE
      ==================================================== */}

      {children}

      {/* ===================================================
          ZONE DE DROP FINALE
      ==================================================== */}

      <div
        ref={setBottomNodeRef}
        className="
          relative
          w-full
          h-4
          mt-0
        "
      >
        {isBottomOver && (
          <div
            className="
              pointer-events-none

              absolute
              left-0
              right-0
              top-1/2
              -translate-y-1/2

              z-[100]

              h-[3px]

              rounded-full

              bg-slate-900

              shadow-sm
            "
          />
        )}
      </div>
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
  if (!birthDate) {
    return null;
  }

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

export default function TechTemplate({
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
   *
   * IMPORTANT :
   *
   * On conserve exactement l'ordre
   * global par défaut.
   *
   * Avec cet ordre :
   *
   * summary
   * experiences
   * education
   * skills
   * projects
   * interests
   *
   * et les colonnes par défaut :
   *
   * LEFT :
   * summary
   * skills
   * interests
   *
   * RIGHT :
   * experiences
   * education
   * projects
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
   *
   * On conserve l'ordre relatif de sectionOrder.
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
              <Heading
                title="Profil"
                colors={colors}
                fonts={fonts}
                size={fs(14)}
              />

              <p
                style={{
                  fontSize:
                    fs(10.5),
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
       * SKILLS
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
              <Heading
                title="Stack technique"
                colors={colors}
                fonts={fonts}
                size={fs(14)}
              />

              <div className="space-y-4">
                {data.skills.map(
                  (category) =>
                    category.items.length >
                      0 ? (
                      <div
                        key={
                          category.id
                        }
                      >
                        <h3
                          style={{
                            color:
                              colors.accent,
                            fontSize:
                              fs(10.5),
                          }}
                          className="
                            font-bold
                            uppercase
                            tracking-wide
                            mb-1.5
                          "
                        >
                          {
                            category.name
                          }
                        </h3>

                        <div className="flex flex-wrap gap-1">
                          {category.items.map(
                            (
                              skill,
                              index
                            ) => (
                              <span
                                key={
                                  index
                                }
                                style={{
                                  background:
                                    colors.surface,
                                  borderColor:
                                    colors.border,
                                  color:
                                    colors.text,
                                  fontSize:
                                    fs(9),
                                }}
                                className="
                                  rounded
                                  px-1.5
                                  py-1
                                  border
                                "
                              >
                                {
                                  skill
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
              <Heading
                title="Intérêts"
                colors={colors}
                fonts={fonts}
                size={fs(14)}
              />

              <p
                style={{
                  fontSize:
                    fs(10),
                  color:
                    colors.muted,
                  whiteSpace:
                    'pre-line',
                }}
                className="
                  leading-relaxed
                "
              >
                {data.interests.join(
                  ' • '
                )}
              </p>
            </section>
          </SortableSection>
        );

      /**
       * =====================================================
       * EXPÉRIENCE
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
              <Heading
                title="Expérience"
                colors={colors}
                fonts={fonts}
                size={fs(14)}
              />

              <div className="space-y-5">
                {data.experiences.map(
                  (exp) => (
                    <article
                      key={
                        exp.id
                      }
                    >
                      <div
                        className="
                          flex
                          justify-between
                          gap-4
                        "
                      >
                        <div>
                          <h3
                            style={{
                              color:
                                colors.secondary,
                              fontFamily:
                                fonts.heading,
                              fontSize:
                                fs(11),
                            }}
                            className="
                              font-bold
                            "
                          >
                            {
                              exp.role
                            }
                          </h3>

                          <p
                            style={{
                              color:
                                colors.secondary,
                              fontSize:
                                fs(10.5),
                            }}
                            className="
                              font-medium
                            "
                          >
                            {
                              exp.company
                            }
                          </p>
                        </div>

                        <span
                          style={{
                            color:
                              colors.muted,
                            fontSize:
                              fs(9),
                          }}
                          className="
                            shrink-0
                          "
                        >
                          {
                            exp.period
                          }
                        </span>
                      </div>

                      {exp.description && (
                        <p
                          style={{
                            color:
                              colors.muted,
                            fontSize:
                              fs(10.5),
                            whiteSpace:
                              'pre-line',
                          }}
                          className="
                            leading-relaxed
                            mt-2
                          "
                        >
                          {
                            exp.description
                          }
                        </p>
                      )}
                    </article>
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
              <Heading
                title="Formation"
                colors={colors}
                fonts={fonts}
                size={fs(14)}
              />

              <div className="space-y-4">
                {data.education.map(
                  (ed) => (
                    <article
                      key={
                        ed.id
                      }
                    >
                      <div
                        className="
                          flex
                          justify-between
                          gap-4
                        "
                      >
                        <div>
                          <h3
                            style={{
                              color:
                                colors.secondary,
                              fontSize:
                                fs(11),
                            }}
                            className="
                              font-bold
                            "
                          >
                            {
                              ed.degree
                            }
                          </h3>

                          <p
                            style={{
                              color:
                                colors.secondary,
                              fontSize:
                                fs(10),
                            }}
                          >
                            {
                              ed.school
                            }
                          </p>
                        </div>

                        <span
                          style={{
                            color:
                              colors.muted,
                            fontSize:
                              fs(9),
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

                      {ed.description && (
                        <p
                          style={{
                            color:
                              colors.muted,
                            fontSize:
                              fs(10),
                            whiteSpace:
                              'pre-line',
                          }}
                          className="
                            leading-relaxed
                            mt-1.5
                          "
                        >
                          {
                            ed.description
                          }
                        </p>
                      )}
                    </article>
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
              <Heading
                title="Projets"
                colors={colors}
                fonts={fonts}
                size={fs(14)}
              />

              <div
                className="
                  grid
                  grid-cols-2
                  gap-x-5
                  gap-y-4
                "
              >
                {data.projects.map(
                  (project) => (
                    <article
                      key={
                        project.id
                      }
                    >
                      <h3
                        style={{
                          color:
                            colors.secondary,
                          fontSize:
                            fs(10.5),
                        }}
                        className="
                          font-bold
                        "
                      >
                        {
                          project.name
                        }
                      </h3>

                      {project.url && (
                        <a
                          href={
                            project.url.startsWith(
                              'http'
                            )
                              ? project.url
                              : `https://${project.url}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color:
                              colors.accent,
                            fontSize:
                              fs(9),
                            textDecoration:
                              'underline',
                          }}
                        >
                          {
                            project.url
                          }
                        </a>
                      )}

                      {project.description && (
                        <p
                          style={{
                            color:
                              colors.muted,
                            fontSize:
                              fs(9),
                            whiteSpace:
                              'pre-line',
                          }}
                          className="
                            leading-relaxed
                            mt-1
                          "
                        >
                          {
                            project.description
                          }
                        </p>
                      )}
                    </article>
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
        px-9
        py-9
      "
    >
      {/* =====================================================
          HEADER
      ====================================================== */}

      <header
        className="
          flex
          gap-6
          items-center
        "
      >
        <div
          className="
            w-14
            h-14
            rounded-xl
            flex
            items-center
            justify-center
            shrink-0
          "
          style={{
            background:
              colors.primary,
            color: '#fff',
          }}
        >
          <Terminal className="w-7 h-7" />
        </div>

        <div className="flex-1">
          <h1
            style={{
              fontFamily:
                fonts.heading,
              color:
                colors.primary,
              fontSize:
                fs(35),
            }}
            className="
              font-bold
              tracking-tight
            "
          >
            {data.name}
          </h1>

          <p
            style={{
              color:
                colors.accent,
              fontSize:
                fs(15),
            }}
            className="
              font-semibold
            "
          >
            {data.title}
          </p>
        </div>

        {data.photo && (
          <img
            src={data.photo}
            alt={data.name}
            crossOrigin="anonymous"
            className="
              rounded-xl
              object-cover
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
      </header>

      {/* =====================================================
          CONTACT
      ====================================================== */}

      <div
        className="
          flex
          flex-wrap
          gap-x-4
          gap-y-1.5
          mt-5
          pb-5
          border-b
        "
        style={{
          borderColor:
            colors.border,
          color:
            colors.muted,
          fontSize:
            fs(9.5),
        }}
      >
        {data.email && (
          <a
            href={`mailto:${data.email}`}
            className="
              flex
              gap-1.5
              items-center
              hover:underline
            "
            style={{
              color:
                'inherit',
            }}
          >
            <Mail className="w-3 h-3" />
            {data.email}
          </a>
        )}

        {data.phone && (
          <a
            href={`tel:${data.phone}`}
            className="
              flex
              gap-1.5
              items-center
              hover:underline
            "
            style={{
              color:
                'inherit',
            }}
          >
            <Phone className="w-3 h-3" />
            {data.phone}
          </a>
        )}

        {data.location && (
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              data.location
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="
              flex
              gap-1.5
              items-center
              hover:underline
            "
            style={{
              color:
                'inherit',
            }}
          >
            <MapPin className="w-3 h-3" />
            {data.location}
          </a>
        )}

        {age !== null && (
          <span
            className="
              flex
              gap-1.5
              items-center
            "
            style={{
              color:
                'inherit',
            }}
          >
            <Calendar className="w-3 h-3" />
            {age} ans
          </span>
        )}

        {data.hasDrivingLicense && (
          <span
            className="
              flex
              gap-1.5
              items-center
            "
            style={{
              color:
                'inherit',
            }}
          >
            <Car className="w-3 h-3" />
            Permis B
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
            className="
              flex
              gap-1.5
              items-center
              hover:underline
            "
            style={{
              color:
                'inherit',
            }}
          >
            <Globe className="w-3 h-3" />
            {data.website}
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
            className="
              flex
              gap-1.5
              items-center
              hover:underline
            "
            style={{
              color:
                'inherit',
            }}
          >
            <Linkedin className="w-3 h-3" />
            {data.linkedin}
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
            className="
              flex
              gap-1.5
              items-center
              hover:underline
            "
            style={{
              color:
                'inherit',
            }}
          >
            <Github className="w-3 h-3" />
            {data.github}
          </a>
        )}
      </div>

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <div
        className="
          grid
          grid-cols-[0.62fr_1.38fr]
          gap-8
          mt-6
        "
      >
        {/* ===================================================
            LEFT — 0.62fr
        ==================================================== */}

        <TechColumn
          id="section-column-left"
        >
          <SortableContext
            items={
              leftOrder
            }
            strategy={
              verticalListSortingStrategy
            }
          >
            <aside
              className="
                space-y-6
                relative
              "
            >
              {leftOrder.map(
                (sectionId) =>
                  renderSection(
                    sectionId
                  )
              )}
            </aside>
          </SortableContext>
        </TechColumn>

        {/* ===================================================
            RIGHT — 1.38fr
        ==================================================== */}

        <TechColumn
          id="section-column-right"
        >
          <SortableContext
            items={
              rightOrder
            }
            strategy={
              verticalListSortingStrategy
            }
          >
            <main
              className="
                space-y-6
                relative
              "
            >
              {rightOrder.map(
                (sectionId) =>
                  renderSection(
                    sectionId
                  )
              )}
            </main>
          </SortableContext>
        </TechColumn>
      </div>
    </div>
  );
}

/**
 * =========================================================
 * HEADING
 * =========================================================
 */

function Heading({
  title,
  colors,
  fonts,
  size,
}: {
  title: string;
  colors: ThemeColors;
  fonts: {
    heading: string;
    body: string;
  };
  size: string;
}) {
  return (
    <h2
      style={{
        color:
          colors.primary,
        fontFamily:
          fonts.heading,
        fontSize:
          size,
      }}
      className="
        font-bold
        uppercase
        tracking-[0.2em]
        mb-4
        flex
        items-center
        gap-2
      "
    >
      <span
        className="
          w-1.5
          h-1.5
          rounded-full
        "
        style={{
          background:
            colors.accent,
        }}
      />

      {title}
    </h2>
  );
}