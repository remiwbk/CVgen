import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Linkedin,
  Github,
  Calendar,
  Car,
} from 'lucide-react';

import type { CVData, ThemeColors } from '@/types/types';

interface Props {
  data: CVData;
  colors: ThemeColors;
  fonts: { heading: string; body: string };
  fontScale: number;
}

function calculateAge(birthDate: string | undefined): number | null {
  if (!birthDate) return null;

  const birth = new Date(birthDate);

  if (Number.isNaN(birth.getTime())) return null;

  const today = new Date();

  let age = today.getFullYear() - birth.getFullYear();

  const hasHadBirthday =
    today.getMonth() > birth.getMonth() ||
    (today.getMonth() === birth.getMonth() &&
      today.getDate() >= birth.getDate());

  if (!hasHadBirthday) {
    age--;
  }

  return age;
}

export default function SwissTemplate({
  data,
  colors,
  fonts,
  fontScale,
}: Props) {
  const fs = (n: number) => `${n * fontScale}px`;
  const hasSkills = data.skills.some((c) => c.items.length > 0);
  const age = calculateAge(data.birthDate);

  return (
    <div
      style={{
        fontFamily: fonts.body,
        color: colors.text,
        fontSize: fs(14),
      }}
      className="w-full h-full px-11 py-10"
    >
      <header className="grid grid-cols-[auto_1fr_auto] gap-7 items-start">
        {data.photo ? (
          <img
            src={data.photo}
            alt={data.name}
            crossOrigin="anonymous"
            className="rounded-full object-cover shrink-0"
            style={{
              width: `${96 * (data.photoScale ?? 1)}px`,
              height: `${96 * (data.photoScale ?? 1)}px`,
            }}
          />
        ) : (
          <div
            className="w-5 h-24"
            style={{ background: colors.primary }}
          />
        )}

        <div>
          <h1
            style={{
              fontFamily: fonts.heading,
              color: colors.primary,
              fontSize: fs(38),
            }}
            className="font-bold leading-none"
          >
            {data.name}
          </h1>

          <p
            style={{
              color: colors.secondary,
              fontSize: fs(16),
            }}
            className="font-medium mt-3"
          >
            {data.title}
          </p>
        </div>

        <div
          style={{
            fontSize: fs(9.5),
            color: colors.muted,
          }}
          className="space-y-1.5 text-right"
        >
          {data.email && (
            <a
              href={`mailto:${data.email}`}
              style={{
                color: 'inherit',
                textDecoration: 'none',
              }}
              className="flex items-center gap-1.5 justify-end"
            >
              <Mail className="w-3 h-3" />
              {data.email}
            </a>
          )}

          {data.phone && (
            <a
              href={`tel:${data.phone.replace(/\s/g, '')}`}
              style={{
                color: 'inherit',
                textDecoration: 'none',
              }}
              className="flex items-center gap-1.5 justify-end"
            >
              <Phone className="w-3 h-3" />
              {data.phone}
            </a>
          )}

          {data.location && (
            <span className="flex items-center gap-1.5 justify-end">
              <MapPin className="w-3 h-3" />
              {data.location}
            </span>
          )}

          {age !== null && (
            <span className="flex items-center gap-1.5 justify-end">
              <Calendar className="w-3 h-3" />
              {age} ans
            </span>
          )}

          {data.hasDrivingLicense && (
            <span className="flex items-center gap-1.5 justify-end">
              <Car className="w-3 h-3" />
              Permis B
            </span>
          )}

          {data.website && (
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
                textDecoration: 'none',
              }}
              className="flex items-center gap-1.5 justify-end"
            >
              <Globe className="w-3 h-3" />
              {data.website}
            </a>
          )}

          {data.linkedin && (
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
                textDecoration: 'none',
              }}
              className="flex items-center gap-1.5 justify-end"
            >
              <Linkedin className="w-3 h-3" />
              {data.linkedin}
            </a>
          )}

          {data.github && (
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
                textDecoration: 'none',
              }}
              className="flex items-center gap-1.5 justify-end"
            >
              <Github className="w-3 h-3" />
              {data.github}
            </a>
          )}
        </div>
      </header>

      <div
        className="mt-8 border-t"
        style={{ borderColor: colors.border }}
      />

      <div className="grid grid-cols-[0.38fr_0.62fr] gap-10 mt-7">
        <aside className="space-y-7">
          {/* PROFIL */}

          {data.summary && (
            <section>
              <NumberTitle
                number="01"
                title="Profil"
                colors={colors}
                fonts={fonts}
                size={fs(13)}
              />

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

          {/* COMPÉTENCES */}

          {hasSkills && (
            <section>
              <NumberTitle
                number="02"
                title="Compétences"
                colors={colors}
                fonts={fonts}
                size={fs(13)}
              />

              <div className="space-y-3">
                {data.skills.map((category) =>
                  category.items.length > 0 ? (
                    <div key={category.id}>
                      <h3
                        style={{
                          fontSize: fs(10),
                          color: colors.secondary,
                        }}
                        className="font-bold"
                      >
                        {category.name}
                      </h3>

                      <p
                        style={{
                          fontSize: fs(9.5),
                          color: colors.muted,
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
              <NumberTitle
                number="03"
                title="Intérêts"
                colors={colors}
                fonts={fonts}
                size={fs(13)}
              />

              <p
                style={{
                  fontSize: fs(10),
                  color: colors.muted,
                  whiteSpace: 'pre-line',
                }}
                className="leading-relaxed"
              >
                {data.interests.join(' · ')}
              </p>
            </section>
          )}
        </aside>

        <main className="space-y-7">
          {/* EXPÉRIENCES */}

          {data.experiences.length > 0 && (
            <section>
              <NumberTitle
                number="04"
                title="Expériences"
                colors={colors}
                fonts={fonts}
                size={fs(13)}
              />

              <div className="space-y-5">
                {data.experiences.map((exp) => (
                  <article key={exp.id}>
                    <div className="grid grid-cols-[1fr_auto] gap-5">
                      <div>
                        <h3
                          style={{
                            fontFamily: fonts.heading,
                            color: colors.secondary,
                            fontSize: fs(11),
                          }}
                          className="font-bold"
                        >
                          {exp.role}
                        </h3>

                        <p
                          style={{
                            color: colors.muted,
                            fontSize: fs(10.5),
                          }}
                          className="font-medium"
                        >
                          {exp.company}
                        </p>
                      </div>

                      <span
                        style={{
                          color: colors.muted,
                          fontSize: fs(9.5),
                        }}
                      >
                        {exp.period}
                      </span>
                    </div>

                    {exp.description && (
                      <p
                        style={{
                          fontSize: fs(10.5),
                          color: colors.muted,
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
              <NumberTitle
                number="05"
                title="Formation"
                colors={colors}
                fonts={fonts}
                size={fs(13)}
              />

              <div className="space-y-4">
                {data.education.map((ed) => (
                  <article key={ed.id}>
                    <div className="grid grid-cols-[1fr_auto] gap-5">
                      <div>
                        <h3
                          style={{
                            fontFamily: fonts.heading,
                            color: colors.secondary,
                            fontSize: fs(11),
                          }}
                          className="font-bold"
                        >
                          {ed.degree}
                        </h3>

                        <p
                          style={{
                            color: colors.muted,
                            fontSize: fs(10),
                          }}
                        >
                          {ed.school}
                        </p>
                      </div>

                      <span
                        style={{
                          color: colors.muted,
                          fontSize: fs(9.5),
                        }}
                      >
                        {ed.period}
                      </span>
                    </div>

                    {ed.description && (
                      <p
                        style={{
                          fontSize: fs(10),
                          color: colors.muted,
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
              <NumberTitle
                number="06"
                title="Projets"
                colors={colors}
                fonts={fonts}
                size={fs(13)}
              />

              <div className="space-y-3">
                {data.projects.map((project) => (
                  <article key={project.id}>
                    <h3
                      style={{
                        fontSize: fs(11.5),
                        color: colors.secondary,
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

                    {project.description && (
                      <p
                        style={{
                          fontSize: fs(9.5),
                          color: colors.muted,
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

function NumberTitle({
  number,
  title,
  colors,
  fonts,
  size,
}: {
  number: string;
  title: string;
  colors: ThemeColors;
  fonts: { heading: string; body: string };
  size: string;
}) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <span
        style={{
          color: colors.accent,
          fontSize: fsNumber(size),
        }}
        className="font-bold"
      >
        {number}
      </span>

      <h2
        style={{
          color: colors.primary,
          fontFamily: fonts.heading,
          fontSize: size,
        }}
        className="font-bold uppercase tracking-[0.18em]"
      >
        {title}
      </h2>
    </div>
  );
}

/**
 * Les numéros restent légèrement plus petits que les titres.
 */
function fsNumber(size: string) {
  const value = parseFloat(size);

  if (Number.isNaN(value)) {
    return size;
  }

  return `${value * 0.82}px`;
}