import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Linkedin,
  Github,
  Terminal,
} from 'lucide-react';

import type { CVData, ThemeColors } from '@/types/types';

interface Props {
  data: CVData;
  colors: ThemeColors;
  fonts: { heading: string; body: string };
  fontScale: number;
}

export default function TechTemplate({
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
      className="w-full h-full px-9 py-9"
    >
      {/* HEADER */}
      <header className="flex gap-6 items-center">
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
          style={{
            background: colors.primary,
            color: '#fff',
          }}
        >
          <Terminal className="w-7 h-7" />
        </div>

        <div className="flex-1">
          <h1
            style={{
              fontFamily: fonts.heading,
              color: colors.primary,
              fontSize: fs(35),
            }}
            className="font-bold tracking-tight"
          >
            {data.name}
          </h1>

          <p
            style={{
              color: colors.accent,
              fontSize: fs(15),
            }}
            className="font-semibold"
          >
            {data.title}
          </p>
        </div>

        {data.photo && (
          <img
            src={data.photo}
            alt={data.name}
            crossOrigin="anonymous"
            className="rounded-xl object-cover shrink-0"
            style={{
              width: `${96 * (data.photoScale ?? 1)}px`,
              height: `${96 * (data.photoScale ?? 1)}px`,
            }}
          />
        )}
      </header>

      {/* CONTACT */}
      <div
        className="flex flex-wrap gap-x-4 gap-y-1.5 mt-5 pb-5 border-b"
        style={{
          borderColor: colors.border,
          color: colors.muted,
          fontSize: fs(9.5),
        }}
      >
        {data.email && (
          <a
            href={`mailto:${data.email}`}
            className="flex gap-1.5 items-center hover:underline"
          >
            <Mail className="w-3 h-3" />
            {data.email}
          </a>
        )}

        {data.phone && (
          <a
            href={`tel:${data.phone}`}
            className="flex gap-1.5 items-center hover:underline"
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
            className="flex gap-1.5 items-center hover:underline"
          >
            <MapPin className="w-3 h-3" />
            {data.location}
          </a>
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
            className="flex gap-1.5 items-center hover:underline"
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
            className="flex gap-1.5 items-center hover:underline"
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
            className="flex gap-1.5 items-center hover:underline"
          >
            <Github className="w-3 h-3" />
            {data.github}
          </a>
        )}
      </div>

      {/* CONTENT */}
      <div className="grid grid-cols-[0.62fr_1.38fr] gap-8 mt-6">

        {/* LEFT COLUMN */}
        <aside className="space-y-6">

          {/* PROFIL */}
          {data.summary && (
            <section>
              <Heading
                title="Profil"
                colors={colors}
                fonts={fonts}
                size={fs(14)}
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

          {/* SKILLS */}
          {hasSkills && (
            <section>
              <Heading
                title="Stack technique"
                colors={colors}
                fonts={fonts}
                size={fs(14)}
              />

              <div className="space-y-4">
                {data.skills.map((category) =>
                  category.items.length > 0 ? (
                    <div key={category.id}>
                      <h3
                        style={{
                          color: colors.accent,
                          fontSize: fs(10.5),
                        }}
                        className="font-bold uppercase tracking-wide mb-1.5"
                      >
                        {category.name}
                      </h3>

                      <div className="flex flex-wrap gap-1">
                        {category.items.map((skill, index) => (
                          <span
                            key={index}
                            style={{
                              background: colors.surface,
                              borderColor: colors.border,
                              color: colors.text,
                              fontSize: fs(9),
                            }}
                            className="rounded px-1.5 py-1 border"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null
                )}
              </div>
            </section>
          )}

          {/* INTERESTS */}
          {data.interests.length > 0 && (
            <section>
              <Heading
                title="Intérêts"
                colors={colors}
                fonts={fonts}
                size={fs(14)}
              />

              <p
                style={{
                  fontSize: fs(10),
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
        <main className="space-y-6">

          {/* EXPERIENCE */}
          {data.experiences.length > 0 && (
            <section>
              <Heading
                title="Expérience"
                colors={colors}
                fonts={fonts}
                size={fs(14)}
              />

              <div className="space-y-5">
                {data.experiences.map((exp) => (
                  <article key={exp.id}>
                    <div className="flex justify-between gap-4">
                      <div>
                        <h3
                          style={{
                            color: colors.secondary,
                            fontFamily: fonts.heading,
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
                          className="font-medium"
                        >
                          {exp.company}
                        </p>
                      </div>

                      <span
                        style={{
                          color: colors.muted,
                          fontSize: fs(9),
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

          {/* EDUCATION */}
          {data.education.length > 0 && (
            <section>
              <Heading
                title="Formation"
                colors={colors}
                fonts={fonts}
                size={fs(14)}
              />

              <div className="space-y-4">
                {data.education.map((ed) => (
                  <article key={ed.id}>
                    <div className="flex justify-between gap-4">
                      <div>
                        <h3
                          style={{
                            color: colors.secondary,
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

          {/* PROJECTS */}
          {data.projects.length > 0 && (
            <section>
              <Heading
                title="Projets"
                colors={colors}
                fonts={fonts}
                size={fs(14)}
              />

              <div className="grid grid-cols-2 gap-x-5 gap-y-4">
                {data.projects.map((project) => (
                  <article key={project.id}>
                    <h3
                      style={{
                        color: colors.secondary,
                        fontSize: fs(10.5),
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
                      >
                        {project.url}
                      </a>
                    )}

                    {project.description && (
                      <p
                        style={{
                          color: colors.muted,
                          fontSize: fs(9),
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

function Heading({
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
        color: colors.primary,
        fontFamily: fonts.heading,
        fontSize: size,
      }}
      className="font-bold uppercase tracking-[0.2em] mb-4 flex items-center gap-2"
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: colors.accent }}
      />
      {title}
    </h2>
  );
}