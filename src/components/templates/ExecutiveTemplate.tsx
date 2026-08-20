import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Linkedin,
  Github,
} from 'lucide-react';

import type { CVData, ThemeColors } from '@/types/types';

interface Props {
  data: CVData;
  colors: ThemeColors;
  fonts: { heading: string; body: string };
  fontScale: number;
}

export default function ExecutiveTemplate({
  data,
  colors,
  fonts,
  fontScale,
}: Props) {
  const fs = (n: number) => `${n * fontScale}px`;
  const hasSkills = data.skills.some((c) => c.items.length > 0);

  return (
    <div
      style={{
        fontFamily: fonts.body,
        color: colors.text,
        fontSize: fs(14),
      }}
      className="w-full h-full px-12 py-11"
    >
      {/* =====================================================
          HEADER
      ====================================================== */}

      <header className="flex items-end justify-between gap-8 pb-7">
        <div className="flex-1">
          <p
            style={{
              color: colors.accent,
              fontSize: fs(10),
            }}
            className="uppercase tracking-[0.3em] font-semibold mb-3"
          >
            Curriculum Vitae
          </p>

          <h1
            style={{
              fontFamily: fonts.heading,
              color: colors.primary,
              fontSize: fs(40),
            }}
            className="font-bold leading-none"
          >
            {data.name}
          </h1>

          <p
            style={{
              color: colors.secondary,
              fontSize: fs(17),
            }}
            className="mt-3"
          >
            {data.title}
          </p>
        </div>

        {data.photo && (
          <img
            src={data.photo}
            alt={data.name}
            crossOrigin="anonymous"
            className="object-cover rounded-full shrink-0"
            style={{
              width: `${112 * (data.photoScale ?? 1)}px`,
              height: `${112 * (data.photoScale ?? 1)}px`,
              border: `4px solid ${colors.surface}`,
            }}
          />
        )}
      </header>

      {/* =====================================================
          CONTACT
      ====================================================== */}

      {/* =====================================================
          CONTACT
      ====================================================== */}

      <div
        className="flex flex-wrap gap-x-5 gap-y-1.5 py-3 border-y"
        style={{
          borderColor: colors.border,
          color: colors.muted,
          fontSize: fs(9.5),
        }}
      >
        {data.email && (
          <span className="flex gap-1.5 items-center">
            <Mail className="w-3 h-3" />
            <a
              href={`mailto:${data.email}`}
              style={{
                color: 'inherit',
                textDecoration: 'underline',
              }}
            >
              {data.email}
            </a>
          </span>
        )}

        {data.phone && (
          <span className="flex gap-1.5 items-center">
            <Phone className="w-3 h-3" />
            <a
              href={`tel:${data.phone}`}
              style={{
                color: 'inherit',
                textDecoration: 'underline',
              }}
            >
              {data.phone}
            </a>
          </span>
        )}

        {data.location && (
          <span className="flex gap-1.5 items-center">
            <MapPin className="w-3 h-3" />
            {data.location}
          </span>
        )}

        {data.website && (
          <span className="flex gap-1.5 items-center">
            <Globe className="w-3 h-3" />
            <a
              href={
                data.website.startsWith('http')
                  ? data.website
                  : `https://${data.website}`
              }
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: 'inherit',
                textDecoration: 'underline',
              }}
            >
              {data.website}
            </a>
          </span>
        )}

        {data.linkedin && (
          <span className="flex gap-1.5 items-center">
            <Linkedin className="w-3 h-3" />
            <a
              href={
                data.linkedin.startsWith('http')
                  ? data.linkedin
                  : `https://${data.linkedin}`
              }
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: 'inherit',
                textDecoration: 'underline',
              }}
            >
              {data.linkedin}
            </a>
          </span>
        )}

        {data.github && (
          <span className="flex gap-1.5 items-center">
            <Github className="w-3 h-3" />
            <a
              href={
                data.github.startsWith('http')
                  ? data.github
                  : `https://${data.github}`
              }
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: 'inherit',
                textDecoration: 'underline',
              }}
            >
              {data.github}
            </a>
          </span>
        )}
      </div>

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <div className="grid grid-cols-[0.34fr_0.66fr] gap-10 mt-8">

        {/* ===================================================
            LEFT COLUMN
        ==================================================== */}

        <aside className="space-y-7">

          {/* À PROPOS */}

          {data.summary && (
            <section>
              <h2
                style={{
                  fontFamily: fonts.heading,
                  color: colors.primary,
                  fontSize: fs(13),
                }}
                className="font-bold uppercase tracking-[0.16em] mb-3"
              >
                À propos
              </h2>

              <p
                style={{
                  fontSize: fs(10.5),
                  color: colors.muted,
                  whiteSpace: 'pre-line',
                }}
                className="leading-relaxed"
              >
                {data.summary}
              </p>
            </section>
          )}

          {/* EXPERTISE */}

          {hasSkills && (
            <section>
              <h2
                style={{
                  fontFamily: fonts.heading,
                  color: colors.primary,
                  fontSize: fs(13),
                }}
                className="font-bold uppercase tracking-[0.16em] mb-3"
              >
                Expertise
              </h2>

              <div className="space-y-4">
                {data.skills.map((category) =>
                  category.items.length > 0 ? (
                    <div key={category.id}>
                      <h3
                        style={{
                          color: colors.secondary,
                          fontSize: fs(10),
                        }}
                        className="font-semibold"
                      >
                        {category.name}
                      </h3>

                      <p
                        style={{
                          color: colors.muted,
                          fontSize: fs(9.5),
                        }}
                        className="leading-relaxed mt-1"
                      >
                        {category.items.join(' · ')}
                      </p>
                    </div>
                  ) : null
                )}
              </div>
            </section>
          )}

          {/* INTÉRÊTS */}

          {data.interests.length > 0 && (
            <section>
              <h2
                style={{
                  fontFamily: fonts.heading,
                  color: colors.primary,
                  fontSize: fs(13),
                }}
                className="font-bold uppercase tracking-[0.16em] mb-3"
              >
                Intérêts
              </h2>

              <p
                style={{
                  fontSize: fs(9.5),
                  color: colors.muted,
                }}
                className="leading-relaxed"
              >
                {data.interests.join(' · ')}
              </p>
            </section>
          )}
        </aside>

        {/* ===================================================
            RIGHT COLUMN
        ==================================================== */}

        <main className="space-y-7">

          {/* EXPÉRIENCE */}

          {data.experiences.length > 0 && (
            <section>
              <SectionHeader
                title="Expérience professionnelle"
                colors={colors}
                fonts={fonts}
                size={fs(13)}
              />

              <div className="space-y-5">
                {data.experiences.map((exp) => (
                  <article key={exp.id}>
                    <div className="flex justify-between gap-5">
                      <div>
                        <h3
                          style={{
                            fontFamily: fonts.heading,
                            color: colors.accent,
                            fontSize: fs(11),
                          }}
                          className="font-bold"
                        >
                          {exp.role}
                        </h3>

                        <p
                          style={{
                            color: colors.secondary,
                            fontSize: fs(10.5),
                          }}
                          className="font-medium mt-0.5"
                        >
                          {exp.company}
                        </p>
                      </div>

                      <span
                        style={{
                          color: colors.muted,
                          fontSize: fs(9.5),
                        }}
                        className="shrink-0"
                      >
                        {exp.period}
                      </span>
                    </div>

                    {exp.description && (
                      <p
                        style={{
                          color: colors.muted,
                          fontSize: fs(10.5),
                          whiteSpace: 'pre-line',
                        }}
                        className="leading-relaxed mt-2"
                      >
                        {exp.description}
                      </p>
                    )}
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* FORMATION */}

          {data.education.length > 0 && (
            <section>
              <SectionHeader
                title="Formation"
                colors={colors}
                fonts={fonts}
                size={fs(13)}
              />

              <div className="space-y-4">
                {data.education.map((ed) => (
                  <article key={ed.id}>
                    <div className="flex justify-between gap-5">
                      <div>
                        <h3
                          style={{
                            fontFamily: fonts.heading,
                            color: colors.accent,
                            fontSize: fs(11),
                          }}
                          className="font-bold"
                        >
                          {ed.degree}
                        </h3>

                        <p
                          style={{
                            color: colors.secondary,
                            fontSize: fs(10),
                          }}
                          className="font-medium mt-0.5"
                        >
                          {ed.school}
                        </p>
                      </div>

                      <span
                        style={{
                          color: colors.muted,
                          fontSize: fs(9),
                        }}
                        className="shrink-0"
                      >
                        {ed.period}
                      </span>
                    </div>

                    {ed.description && (
                      <p
                        style={{
                          color: colors.muted,
                          fontSize: fs(10),
                          whiteSpace: 'pre-line',
                        }}
                        className="leading-relaxed mt-1.5"
                      >
                        {ed.description}
                      </p>
                    )}
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* PROJETS */}

          {data.projects.length > 0 && (
            <section>
              <SectionHeader
                title="Réalisations & projets"
                colors={colors}
                fonts={fonts}
                size={fs(13)}
              />

              <div className="space-y-3">
                {data.projects.map((project) => (
                  <article key={project.id}>
                    <div className="flex items-baseline gap-2">
                      <h3
                        style={{
                          color: colors.primary,
                          fontSize: fs(11.5),
                        }}
                        className="font-bold"
                      >
                        {project.name}
                      </h3>

                      {project.url && (
                        <a
                          href={
                            project.url.startsWith('http')
                              ? project.url
                              : `https://${project.url}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: colors.accent,
                            fontSize: fs(9),
                            textDecoration: 'underline',
                          }}
                          className="inline-block"
                        >
                          {project.url}
                        </a>
                      )}
                    </div>

                    {project.description && (
                      <p
                        style={{
                          color: colors.muted,
                          fontSize: fs(9.5),
                          whiteSpace: 'pre-line',
                        }}
                        className="leading-relaxed mt-1"
                      >
                        {project.description}
                      </p>
                    )}
                  </article>
                ))}
              </div>
            </section>
          )}

        </main>
      </div>
    </div>
  );
}

/**
 * =========================================================
 * SECTION HEADER
 * =========================================================
 */

function SectionHeader({
  title,
  colors,
  fonts,
  size,
}: {
  title: string;
  colors: ThemeColors;
  fonts: { heading: string; body: string };
  size: string;
}) {
  return (
    <h2
      style={{
        fontFamily: fonts.heading,
        color: colors.primary,
        fontSize: size,
      }}
      className="font-bold uppercase tracking-[0.16em] pb-2 mb-4 border-b-2"
    >
      {title}
    </h2>
  );
}