import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Linkedin,
  Github,
  Car,
} from 'lucide-react';

import type { CVData, ThemeColors } from '@/types/types';

interface Props {
  data: CVData;
  colors: ThemeColors;
  fonts: { heading: string; body: string };
  fontScale: number;
}

function calculateAge(birthDate?: string): number | null {
  if (!birthDate) return null;

  const birth = new Date(birthDate);

  if (Number.isNaN(birth.getTime())) {
    return null;
  }

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

export default function EditorialTemplate({
  data,
  colors,
  fonts,
  fontScale,
}: Props) {
  const fs = (n: number) => `${n * fontScale}px`;
  const hasSkills = data.skills.some((c) => c.items.length > 0);

  const age = calculateAge(data.birthDate);

  const contactItems = [
    {
      value: data.email,
      icon: Mail,
      href: data.email ? `mailto:${data.email}` : undefined,
    },
    {
      value: data.phone,
      icon: Phone,
      href: data.phone ? `tel:${data.phone}` : undefined,
    },
    {
      value: data.location,
      icon: MapPin,
    },
    {
      value: data.website,
      icon: Globe,
      href: data.website
        ? data.website.startsWith('http')
          ? data.website
          : `https://${data.website}`
        : undefined,
    },
    {
      value: data.linkedin,
      icon: Linkedin,
      href: data.linkedin
        ? data.linkedin.startsWith('http')
          ? data.linkedin
          : `https://${data.linkedin}`
        : undefined,
    },
    {
      value: data.github,
      icon: Github,
      href: data.github
        ? data.github.startsWith('http')
          ? data.github
          : `https://${data.github}`
        : undefined,
    },
  ];

  return (
    <div
      style={{
        fontFamily: fonts.body,
        color: colors.text,
        fontSize: fs(14),
      }}
      className="w-full h-full px-11 py-10"
    >
      {/* HEADER */}

      <header
        className="grid grid-cols-[1fr_auto] gap-8 pb-7 border-b"
        style={{ borderColor: colors.border }}
      >
        <div>
          <div
            style={{
              color: colors.accent,
              fontSize: fs(11),
            }}
            className="font-bold uppercase tracking-[0.3em] mb-3"
          >
            Curriculum Vitae
          </div>

          <h1
            style={{
              fontFamily: fonts.heading,
              fontSize: fs(42),
              color: colors.primary,
            }}
            className="font-bold leading-none tracking-tight"
          >
            {data.name}
          </h1>

          <p
            style={{
              fontSize: fs(17),
              color: colors.secondary,
            }}
            className="mt-3 font-medium"
          >
            {data.title}
          </p>

          <div
            style={{
              fontSize: fs(10.5),
              color: colors.muted,
            }}
            className="flex flex-wrap gap-x-4 gap-y-1.5 mt-5"
          >
            {contactItems.map(({ value, icon: Icon, href }, index) =>
              value ? (
                <span
                  key={index}
                  className="flex items-center gap-1.5"
                >
                  <Icon className="w-3 h-3" />

                  {href ? (
                    <a
                      href={href}
                      target={
                        href.startsWith('http')
                          ? '_blank'
                          : undefined
                      }
                      rel={
                        href.startsWith('http')
                          ? 'noopener noreferrer'
                          : undefined
                      }
                      style={{
                        color: 'inherit',
                        textDecoration: 'underline',
                      }}
                    >
                      {value}
                    </a>
                  ) : (
                    value
                  )}
                </span>
              ) : null
            )}

            {/* ÂGE */}
            {age !== null && (
              <span className="flex items-center gap-1.5">
                <span aria-hidden="true">🎂</span>
                {age} ans
              </span>
            )}

            {/* PERMIS B */}
            {data.hasDrivingLicense && (
              <span className="flex gap-1.5 items-center">
                <Car className="w-3 h-3" />
                Permis B
              </span>
            )}
          </div>
        </div>

        {data.photo && (
          <img
            src={data.photo}
            alt={data.name}
            crossOrigin="anonymous"
            className="object-cover rounded-xl shrink-0"
            style={{
              width: `${112 * (data.photoScale ?? 1)}px`,
              height: `${112 * (data.photoScale ?? 1)}px`,
              border: `3px solid ${colors.primary}`,
            }}
          />
        )}
      </header>

      {/* CONTENT */}

      <div className="grid grid-cols-[0.72fr_1.28fr] gap-9 mt-8">

        {/* LEFT COLUMN */}

        <aside className="space-y-7">

          {/* PROFIL */}

          {data.summary && (
            <section>
              <SectionTitle
                fonts={fonts}
                colors={colors}
                fontSize={fs(13)}
              >
                Profil
              </SectionTitle>

              <p
                style={{
                  fontSize: fs(11.5),
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
              <SectionTitle
                fonts={fonts}
                colors={colors}
                fontSize={fs(13)}
              >
                Compétences
              </SectionTitle>

              <div className="space-y-3">
                {data.skills.map((category) =>
                  category.items.length > 0 ? (
                    <div key={category.id}>
                      <h3
                        style={{
                          color: colors.primary,
                          fontSize: fs(11),
                        }}
                        className="font-bold mb-1"
                      >
                        {category.name}
                      </h3>

                      <p
                        style={{
                          fontSize: fs(10.5),
                          color: colors.muted,
                          whiteSpace: 'pre-line',
                        }}
                        className="leading-relaxed"
                      >
                        {category.items.join(' • ')}
                      </p>
                    </div>
                  ) : null
                )}
              </div>
            </section>
          )}

          {/* CENTRES D'INTÉRÊT */}

          {data.interests.length > 0 && (
            <section>
              <SectionTitle
                fonts={fonts}
                colors={colors}
                fontSize={fs(13)}
              >
                Centres d'intérêt
              </SectionTitle>

              <p
                style={{
                  fontSize: fs(10.5),
                  color: colors.muted,
                  whiteSpace: 'pre-line',
                }}
                className="leading-relaxed"
              >
                {data.interests.join(' • ')}
              </p>
            </section>
          )}
        </aside>

        {/* RIGHT COLUMN */}

        <main className="space-y-7">

          {/* EXPÉRIENCES */}

          {data.experiences.length > 0 && (
            <section>
              <SectionTitle
                fonts={fonts}
                colors={colors}
                fontSize={fs(13)}
              >
                Expériences
              </SectionTitle>

              <div className="space-y-5">
                {data.experiences.map((exp) => (
                  <article key={exp.id}>
                    <div className="flex items-start justify-between gap-4">

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
                            fontSize: fs(11.5),
                          }}
                          className="font-medium mt-0.5"
                        >
                          {exp.company}
                        </p>
                      </div>

                      <span
                        style={{
                          color: colors.muted,
                          fontSize: fs(10),
                        }}
                        className="shrink-0 pt-1"
                      >
                        {exp.period}
                      </span>

                    </div>

                    {exp.description && (
                      <p
                        style={{
                          fontSize: fs(11),
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
              <SectionTitle
                fonts={fonts}
                colors={colors}
                fontSize={fs(13)}
              >
                Formation
              </SectionTitle>

              <div className="space-y-4">
                {data.education.map((ed) => (
                  <article key={ed.id}>
                    <div className="flex items-start justify-between gap-4">

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
                            fontSize: fs(11),
                          }}
                          className="font-medium mt-0.5"
                        >
                          {ed.school}
                        </p>
                      </div>

                      <span
                        style={{
                          color: colors.muted,
                          fontSize: fs(10),
                        }}
                        className="shrink-0"
                      >
                        {ed.period}
                      </span>

                    </div>

                    {ed.description && (
                      <p
                        style={{
                          fontSize: fs(11),
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
              <SectionTitle
                fonts={fonts}
                colors={colors}
                fontSize={fs(13)}
              >
                Projets
              </SectionTitle>

              <div className="space-y-3">
                {data.projects.map((project) => (
                  <article key={project.id}>
                    <h3
                      style={{
                        color: colors.primary,
                        fontSize: fs(13),
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
                          fontSize: fs(9.5),
                          textDecoration: 'underline',
                        }}
                        className="inline-block mt-0.5"
                      >
                        {project.url}
                      </a>
                    )}

                    {project.description && (
                      <p
                        style={{
                          color: colors.muted,
                          fontSize: fs(10.5),
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

function SectionTitle({
  children,
  fonts,
  colors,
  fontSize,
}: {
  children: React.ReactNode;
  fonts: { heading: string; body: string };
  colors: ThemeColors;
  fontSize: string;
}) {
  return (
    <h2
      style={{
        fontFamily: fonts.heading,
        color: colors.primary,
        fontSize,
      }}
      className="font-bold uppercase tracking-[0.16em] pb-2 mb-4 border-b"
    >
      {children}
    </h2>
  );
}