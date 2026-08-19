import type { CVData, TemplateId } from '@/types/types';

const DB_NAME = 'CVGen';
const DB_VERSION = 1;
const STORE_NAME = 'cvs';

const MAX_IMPORT_SIZE = 10 * 1024 * 1024; // 10 MB

export interface SavedCV {
  id: string;
  name: string;
  data: CVData;
  template: TemplateId;
  createdAt: number;
  updatedAt: number;
}

interface CVGenFile {
  format: 'cvgen';
  version: 1;
  exportedAt: string;
  cv: {
    name: string;
    data: CVData;
    template: TemplateId;
  };
}

/**
 * ---------------------------------------------------------
 * IndexedDB
 * ---------------------------------------------------------
 */

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) {
      reject(
        new Error(
          'IndexedDB n’est pas disponible dans ce navigateur.'
        )
      );
      return;
    }

    const request = indexedDB.open(
      DB_NAME,
      DB_VERSION
    );

    request.onerror = () => {
      reject(
        request.error ??
          new Error(
            'Impossible d’ouvrir IndexedDB.'
          )
      );
    };

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(
          STORE_NAME,
          { keyPath: 'id' }
        );

        store.createIndex(
          'updatedAt',
          'updatedAt',
          { unique: false }
        );
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };
  });
}

/**
 * Sauvegarde un CV dans IndexedDB.
 */
export async function saveCV(
  cv: SavedCV
): Promise<void> {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(
      STORE_NAME,
      'readwrite'
    );

    const store =
      transaction.objectStore(STORE_NAME);

    store.put(cv);

    transaction.oncomplete = () => {
      db.close();
      resolve();
    };

    transaction.onerror = () => {
      db.close();

      reject(
        transaction.error ??
          new Error(
            'Impossible de sauvegarder le CV.'
          )
      );
    };
  });
}

/**
 * Récupère tous les CV.
 */
export async function getAllCVs(): Promise<
  SavedCV[]
> {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(
      STORE_NAME,
      'readonly'
    );

    const store =
      transaction.objectStore(STORE_NAME);

    const request = store.getAll();

    request.onsuccess = () => {
      db.close();

      const cvs =
        (request.result as SavedCV[]) || [];

      cvs.sort(
        (a, b) =>
          b.updatedAt - a.updatedAt
      );

      resolve(cvs);
    };

    request.onerror = () => {
      db.close();

      reject(
        request.error ??
          new Error(
            'Impossible de récupérer les CV.'
          )
      );
    };
  });
}

/**
 * Récupère un CV par son ID.
 */
export async function getCV(
  id: string
): Promise<SavedCV | null> {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(
      STORE_NAME,
      'readonly'
    );

    const store =
      transaction.objectStore(STORE_NAME);

    const request = store.get(id);

    request.onsuccess = () => {
      db.close();

      resolve(
        (request.result as SavedCV) ??
          null
      );
    };

    request.onerror = () => {
      db.close();

      reject(
        request.error ??
          new Error(
            'Impossible de récupérer le CV.'
          )
      );
    };
  });
}

/**
 * Supprime un CV.
 */
export async function deleteCV(
  id: string
): Promise<void> {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(
      STORE_NAME,
      'readwrite'
    );

    const store =
      transaction.objectStore(STORE_NAME);

    store.delete(id);

    transaction.oncomplete = () => {
      db.close();
      resolve();
    };

    transaction.onerror = () => {
      db.close();

      reject(
        transaction.error ??
          new Error(
            'Impossible de supprimer le CV.'
          )
      );
    };
  });
}

/**
 * Génère un ID local.
 */
export function createCVId(): string {
  if (
    typeof crypto !== 'undefined' &&
    'randomUUID' in crypto
  ) {
    return crypto.randomUUID();
  }

  return (
    Date.now().toString(36) +
    Math.random()
      .toString(36)
      .slice(2)
  );
}

/**
 * ---------------------------------------------------------
 * CVGEN
 * ---------------------------------------------------------
 */

