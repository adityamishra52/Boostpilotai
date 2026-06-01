export const GUEST_ANALYSIS_DRAFT_KEY = "boostpilot_guest_analysis_draft";

const DB_NAME = "boostpilot_guest_analysis_drafts";
const STORE_NAME = "drafts";

const supportsIndexedDb = () => typeof window !== "undefined" && Boolean(window.indexedDB);

const openDraftDb = () =>
  new Promise((resolve, reject) => {
    if (!supportsIndexedDb()) {
      reject(new Error("IndexedDB is not supported."));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "key" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error("Could not open draft storage."));
  });

const withDraftStore = async (mode, callback) => {
  const db = await openDraftDb();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, mode);
    const store = transaction.objectStore(STORE_NAME);
    const result = callback(store);

    transaction.oncomplete = () => {
      db.close();
      resolve(result);
    };
    transaction.onerror = () => {
      db.close();
      reject(transaction.error || new Error("Draft storage failed."));
    };
  });
};

export const saveGuestAnalysisDraft = async (draft) => {
  const timestamp = Date.now();
  const metadata = {
    key: GUEST_ANALYSIS_DRAFT_KEY,
    fileMetadata: draft.file
      ? {
          name: draft.file.name,
          size: draft.file.size,
          type: draft.file.type,
          lastModified: draft.file.lastModified
        }
      : null,
    platform: draft.platform,
    contentType: draft.contentType,
    selectedOptions: draft.selectedOptions || {},
    formState: draft.formState || {},
    timestamp,
    fileSaved: false
  };

  if (draft.file && supportsIndexedDb()) {
    try {
      await withDraftStore("readwrite", (store) =>
        store.put({
          ...metadata,
          file: draft.file,
          fileSaved: true
        })
      );
      localStorage.setItem(GUEST_ANALYSIS_DRAFT_KEY, JSON.stringify({ ...metadata, fileSaved: true }));
      return { ...metadata, fileSaved: true };
    } catch {
      localStorage.setItem(GUEST_ANALYSIS_DRAFT_KEY, JSON.stringify(metadata));
      return metadata;
    }
  }

  localStorage.setItem(GUEST_ANALYSIS_DRAFT_KEY, JSON.stringify(metadata));
  return metadata;
};

export const getGuestAnalysisDraft = async () => {
  const stored = localStorage.getItem(GUEST_ANALYSIS_DRAFT_KEY);

  if (!stored) {
    return null;
  }

  let metadata;
  try {
    metadata = JSON.parse(stored);
  } catch {
    return null;
  }

  if (!supportsIndexedDb()) {
    return metadata;
  }

  try {
    const record = await new Promise((resolve, reject) => {
      openDraftDb()
        .then((db) => {
          const transaction = db.transaction(STORE_NAME, "readonly");
          const store = transaction.objectStore(STORE_NAME);
          const request = store.get(GUEST_ANALYSIS_DRAFT_KEY);

          request.onsuccess = () => resolve(request.result || null);
          request.onerror = () => reject(request.error);
          transaction.oncomplete = () => db.close();
          transaction.onerror = () => db.close();
        })
        .catch(reject);
    });

    return record ? { ...metadata, ...record } : metadata;
  } catch {
    return metadata;
  }
};

export const clearGuestAnalysisDraft = async () => {
  localStorage.removeItem(GUEST_ANALYSIS_DRAFT_KEY);

  if (!supportsIndexedDb()) {
    return;
  }

  try {
    await withDraftStore("readwrite", (store) => store.delete(GUEST_ANALYSIS_DRAFT_KEY));
  } catch {
    // Local metadata is already cleared; stale blob cleanup can wait for a future write.
  }
};
