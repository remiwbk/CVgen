import type {
  CVData,
  CVStyle,
  TemplateId,
  CVSectionId,
  CVSectionColumn,
} from '@/types/types';

export interface SavedCV {
  id: string;
  name: string;
  data: CVData;
  template: TemplateId;
  createdAt: number;
  updatedAt: number;
}

interface CVGenFile {
  version?: number;
  name?: string;
  data?: unknown;
  template?: unknown;
}

const DB_NAME = 'cv-studio-db';
const DB_VERSION = 1;
const STORE_NAME = 'cvs';

const VALID_TEMPLATES: TemplateId[] = [
  'modern',
  'classic',
  'minimal',
  'corporate',
  'editorial',
  'executive',
  'swiss',
  'tech',
];

const VALID_SECTION_IDS: CVSectionId[] = [
  'summary',
  'skills',
  'experiences',
  'education',
  'projects',
  'interests',
];

const VALID_SECTION_COLUMNS: CVSectionColumn[] = [
  'left',
  'right',
];

const DEFAULT_SECTION_ORDER: CVSectionId[] = [
  'summary',
  'experiences',
  'education',
  'skills',
  'projects',
  'interests',
];

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

const defaultStyle: CVStyle = {
  fontScale: 1,
  fontFamily: 'inter',
  primary: '',
  secondary: '',
  accent: '',
  text: '',
  muted: '',
  surface: '',
  border: '',
};

/* =========================================================
   INDEXED DB
========================================================= */

function openDB(): Promise<IDBDatabase> {
  return new Promise(
    (resolve, reject) => {
      const request =
        indexedDB.open(
          DB_NAME,
          DB_VERSION
        );

      request.onupgradeneeded =
        () => {
          const db =
            request.result;

          if (
            !db.objectStoreNames.contains(
              STORE_NAME
            )
          ) {
            db.createObjectStore(
              STORE_NAME,
              {
                keyPath: 'id',
              }
            );
          }
        };

      request.onsuccess = () => {
        resolve(
          request.result
        );
      };

      request.onerror = () => {
        reject(
          request.error ??
            new Error(
              'Impossible d’ouvrir IndexedDB.'
            )
        );
      };
    }
  );
}

/* =========================================================
   UTILITAIRES
========================================================= */