/**
 * Prépare le contenu du fichier .cvgen.
 *
 * Le fichier est du JSON avec une extension .cvgen.
 * Il ne contient aucun script exécutable.
 */
export function createCVGenFile(
  cv: SavedCV
): CVGenFile {
  return {
    format: 'cvgen',
    version: 1,
    exportedAt:
      new Date().toISOString(),
    cv: {
      name: cv.name,
      data: cv.data,
      template: cv.template,
    },
  };
}

/**
 * Télécharge un CV sous forme de fichier .cvgen.
 */
export function downloadCVGen(
  cv: SavedCV
): void {
  const file =
    createCVGenFile(cv);

  const json = JSON.stringify(
    file,
    null,
    2
  );

  const blob = new Blob(
    [json],
    {
      type: 'application/json',
    }
  );

  const url =
    URL.createObjectURL(blob);

  const link =
    document.createElement('a');

  link.href = url;

  link.download =
    `${sanitizeFilename(
      cv.name || 'CV'
    )}.cvgen`;

  document.body.appendChild(link);

  link.click();

  link.remove();

  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);
}

/**
 * Lit et valide un fichier .cvgen.
 *
 * Important :
 * On ne fait JAMAIS exécuter le contenu du fichier.
 * Les données sont uniquement réinjectées dans React.
 */
export async function importCVGen(
  file: File
): Promise<{
  name: string;
  data: CVData;
  template: TemplateId;
}> {
  if (file.size > MAX_IMPORT_SIZE) {
    throw new Error(
      'Le fichier est trop volumineux.'
    );
  }

  const text =
    await file.text();

  let parsed: unknown;

  try {
    parsed =
      JSON.parse(text);
  } catch {
    throw new Error(
      'Le fichier .cvgen est invalide ou corrompu.'
    );
  }

  if (
    !isRecord(parsed) ||
    parsed.format !== 'cvgen' ||
    parsed.version !== 1 ||
    !isRecord(parsed.cv)
  ) {
    throw new Error(
      'Ce fichier n’est pas un fichier CVGen valide.'
    );
  }

  const cv =
    parsed.cv;

  if (
    typeof cv.name !== 'string' ||
    !isCVData(cv.data) ||
    !isTemplateId(cv.template)
  ) {
    throw new Error(
      'Les données du CV sont invalides.'
    );
  }

  return {
    name: cv.name,
    data: cv.data,
    template: cv.template,
  };
}

/**
 * ---------------------------------------------------------
 * Validation
 * ---------------------------------------------------------
 */

function isRecord(
  value: unknown
): value is Record<string, unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value)
  );
}

function isTemplateId(
  value: unknown
): value is TemplateId {
  return (
    value === 'modern' ||
    value === 'classic' ||
    value === 'minimal'
  );
}

/**
 * Validation volontairement stricte sur la structure
 * principale du CV.
 *
 * On accepte les propriétés supplémentaires afin de ne pas
 * casser une future évolution de CVData.
 */
function isCVData(
  value: unknown
): value is CVData {
  if (!isRecord(value)) {
    return false;
  }

  if (
    typeof value.name !== 'string' ||
    typeof value.title !== 'string'
  ) {
    return false;
  }

  if (
    !Array.isArray(value.experiences) ||
    !Array.isArray(value.education) ||
    !Array.isArray(value.skills) ||
    !Array.isArray(value.projects) ||
    !Array.isArray(value.interests)
  ) {
    return false;
  }

  if (
    value.photo !== undefined &&
    value.photo !== null &&
    typeof value.photo !== 'string'
  ) {
    return false;
  }

  return true;
}

/**
 * Nettoie un nom de fichier.
 */
function sanitizeFilename(
  value: string
): string {
  const cleaned =
    value
      .trim()
      .replace(
        /[<>:"/\\|?*\x00-\x1F]/g,
        ''
      )
      .replace(/\s+/g, ' ');

  return (
    cleaned.slice(0, 100) ||
    'CV'
  );
}