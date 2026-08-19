import { Plus, Trash2, GripVertical, ImagePlus, X, Type, Palette, ChevronDown, Linkedin, Github } from 'lucide-react';
import type { CVData, Experience, Education, Project, SkillCategory, CVStyle } from '@/types/types';
import { fontFamilies, colorPresets } from '@/themes';

interface Props {
  data: CVData;
  onChange: (data: CVData) => void;
}

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

const inputCls =
  'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 bg-white outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 placeholder:text-slate-400';
const labelCls = 'block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide';

export default function CVForm({ data, onChange }: Props) {
  const update = <K extends keyof CVData>(key: K, value: CVData[K]) => onChange({ ...data, [key]: value });
  const updateStyle = (patch: Partial<CVData['style']>) => onChange({ ...data, style: { ...data.style, ...patch } });

  const arrayOps = {
    add: <T extends { id: string }>(key: 'experiences' | 'education' | 'projects', item: T) =>
      update(key, [...data[key], item] as CVData[typeof key]),
    remove: (key: 'experiences' | 'education' | 'projects', id: string) =>
      update(key, (data[key] as { id: string }[]).filter((x) => x.id !== id) as CVData[typeof key]),
    patch: <K extends 'experiences' | 'education' | 'projects'>(
      key: K,
      id: string,
      field: string,
      value: string
    ) =>
      update(
        key,
        (data[key] as { id: string }[]).map((x) => (x.id === id ? { ...x, [field]: value } : x)) as CVData[K]
      ),
  };

  // Skill category ops
  const skillOps = {
    addCategory: () =>
      update('skills', [...data.skills, { id: uid(), name: 'Nouvelle catégorie', items: [] } as SkillCategory]),
    removeCategory: (id: string) => update('skills', data.skills.filter((c) => c.id !== id)),
    renameCategory: (id: string, name: string) =>
      update('skills', data.skills.map((c) => (c.id === id ? { ...c, name } : c))),
    addItem: (catId: string, item: string) => {
      const v = item.trim();
      if (!v) return;
      update(
        'skills',
        data.skills.map((c) => (c.id === catId ? { ...c, items: [...c.items, v] } : c))
      );
    },
    removeItem: (catId: string, idx: number) =>
      update(
        'skills',
        data.skills.map((c) => (c.id === catId ? { ...c, items: c.items.filter((_, i) => i !== idx) } : c))
      ),
  };

  return (
    <div className="space-y-6">
      {/* Style settings */}
      <section className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <span className="w-1 h-4 bg-slate-900 rounded-full" /> Style
        </h3>

        {/* Font size */}
        <div>
          <label className={`${labelCls} flex items-center gap-1.5`}>
            <Type className="w-3.5 h-3.5" /> Taille du texte
            <span className="ml-auto normal-case tracking-normal text-slate-400 font-medium">
              {Math.round(data.style.fontScale * 100)}%
            </span>
          </label>
          <input
            type="range"
            min={0.8}
            max={1.3}
            step={0.05}
            value={data.style.fontScale}
            onChange={(e) => updateStyle({ fontScale: parseFloat(e.target.value) })}
            className="w-full accent-slate-900"
          />
        </div>

        {/* Font family */}
        <div>
          <label className={labelCls}>Police</label>
          <div className="grid grid-cols-2 gap-2">
            {fontFamilies.map((f) => (
              <button
                key={f.id}
                onClick={() => updateStyle({ fontFamily: f.id })}
                style={{ fontFamily: f.stack }}
                className={`rounded-lg border px-3 py-2 text-sm transition text-left ${
                  data.style.fontFamily === f.id
                    ? 'border-slate-900 bg-slate-50 text-slate-900 ring-1 ring-slate-900'
                    : 'border-slate-200 text-slate-600 hover:border-slate-400'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Colors */}
        <div>
          <label className={`${labelCls} flex items-center gap-1.5`}>
            <Palette className="w-3.5 h-3.5" /> Couleurs
          </label>
          <div className="grid grid-cols-6 gap-2 mb-3">
            {colorPresets.map((p) => (
              <button
                key={p.name}
                onClick={() => updateStyle({ primary: p.primary, accent: p.accent })}
                title={p.name}
                className={`h-9 rounded-lg transition border-2 ${
                  data.style.primary === p.primary ? 'ring-2 ring-offset-1 ring-slate-900 border-white' : 'border-white hover:scale-105'
                }`}
                style={{ background: p.primary }}
              />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-2.5 rounded-lg border border-slate-200 p-3 bg-slate-50/60">
            {([
              ['primary', 'Principale'],
              ['secondary', 'Secondaire'],
              ['accent', 'Accent'],
              ['text', 'Texte'],
              ['muted', 'Texte léger'],
              ['surface', 'Fond clair'],
              ['border', 'Bordures'],
            ] as [keyof CVStyle, string][]).map(([key, label]) => (
              <div key={key} className="flex items-center gap-2">
                <input
                  type="color"
                  value={(data.style[key] as string) || '#000000'}
                  onChange={(e) => updateStyle({ [key]: e.target.value } as Partial<CVStyle>)}
                  className="w-8 h-8 rounded border border-slate-200 cursor-pointer bg-white p-0.5 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-medium text-slate-600 block leading-tight">{label}</span>
                  <input
                    className="w-full text-[10px] text-slate-400 bg-transparent border-none outline-none p-0"
                    value={(data.style[key] as string) || ''}
                    onChange={(e) => updateStyle({ [key]: e.target.value } as Partial<CVStyle>)}
                    placeholder="auto"
                  />
                </div>
                {data.style[key] && (
                  <button
                    onClick={() => updateStyle({ [key]: '' } as Partial<CVStyle>)}
                    className="text-slate-300 hover:text-slate-600 shrink-0"
                    aria-label="Réinitialiser"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            onClick={() => updateStyle({ primary: '', secondary: '', accent: '', text: '', muted: '', surface: '', border: '' })}
            className="mt-2 text-xs text-slate-400 hover:text-slate-700"
          >
            Réinitialiser toutes les couleurs
          </button>
        </div>
      </section>

      {/* Identity */}
      <section className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <span className="w-1 h-4 bg-slate-900 rounded-full" /> Identité
        </h3>
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            {data.photo ? (
              <div className="relative">
                <img src={data.photo} alt="Photo" className="w-20 h-20 rounded-full object-cover border-2 border-slate-200" />
                <button
                  onClick={() => update('photo', '')}
                  className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-slate-700 transition shadow"
                  aria-label="Supprimer la photo"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-20 h-20 rounded-full border-2 border-dashed border-slate-300 cursor-pointer hover:border-slate-500 hover:bg-slate-50 transition gap-1 text-slate-400">
                <ImagePlus className="w-5 h-5" />
                <span className="text-[9px] font-medium text-center leading-tight">Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = () => update('photo', reader.result as string);
                    reader.readAsDataURL(file);
                  }}
                />
              </label>
            )}
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Ajoutez une photo de profil. Elle apparaîtra dans l'en-tête du CV. Utilisez un cadrage carré pour un meilleur rendu.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Nom complet</label>
            <input className={inputCls} value={data.name} onChange={(e) => update('name', e.target.value)} placeholder="Alex Martin" />
          </div>
          <div>
            <label className={labelCls}>Titre / Poste</label>
            <input className={inputCls} value={data.title} onChange={(e) => update('title', e.target.value)} placeholder="Senior Product Designer" />
          </div>
          <div>
            <label className={labelCls}>Email</label>
            <input className={inputCls} value={data.email} onChange={(e) => update('email', e.target.value)} placeholder="alex@email.com" />
          </div>
          <div>
            <label className={labelCls}>Téléphone</label>
            <input className={inputCls} value={data.phone} onChange={(e) => update('phone', e.target.value)} placeholder="+33 6 ..." />
          </div>
          <div>
            <label className={labelCls}>Localisation</label>
            <input className={inputCls} value={data.location} onChange={(e) => update('location', e.target.value)} placeholder="Paris, France" />
          </div>
          <div>
            <label className={labelCls}>Site web</label>
            <input className={inputCls} value={data.website} onChange={(e) => update('website', e.target.value)} placeholder="alex.design" />
          </div>
          <div>
            <label className={`${labelCls} flex items-center gap-1`}><Linkedin className="w-3 h-3" /> LinkedIn</label>
            <input className={inputCls} value={data.linkedin} onChange={(e) => update('linkedin', e.target.value)} placeholder="linkedin.com/in/..." />
          </div>
          <div>
            <label className={`${labelCls} flex items-center gap-1`}><Github className="w-3 h-3" /> GitHub</label>
            <input className={inputCls} value={data.github} onChange={(e) => update('github', e.target.value)} placeholder="github.com/..." />
          </div>
        </div>
        <div>
          <label className={labelCls}>Résumé / Profil</label>
          <textarea className={`${inputCls} resize-none`} rows={3} value={data.summary} onChange={(e) => update('summary', e.target.value)} />
        </div>
      </section>

      {/* Skills — categories */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <span className="w-1 h-4 bg-slate-900 rounded-full" /> Compétences
          </h3>
          <button
            onClick={skillOps.addCategory}
            className="text-xs font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Catégorie
          </button>
        </div>
        <div className="space-y-3">
          {data.skills.map((cat) => (
            <div key={cat.id} className="rounded-xl border border-slate-200 p-3 space-y-2.5 bg-slate-50/60">
              <div className="flex items-center gap-2">
                <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  className={`${inputCls} font-semibold`}
                  value={cat.name}
                  onChange={(e) => skillOps.renameCategory(cat.id, e.target.value)}
                  placeholder="Nom de la catégorie"
                />
                <button
                  onClick={() => skillOps.removeCategory(cat.id)}
                  className="text-slate-400 hover:text-red-500 transition shrink-0"
                  aria-label="Supprimer la catégorie"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 pl-6">
                {cat.items.map((item, i) => (
                  <span key={i} className="inline-flex items-center gap-1 rounded-md bg-white border border-slate-200 pl-2 pr-1 py-0.5 text-xs text-slate-700">
                    {item}
                    <button
                      onClick={() => skillOps.removeItem(cat.id, i)}
                      className="rounded p-0.5 hover:bg-slate-200 text-slate-400"
                      aria-label="Supprimer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const input = e.currentTarget.elements.namedItem('item') as HTMLInputElement;
                  skillOps.addItem(cat.id, input.value);
                  input.value = '';
                }}
                className="flex gap-2 pl-6"
              >
                <input name="item" className={inputCls} placeholder="Ajouter un élément (ex: Linux)" />
                <button type="submit" className="shrink-0 rounded-lg bg-slate-200 px-2.5 text-xs font-medium text-slate-700 hover:bg-slate-300 transition flex items-center gap-1">
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          ))}
          {data.skills.length === 0 && (
            <p className="text-xs text-slate-400 italic">Aucune catégorie. Cliquez sur « Catégorie » pour commencer.</p>
          )}
        </div>
      </section>

      {/* Experiences */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <span className="w-1 h-4 bg-slate-900 rounded-full" /> Expériences
          </h3>
          <button
            onClick={() => arrayOps.add('experiences', { id: uid(), role: '', company: '', period: '', description: '' } as Experience)}
            className="text-xs font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Ajouter
          </button>
        </div>
        <div className="space-y-3">
          {data.experiences.map((exp) => (
            <div key={exp.id} className="rounded-xl border border-slate-200 p-3 space-y-2 bg-slate-50/60">
              <div className="flex items-start justify-between gap-2">
                <GripVertical className="w-4 h-4 text-slate-300 mt-2 shrink-0" />
                <div className="flex-1 grid grid-cols-2 gap-2">
                  <input className={inputCls} value={exp.role} onChange={(e) => arrayOps.patch('experiences', exp.id, 'role', e.target.value)} placeholder="Poste" />
                  <input className={inputCls} value={exp.company} onChange={(e) => arrayOps.patch('experiences', exp.id, 'company', e.target.value)} placeholder="Entreprise" />
                </div>
                <button onClick={() => arrayOps.remove('experiences', exp.id)} className="mt-2 text-slate-400 hover:text-red-500 transition" aria-label="Supprimer">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <input className={inputCls} value={exp.period} onChange={(e) => arrayOps.patch('experiences', exp.id, 'period', e.target.value)} placeholder="Période (ex: 2021 — Present)" />
              <textarea className={`${inputCls} resize-none`} rows={2} value={exp.description} onChange={(e) => arrayOps.patch('experiences', exp.id, 'description', e.target.value)} placeholder="Description des missions et résultats" />
            </div>
          ))}
        </div>
      </section>

      {/* Education */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <span className="w-1 h-4 bg-slate-900 rounded-full" /> Formation
          </h3>
          <button
            onClick={() => arrayOps.add('education', { id: uid(), degree: '', school: '', period: '', description: '' } as Education)}
            className="text-xs font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Ajouter
          </button>
        </div>
        <div className="space-y-3">
          {data.education.map((ed) => (
            <div key={ed.id} className="rounded-xl border border-slate-200 p-3 space-y-2 bg-slate-50/60">
              <div className="flex items-start justify-between gap-2">
                <GripVertical className="w-4 h-4 text-slate-300 mt-2 shrink-0" />
                <div className="flex-1 grid grid-cols-2 gap-2">
                  <input className={inputCls} value={ed.degree} onChange={(e) => arrayOps.patch('education', ed.id, 'degree', e.target.value)} placeholder="Diplôme" />
                  <input className={inputCls} value={ed.school} onChange={(e) => arrayOps.patch('education', ed.id, 'school', e.target.value)} placeholder="Établissement" />
                </div>
                <button onClick={() => arrayOps.remove('education', ed.id)} className="mt-2 text-slate-400 hover:text-red-500 transition" aria-label="Supprimer">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <input className={inputCls} value={ed.period} onChange={(e) => arrayOps.patch('education', ed.id, 'period', e.target.value)} placeholder="Période" />
              <textarea className={`${inputCls} resize-none`} rows={2} value={ed.description} onChange={(e) => arrayOps.patch('education', ed.id, 'description', e.target.value)} placeholder="Description (optionnelle)" />
            </div>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <span className="w-1 h-4 bg-slate-900 rounded-full" /> Projets
          </h3>
          <button
            onClick={() => arrayOps.add('projects', { id: uid(), name: '', url: '', description: '' } as Project)}
            className="text-xs font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Ajouter
          </button>
        </div>
        <div className="space-y-3">
          {data.projects.map((p) => (
            <div key={p.id} className="rounded-xl border border-slate-200 p-3 space-y-2 bg-slate-50/60">
              <div className="flex items-start justify-between gap-2">
                <GripVertical className="w-4 h-4 text-slate-300 mt-2 shrink-0" />
                <div className="flex-1 grid grid-cols-2 gap-2">
                  <input className={inputCls} value={p.name} onChange={(e) => arrayOps.patch('projects', p.id, 'name', e.target.value)} placeholder="Nom du projet" />
                  <input className={inputCls} value={p.url} onChange={(e) => arrayOps.patch('projects', p.id, 'url', e.target.value)} placeholder="URL" />
                </div>
                <button onClick={() => arrayOps.remove('projects', p.id)} className="mt-2 text-slate-400 hover:text-red-500 transition" aria-label="Supprimer">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <textarea className={`${inputCls} resize-none`} rows={2} value={p.description} onChange={(e) => arrayOps.patch('projects', p.id, 'description', e.target.value)} placeholder="Description du projet" />
            </div>
          ))}
        </div>
      </section>

      {/* Interests */}
      <section className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <span className="w-1 h-4 bg-slate-900 rounded-full" /> Centres d'intérêt
        </h3>
        <div className="flex flex-wrap gap-2">
          {data.interests.map((it, i) => (
            <span key={i} className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 border border-slate-200 pl-3 pr-1.5 py-1 text-xs font-medium text-slate-700">
              {it}
              <button
                onClick={() => update('interests', data.interests.filter((_, idx) => idx !== i))}
                className="rounded-full p-0.5 hover:bg-slate-300 transition text-slate-500"
                aria-label="Supprimer"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const v = (e.currentTarget.elements.namedItem('interest') as HTMLInputElement).value.trim();
            if (v && !data.interests.includes(v)) update('interests', [...data.interests, v]);
            (e.currentTarget.elements.namedItem('interest') as HTMLInputElement).value = '';
          }}
          className="flex gap-2"
        >
          <input name="interest" className={inputCls} placeholder="Ajouter (ex: Photographie)" />
          <button type="submit" className="shrink-0 rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700 transition flex items-center gap-1">
            <Plus className="w-4 h-4" /> Ajouter
          </button>
        </form>
      </section>
    </div>
  );
}
