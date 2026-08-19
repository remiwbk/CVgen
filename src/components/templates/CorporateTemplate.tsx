import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Linkedin,
  Github,
  CalendarDays,
} from 'lucide-react';

import type { CVData, ThemeColors } from '@/types/types';

interface Props {
  data: CVData;
  colors: ThemeColors;
  fonts: { heading: string; body: string };
  fontScale: number;
}

export default function CorporateTemplate({
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
      className="w-full h-full"
    >
      {/* HEADER */}
      <header
        className="px-10 py-7"
        style={{
          background: colors.primary,
          color: '#fff',
        }}
      >
        <div className="flex items-center gap-6">
          {data.photo && (
            <img
              src={data.photo}
              alt={data.name}
              crossOrigin="anonymous"
              className="w-24 h-24 rounded-lg object-cover shrink-0"
            />
          )}

          <div className="flex-1">
            <h1
              style={{
                fontFamily: fonts.heading,
                fontSize: fs(34),
              }}
              className="font-bold tracking-tight"
            >
              {data.name}
            </h1>

            <p
              style={{ fontSize: fs(16) }}
              className="mt-1 opacity-90"
            >
              {data.title}
            </p>

            <div
              style={{ fontSize: fs(9.5) }}
              className="flex flex-wrap gap-x-4 gap-y-1.5 mt-4 opacity-85"
            >
              {data.email && (
                <span className="flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  {data.email}
                </span>
              )}

              {data.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  {data.phone}
                </span>
              )}

              {data.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {data.location}
                </span>
              )}

              {data.website && (
                <span className="flex items-center gap-1">
                  <Globe className="w-3 h-3" />
                  {data.website}
                </span>
              )}

              {data.linkedin && (
                <span className="flex items-center gap-1">
                  <Linkedin className="w-3 h-3" />
                  {data.linkedin}
                </span>
              )}

              {data.github && (
                <span className="flex items-center gap-1">
                  <Github className="w-3 h-3" />
                  {data.github}
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <div className="px-10 py-8 grid grid-cols-[0.7fr_1.3fr] gap-9">

        {/* LEFT COLUMN */}
        <aside className="space-y-7">

          {/* PROFIL */}
          {data.summary && (
            <section>
              <Title
                text="Profil"
                fonts={fonts}
                colors={colors}
                size={fs(14)}
              />

              <p
                style={{
                  color: colors.muted,
                  fontSize: fs(11),
                  whiteSpace: 'pre-line',
                }}
                className="leading-relaxed"
              >
                {data.summary}
              </p>
            </section>
          )}

          {/* COMPETENCES */}
          {hasSkills && (
            <section>
              <Title
                text="Compétences"
                fonts={fonts}
                colors={colors}
                size={fs(14)}
              />

              <div className="space-y-4">
                {data.skills.map((category) =>
                  category.items.length > 0 ? (
                    <div key={category.id}>
                      <h3
                        style={{
                          color: colors.secondary,
                          fontSize: fs(10.5),
                        }}
                        className="font-bold uppercase tracking-wide mb-1.5"
                      >
                        {category.name}
                      </h3>

                      <div className="flex flex-wrap gap-1.5">
                        {category.items.map((skill, index) => (
                          <span
                            key={index}
                            style={{
                              color: colors.text,
                              background: colors.surface,
                              borderColor: colors.border,
                              fontSize: fs(9.5),
                            }}
                            className="px-2 py-1 rounded border"
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

          {/* INTERETS */}
          {data.interests.length > 0 && (
            <section>
              <Title
                text="Intérêts"
                fonts={fonts}
                colors={colors}
                size={fs(14)}
              />

              <div className="space-y-1.5">
                {data.interests.map((interest, index) => (
                  <div
                    key={index}
                    style={{
                      fontSize: fs(10.5),
                      color: colors.muted,
                    }}
                  >
                    • {interest}
                  </div>
                ))}
              </div>
            </section>
          )}
        </aside>

        {/* RIGHT COLUMN */}
        <main className="space-y-7">

          {/* EXPERIENCES */}
          {data.experiences.length > 0 && (
            <section>
              <Title
                text="Expériences professionnelles"
                fonts={fonts}
                colors={colors}
                size={fs(14)}
              />

              <div className="space-y-5">
                {data.experiences.map((exp) => (
                  <article
                    key={exp.id}
                    className="relative pl-5"
                  >
                    <div
                      className="absolute left-0 top-1.5 w-2 h-2 rounded-full"
                      style={{
                        background: colors.accent,
                      }}
                    />

                    <div
                      className="absolute left-[3px] top-4 bottom-0 w-px"
                      style={{
                        background: colors.border,
                      }}
                    />

                    <div className="flex justify-between gap-4">
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
                            color: colors.secondary,
                            fontSize: fs(11),
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
                        className="shrink-0 flex items-center gap-1"
                      >
                        <CalendarDays className="w-3 h-3" />
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
              <Title
                text="Formation"
                fonts={fonts}
                colors={colors}
                size={fs(14)}
              />

              <div className="space-y-4">
                {data.education.map((ed) => (
                  <article key={ed.id}>
                    <div className="flex justify-between gap-4">
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
                            color: colors.secondary,
                            fontSize: fs(10.5),
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
                        className="shrink-0"
                      >
                        {ed.period}
                      </span>
                    </div>

                    {ed.description && (
                      <p
                        style={{
                          color: colors.muted,
                          fontSize: fs(10.5),
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
              <Title
                text="Projets"
                fonts={fonts}
                colors={colors}
                size={fs(14)}
              />

              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
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
                      <p
                        style={{
                          color: colors.accent,
                          fontSize: fs(9),
                        }}
                      >
                        {project.url}
                      </p>
                    )}

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

function Title({
  text,
  fonts,
  colors,
  size,
}: {
  text: string;
  fonts: { heading: string; body: string };
  colors: ThemeColors;
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
      {text}
    </h2>
  );
}