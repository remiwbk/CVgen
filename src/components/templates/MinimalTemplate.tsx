import { Mail, Phone, MapPin, Globe, Linkedin, Github } from 'lucide-react';
import type { CVData, ThemeColors } from '@/types/types';

interface Props {
  data: CVData;
  colors: ThemeColors;
  fonts: { heading: string; body: string };
  fontScale: number;
}

export default function MinimalTemplate({ data, colors, fonts, fontScale }: Props) {
  const fs = (n: number) => `${n * fontScale}px`;
  const hasSkills = data.skills.some((c) => c.items.length > 0);

  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h2 style={{ fontFamily: fonts.heading, color: colors.text, fontSize: fs(11) }} className="font-semibold uppercase tracking-[0.2em] mb-3">
      {children}
    </h2>
  );

  return (
    <div style={{ fontFamily: fonts.body, color: colors.text, fontSize: fs(14) }} className="w-full h-full px-14 py-14">
      <header className="mb-9 flex items-start justify-between gap-6">
        <div className="flex-1">
          <h1 style={{ fontFamily: fonts.heading, fontSize: fs(48) }} className="font-bold tracking-tight leading-none">{data.name}</h1>
          <p style={{ fontSize: fs(18), color: colors.accent }} className="mt-3">{data.title}</p>
          <div style={{ fontSize: fs(12), color: colors.muted }} className="flex flex-wrap gap-x-5 gap-y-1 mt-4">
            {data.email && <span className="flex items-center gap-1.5"><Mail className="w-3 h-3" /> {data.email}</span>}
            {data.phone && <span className="flex items-center gap-1.5"><Phone className="w-3 h-3" /> {data.phone}</span>}
            {data.location && <span className="flex items-center gap-1.5"><MapPin className="w-3 h-3" /> {data.location}</span>}
            {data.website && <span className="flex items-center gap-1.5"><Globe className="w-3 h-3" /> {data.website}</span>}
            {data.linkedin && <span className="flex items-center gap-1.5"><Linkedin className="w-3 h-3" /> {data.linkedin}</span>}
            {data.github && <span className="flex items-center gap-1.5"><Github className="w-3 h-3" /> {data.github}</span>}
          </div>
        </div>
        {data.photo && <img src={data.photo} alt={data.name} crossOrigin="anonymous" className="w-24 h-24 rounded-full object-cover shrink-0" />}
      </header>

      <div className="space-y-8">
        {data.summary && (
          <section>
            <SectionTitle>Profil</SectionTitle>
            <p style={{ fontSize: fs(13), color: colors.muted }} className="leading-relaxed">{data.summary}</p>
          </section>
        )}

        {data.experiences.length > 0 && (
          <section>
            <SectionTitle>Expériences</SectionTitle>
            <div className="space-y-5">
              {data.experiences.map((exp) => (
                <div key={exp.id} className="grid grid-cols-4 gap-4">
                  <div style={{ fontSize: fs(11), color: colors.muted }} className="col-span-1 pt-0.5">{exp.period}</div>
                  <div className="col-span-3">
                    <h3 style={{ fontSize: fs(13) }} className="font-semibold">{exp.role}</h3>
                    <p style={{ fontSize: fs(13), color: colors.muted }}>{exp.company}</p>
                    {exp.description && <p style={{ fontSize: fs(13), color: colors.muted }} className="mt-1.5 leading-relaxed">{exp.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.education.length > 0 && (
          <section>
            <SectionTitle>Formation</SectionTitle>
            <div className="space-y-3">
              {data.education.map((ed) => (
                <div key={ed.id} className="grid grid-cols-4 gap-4">
                  <div style={{ fontSize: fs(11), color: colors.muted }} className="col-span-1 pt-0.5">{ed.period}</div>
                  <div className="col-span-3">
                    <h3 style={{ fontSize: fs(13) }} className="font-semibold">{ed.degree}</h3>
                    <p style={{ fontSize: fs(13), color: colors.muted }}>{ed.school}</p>
                    {ed.description && <p style={{ fontSize: fs(13), color: colors.muted }} className="mt-1 leading-relaxed">{ed.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {hasSkills && (
          <section>
            <SectionTitle>Compétences</SectionTitle>
            <div className="space-y-2">
              {data.skills.map((cat) =>
                cat.items.length > 0 ? (
                  <div key={cat.id} className="grid grid-cols-4 gap-4">
                    <div style={{ fontSize: fs(12), color: colors.accent }} className="col-span-1 pt-0.5 font-medium">{cat.name}</div>
                    <div style={{ fontSize: fs(13), color: colors.muted }} className="col-span-3">
                      {cat.items.map((s, i) => (
                        <span key={i}>{s}{i < cat.items.length - 1 && <span style={{ color: colors.border }}> /</span>}</span>
                      ))}
                    </div>
                  </div>
                ) : null
              )}
            </div>
          </section>
        )}

        {data.projects.length > 0 && (
          <section>
            <SectionTitle>Projets</SectionTitle>
            <div className="space-y-3">
              {data.projects.map((p) => (
                <div key={p.id} className="grid grid-cols-4 gap-4">
                  <div style={{ fontSize: fs(11), color: colors.accent }} className="col-span-1 pt-0.5">{p.url}</div>
                  <div className="col-span-3">
                    <h3 style={{ fontSize: fs(13) }} className="font-semibold">{p.name}</h3>
                    {p.description && <p style={{ fontSize: fs(13), color: colors.muted }} className="mt-1 leading-relaxed">{p.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.interests.length > 0 && (
          <section>
            <SectionTitle>Centres d'intérêt</SectionTitle>
            <div style={{ fontSize: fs(13), color: colors.muted }} className="flex flex-wrap gap-x-4 gap-y-1.5">
              {data.interests.map((it, i) => (
                <span key={i}>{it}{i < data.interests.length - 1 && <span style={{ color: colors.border }}> /</span>}</span>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