export function createCVId(): string {
  return `cv_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}

function isObject(
  value: unknown
): value is Record<string, unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value)
  );
}

function stringValue(
  value: unknown,
  fallback = ''
): string {
  return typeof value === 'string'
    ? value
    : fallback;
}

function stringArray(
  value: unknown
): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(
    (item): item is string =>
      typeof item === 'string'
  );
}

/* =========================================================
   NORMALISATION STYLE
========================================================= */

function normalizeStyle(
  value: unknown
): CVStyle {
  if (!isObject(value)) {
    return {
      ...defaultStyle,
    };
  }

  const fontScale =
    typeof value.fontScale ===
      'number' &&
    Number.isFinite(
      value.fontScale
    )
      ? Math.min(
          1.3,
          Math.max(
            0.8,
            value.fontScale
          )
        )
      : 1;

  return {
    fontScale,

    fontFamily:
      stringValue(
        value.fontFamily,
        'inter'
      ),

    primary:
      stringValue(
        value.primary
      ),

    secondary:
      stringValue(
        value.secondary
      ),

    accent:
      stringValue(
        value.accent
      ),

    text:
      stringValue(
        value.text
      ),

    muted:
      stringValue(
        value.muted
      ),

    surface:
      stringValue(
        value.surface
      ),

    border:
      stringValue(
        value.border
      ),
  };
}

/* =========================================================
   NORMALISATION SECTION ORDER
========================================================= */

function normalizeSectionOrder(
  value: unknown
): CVSectionId[] {
  if (!Array.isArray(value)) {
    return [
      ...DEFAULT_SECTION_ORDER,
    ];
  }

  const valid =
    value.filter(
      (
        section
      ): section is CVSectionId =>
        typeof section ===
          'string' &&
        VALID_SECTION_IDS.includes(
          section as CVSectionId
        )
    );

  /*
   * On supprime les doublons.
   */
  const unique =
    Array.from(
      new Set(valid)
    );

  /*
   * On ajoute les sections absentes
   * à la fin afin de garantir une liste
   * complète et exploitable.
   */
  for (
    const sectionId of
      DEFAULT_SECTION_ORDER
  ) {
    if (
      !unique.includes(
        sectionId
      )
    ) {
      unique.push(
        sectionId
      );
    }
  }

  return unique;
}

/* =========================================================
   NORMALISATION SECTION COLUMNS
========================================================= */

function normalizeSectionColumns(
  value: unknown
): Partial<
  Record<
    CVSectionId,
    CVSectionColumn
  >
> {
  const result: Partial<
    Record<
      CVSectionId,
      CVSectionColumn
    >
  > = {};

  /*
   * Pas de sectionColumns :
   * on considère qu'il s'agit d'un ancien CV.
   *
   * On ne stocke rien explicitement puisque
   * les templates peuvent utiliser leur layout
   * par défaut.
   */
  if (!isObject(value)) {
    return result;
  }

  for (
    const sectionId of
      VALID_SECTION_IDS
  ) {
    const rawColumn =
      value[sectionId];

    if (
      typeof rawColumn ===
        'string' &&
      VALID_SECTION_COLUMNS.includes(
        rawColumn as CVSectionColumn
      )
    ) {
      result[sectionId] =
        rawColumn as CVSectionColumn;
    }
  }

  return result;
}

/* =========================================================
   NORMALISATION SKILLS
========================================================= */

function normalizeSkills(
  value: unknown
) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(isObject)
    .map(
      (category, index) => ({
        id:
          stringValue(
            category.id
          ) ||
          `skill_${index}`,

        name:
          stringValue(
            category.name
          ),

        items:
          stringArray(
            category.items
          ),
      })
    );
}

/* =========================================================
   NORMALISATION EXPERIENCES
========================================================= */

function normalizeExperiences(
  value: unknown
) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(isObject)
    .map(
      (
        experience,
        index
      ) => ({
        id:
          stringValue(
            experience.id
          ) ||
          `experience_${index}`,

        role:
          stringValue(
            experience.role
          ),

        company:
          stringValue(
            experience.company
          ),

        period:
          stringValue(
            experience.period
          ),

        description:
          stringValue(
            experience.description
          ),
      })
    );
}

/* =========================================================
   NORMALISATION FORMATION
========================================================= */

function normalizeEducation(
  value: unknown
) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(isObject)
    .map(
      (
        education,
        index
      ) => ({
        id:
          stringValue(
            education.id
          ) ||
          `education_${index}`,

        degree:
          stringValue(
            education.degree
          ),

        school:
          stringValue(
            education.school
          ),

        period:
          stringValue(
            education.period
          ),

        description:
          stringValue(
            education.description
          ),
      })
    );
}

/* =========================================================
   NORMALISATION PROJETS
========================================================= */

function normalizeProjects(
  value: unknown
) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(isObject)
    .map(
      (project, index) => ({
        id:
          stringValue(
            project.id
          ) ||
          `project_${index}`,

        name:
          stringValue(
            project.name
          ),

        url:
          stringValue(
            project.url
          ),

        description:
          stringValue(
            project.description
          ),
      })
    );
}

/* =========================================================
   NORMALISATION CV
========================================================= */

function normalizeCVData(
  value: unknown
): CVData {
  if (!isObject(value)) {
    throw new Error(
      'Les données du CV sont invalides.'
    );
  }

  const sectionOrder =
    normalizeSectionOrder(
      value.sectionOrder
    );

  const sectionColumns =
    normalizeSectionColumns(
      value.sectionColumns
    );

  const result: CVData = {
    name:
      stringValue(
        value.name
      ),

    title:
      stringValue(
        value.title
      ),

    email:
      stringValue(
        value.email
      ),

    phone:
      stringValue(
        value.phone
      ),

    location:
      stringValue(
        value.location
      ),

    website:
      stringValue(
        value.website
      ),

    linkedin:
      stringValue(
        value.linkedin
      ),

    github:
      stringValue(
        value.github
      ),

    photo:
      stringValue(
        value.photo
      ),

    photoScale:
      typeof value.photoScale ===
          'number' &&
      Number.isFinite(
        value.photoScale
      )
        ? value.photoScale
        : 1,

    birthDate:
      typeof value.birthDate ===
        'string'
        ? value.birthDate
        : undefined,

    hasDrivingLicense:
      typeof value.hasDrivingLicense ===
        'boolean'
        ? value.hasDrivingLicense
        : false,

    summary:
      stringValue(
        value.summary
      ),

    skills:
      normalizeSkills(
        value.skills
      ),

    experiences:
      normalizeExperiences(
        value.experiences
      ),

    education:
      normalizeEducation(
        value.education
      ),

    projects:
      normalizeProjects(
        value.projects
      ),

    interests:
      stringArray(
        value.interests
      ),

    style:
      normalizeStyle(
        value.style
      ),

    sectionOrder,

    sectionColumns,
  };

  return result;
}

/* =========================================================
   TEMPLATE
========================================================= */

function normalizeTemplate(
  value: unknown
): TemplateId {
  if (
    typeof value === 'string' &&
    VALID_TEMPLATES.includes(
      value as TemplateId
    )
  ) {
    return value as TemplateId;
  }

  return 'modern';
}

/* =========================================================
   SAVE
========================================================= */

export async function saveCV(
  cv: SavedCV
): Promise<void> {
  const db =
    await openDB();

  return new Promise(
    (
      resolve,
      reject
    ) => {
      const transaction =
        db.transaction(
          STORE_NAME,
          'readwrite'
        );

      const store =
        transaction.objectStore(
          STORE_NAME
        );

      store.put(cv);

      transaction.oncomplete =
        () => {
          db.close();

          resolve();
        };

      transaction.onerror =
        () => {
          db.close();

          reject(
            transaction.error ??
              new Error(
                'Impossible de sauvegarder le CV.'
              )
          );
        };
    }
  );
}

/* =========================================================
   GET ALL
========================================================= */

export async function getAllCVs(): Promise<
  SavedCV[]
> {
  const db =
    await openDB();

  return new Promise(
    (
      resolve,
      reject
    ) => {
      const transaction =
        db.transaction(
          STORE_NAME,
          'readonly'
        );

      const store =
        transaction.objectStore(
          STORE_NAME
        );

      const request =
        store.getAll();

      request.onsuccess =
        () => {
          db.close();

          const cvs =
            Array.isArray(
              request.result
            )
              ? request.result
              : [];

          cvs.sort(
            (
              a,
              b
            ) =>
              b.updatedAt -
              a.updatedAt
          );

          resolve(cvs);
        };

      request.onerror =
        () => {
          db.close();

          reject(
            request.error ??
              new Error(
                'Impossible de récupérer les CV.'
              )
          );
        };
    }
  );
}

/* =========================================================
   DELETE
========================================================= */

export async function deleteCV(
  id: string
): Promise<void> {
  const db =
    await openDB();

  return new Promise(
    (
      resolve,
      reject
    ) => {
      const transaction =
        db.transaction(
          STORE_NAME,
          'readwrite'
        );

      const store =
        transaction.objectStore(
          STORE_NAME
        );

      store.delete(id);

      transaction.oncomplete =
        () => {
          db.close();

          resolve();
        };

      transaction.onerror =
        () => {
          db.close();

          reject(
            transaction.error ??
              new Error(
                'Impossible de supprimer le CV.'
              )
          );
        };
    }
  );
}

/* =========================================================
   EXPORT .CVGEN
========================================================= */

export function downloadCVGen(
  cv: SavedCV
): void {
  const payload = {
    /*
     * Version 3 :
     *
     * - sectionOrder
     * - sectionColumns
     * - birthDate
     * - hasDrivingLicense
     * - style
     * - etc.
     *
     * sont déjà présents dans cv.data.
     */
    version: 3,

    name:
      cv.name,

    template:
      cv.template,

    data:
      cv.data,
  };

  const json =
    JSON.stringify(
      payload,
      null,
      2
    );

  const blob =
    new Blob(
      [json],
      {
        type:
          'application/json',
      }
    );

  const url =
    URL.createObjectURL(
      blob
    );

  const link =
    document.createElement(
      'a'
    );

  link.href =
    url;

  link.download =
    `${sanitizeFilename(
      cv.name ||
        'mon-cv'
    )}.cvgen`;

  document.body.appendChild(
    link
  );

  link.click();

  link.remove();

  setTimeout(() => {
    URL.revokeObjectURL(
      url
    );
  }, 1000);
}

/* =========================================================
   IMPORT .CVGEN
========================================================= */

export async function importCVGen(
  file: File
): Promise<{
  name: string;
  template: TemplateId;
  data: CVData;
}> {
  if (!file) {
    throw new Error(
      'Aucun fichier sélectionné.'
    );
  }

  let text: string;

  try {
    text =
      await file.text();
  } catch {
    throw new Error(
      'Impossible de lire le fichier .cvgen.'
    );
  }

  let parsed: unknown;

  try {
    parsed =
      JSON.parse(text);
  } catch {
    throw new Error(
      'Le fichier .cvgen contient un JSON invalide.'
    );
  }

  if (!isObject(parsed)) {
    throw new Error(
      'Le fichier .cvgen est invalide.'
    );
  }

  const fileData =
    parsed as CVGenFile;

  /*
   * Format normal :
   *
   * {
   *   version,
   *   name,
   *   template,
   *   data
   * }
   *
   * Compatibilité :
   * si data n'existe pas, on accepte
   * directement l'objet racine.
   */

  let rawData =
    fileData.data;

  if (
    !rawData ||
    !isObject(rawData)
  ) {
    rawData =
      parsed;
  }

  /*
   * Cas où template est stocké
   * dans les données du CV.
   */

  const rawDataObject =
    isObject(rawData)
      ? rawData
      : null;

  const template =
    normalizeTemplate(
      fileData.template ??
        rawDataObject?.template
    );

  const data =
    normalizeCVData(
      rawData
    );

  const name =
    stringValue(
      fileData.name,
      data.name ||
        'CV importé'
    );

  return {
    name:
      name ||
      'CV importé',

    template,

    data,
  };
}

/* =========================================================
   FILENAME
========================================================= */

function sanitizeFilename(
  value: string
): string {
  return value
    .normalize('NFD')
    .replace(
      /[\u0300-\u036f]/g,
      ''
    )
    .replace(
      /[^a-zA-Z0-9-_ ]/g,
      ''
    )
    .trim()
    .replace(
      /\s+/g,
      '-'
    )
    .slice(
      0,
      100
    ) ||
    'mon-cv';
}