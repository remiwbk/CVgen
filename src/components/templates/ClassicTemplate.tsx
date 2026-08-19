import { Mail, Phone, MapPin, Globe, Linkedin, Github } from 'lucide-react';
import type { CVData, ThemeColors } from '@/types/types';

interface Props {
  data: CVData;
  colors: ThemeColors;
  fonts: { heading: string; body: string };
  fontScale: number;
}

export default function ClassicTemplate({ data, colors, fonts, fontScale }: Props) {
  const fs = (n: number) => `${n * fontScale}px`;
  const hasSkills = data.skills.some((c) => c.items.length > 0);

  return (
    <div
      style={{
        fontFamily: fonts.body,
        color: colors.text,
        fontSize: fs(14),
      }}
      className="w-full h-full px-12 py-12"
    >
      <header
        className="pb-6 border-b-2 flex items-center gap-6"
        style={{ borderColor: colors.primary }}
      >
        <div className={`flex-1 ${data.photo ? 'text-left' : 'text-center'}`}>
          <h1
            style={{
              fontFamily: fonts.heading,
              color: colors.primary,
              fontSize: fs(36),
            }}
            className="font-bold tracking-wide"
          >
            {data.name}
          </h1>

          <p
            style={{ fontSize: fs(18), color: colors.muted }}
            className="mt-2 tracking-wider uppercase"
          >
            {data.title}
          </p>

          <div
            style={{ fontSize: fs(12), color: colors.muted }}
            className={`flex flex-wrap gap-x-5 gap-y-1 mt-3 ${
              data.photo ? '' : 'justify-center'
            }`}
          >
            {data.email && (
              <span className="flex items-center gap-1">
                <Mail className="w-3 h-3" /> {data.email}
              </span>
            )}

            {data.phone && (
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3" /> {data.phone}
              </span>
            )}

            {data.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {data.location}
              </span>
            )}

            {data.website && (
              <span className="flex items-center gap-1">
                <Globe className="w-3 h-3" /> {data.website}
              </span>
            )}

            {data.linkedin && (
              <span className="flex items-center gap-1">
                <Linkedin className="w-3 h-3" /> {data.linkedin}
              </span>
            )}

            {data.github && (
              <span className="flex items-center gap-1">
                <Github className="w-3 h-3" /> {data.github}
              </span>
            )}
          </div>
        </div>

        {data.photo && (
          <img
            src={data.photo}
            alt={data.name}
            crossOrigin="anonymous"
            className="w-28 h-28 rounded-full object-cover shrink-0 border-2"
            style={{ borderColor: colors.primary }}
          />
        )}
      </header>

      <div className="mt-7 space-y-7">
        {data.summary && (
          <section>
            <h2
              style={{
                fontFamily: fonts.heading,
                color: colors.primary,
                fontSize: fs(17),
              }}
              className="font-bold uppercase tracking-wider mb-2"
            >
              Profil
            </h2>

            <p
              style={{
                fontSize: fs(13),
                color: colors.text,
                whiteSpace: 'pre-line',
              }}
              className="leading-relaxed text-justify"
            >
              {data.summary}
            </p>
          </section>
        )}

        {data.experiences.length > 0 && (
          <section>
            <h2
              style={{
                fontFamily: fonts.heading,
                color: colors.primary,
                fontSize: fs(17),
              }}
              className="font-bold uppercase tracking-wider mb-3"
            >
              Expériences Professionnelles
            </h2>

            <div className="space-y-4">
              {data.experiences.map((exp) => (
                <div key={exp.id}>
                  <div className="flex items-baseline justify-between gap-3">
                    <h3
                      style={{
                        fontFamily: fonts.heading,
                        color: colors.secondary,
                        fontSize: fs(15),
                      }}
                      className="font-bold italic"
                    >
                      {exp.role} — {exp.company}
                    </h3>

                    <span
                      style={{
                        fontSize: fs(12),
                        color: colors.muted,
                      }}
                      className="italic shrink-0"
                    >
                      {exp.period}
                    </span>
                  </div>

                  {exp.description && (
                    <p
                      style={{
                        fontSize: fs(13),
                        whiteSpace: 'pre-line',
                      }}
                      className="mt-1 leading-relaxed text-justify"
                    >
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {data.education.length > 0 && (
          <section>
            <h2
              style={{
                fontFamily: fonts.heading,
                color: colors.primary,
                fontSize: fs(17),
              }}
              className="font-bold uppercase tracking-wider mb-3"
            >
              Formation
            </h2>

            <div className="space-y-3">
              {data.education.map((ed) => (
                <div key={ed.id}>
                  <div className="flex items-baseline justify-between gap-3">
                    <h3
                      style={{
                        fontFamily: fonts.heading,
                        color: colors.secondary,
                        fontSize: fs(15),
                      }}
                      className="font-bold italic"
                    >
                      {ed.degree}
                    </h3>

                    <span
                      style={{
                        fontSize: fs(12),
                        color: colors.muted,
                      }}
                      className="italic shrink-0"
                    >
                      {ed.period}
                    </span>
                  </div>

                  <p
                    style={{ fontSize: fs(13) }}
                    className="font-medium"
                  >
                    {ed.school}
                  </p>

                  {ed.description && (
                    <p
                      style={{
                        fontSize: fs(13),
                        whiteSpace: 'pre-line',
                      }}
                      className="mt-1 leading-relaxed"
                    >
                      {ed.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {hasSkills && (
          <section>
            <h2
              style={{
                fontFamily: fonts.heading,
                color: colors.primary,
                fontSize: fs(17),
              }}
              className="font-bold uppercase tracking-wider mb-2"
            >
              Compétences
            </h2>

            <div className="space-y-2">
              {data.skills.map((cat) =>
                cat.items.length > 0 ? (
                  <div key={cat.id} className="flex gap-2">
                    <span
                      style={{
                        fontSize: fs(13),
                        color: colors.secondary,
                      }}
                      className="font-bold italic shrink-0"
                    >
                      {cat.name} :
                    </span>

                    <span
                      style={{ fontSize: fs(13) }}
                      className="leading-relaxed"
                    >
                      {cat.items.join(' • ')}
                    </span>
                  </div>
                ) : null
              )}
            </div>
          </section>
        )}

        {data.projects.length > 0 && (
          <section>
            <h2
              style={{
                fontFamily: fonts.heading,
                color: colors.primary,
                fontSize: fs(17),
              }}
              className="font-bold uppercase tracking-wider mb-3"
            >
              Projets
            </h2>

            <div className="space-y-2">
              {data.projects.map((p) => (
                <div key={p.id}>
                  <h3
                    style={{
                      fontFamily: fonts.heading,
                      color: colors.secondary,
                      fontSize: fs(15),
                    }}
                    className="font-bold italic"
                  >
                    {p.name}

                    {p.url && (
                      <span
                        style={{
                          fontSize: fs(12),
                          color: colors.accent,
                        }}
                        className="not-italic"
                      >
                        {' — '}
                        {p.url}
                      </span>
                    )}
                  </h3>

                  {p.description && (
                    <p
                      style={{
                        fontSize: fs(13),
                        whiteSpace: 'pre-line',
                      }}
                      className="leading-relaxed"
                    >
                      {p.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {data.interests.length > 0 && (
          <section>
            <h2
              style={{
                fontFamily: fonts.heading,
                color: colors.primary,
                fontSize: fs(17),
              }}
              className="font-bold uppercase tracking-wider mb-2"
            >
              Centres d'intérêt
            </h2>

            <p
              style={{
                fontSize: fs(13),
                whiteSpace: 'pre-line',
              }}
              className="leading-relaxed"
            >
              {data.interests.join(' • ')}
            </p>
          </section>
        )}
      </div>
    </div>
  );
}