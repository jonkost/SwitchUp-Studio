import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js';
import { getAnalytics, isSupported as analyticsIsSupported } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-analytics.js';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';
import { getDownloadURL, getStorage, ref } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-storage.js';

const firebaseConfig = {
  apiKey: 'AIzaSyAbmeQPd4wSL7rD7e3hmtyP_PflgfpnyrM',
  authDomain: 'switchup-studio.firebaseapp.com',
  projectId: 'switchup-studio',
  storageBucket: 'switchup-studio.firebasestorage.app',
  messagingSenderId: '82976418005',
  appId: '1:82976418005:web:ff5aa57dd1535b3be11a5c',
  measurementId: 'G-ZSP1CZ9VJ7',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

const analyticsPromise = analyticsIsSupported()
  .then((supported) => (supported ? getAnalytics(app) : null))
  .catch(() => null);

async function sha256(value) {
  const bytes = new TextEncoder().encode(String(value || '').trim().toUpperCase());
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

async function getContentItem(collectionName, referenceId) {
  if (!collectionName || !referenceId) return null;
  const snapshot = await getDoc(doc(db, collectionName, referenceId));
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
}

async function getContentCollection(collectionName) {
  if (!collectionName) return [];
  const snapshot = await getDocs(collection(db, collectionName));
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}

function getCollectionForContentItem(item) {
  if (!item) return '';
  if (item.collectionName) return item.collectionName;
  if (item.group === 'lesson') return 'content_lessons';
  if (item.group === 'quiz') return 'content_quiz_bank';
  if (item.group === 'rts') return 'content_run_the_show';
  return '';
}

async function saveContentItem(item) {
  const collectionName = getCollectionForContentItem(item);
  if (!collectionName || !item.refId) throw new Error('Content item needs collectionName/refId.');
  const payload = {
    refId: item.refId,
    text: item.text || '',
    type: item.type || 'Prompt',
    group: item.group || '',
    section: item.section || '',
    updatedAt: serverTimestamp(),
  };
  await setDoc(doc(db, collectionName, item.refId), payload, { merge: true });
  return payload;
}

async function saveContentItems(items) {
  const results = [];
  for (const item of items) {
    results.push(await saveContentItem(item));
  }
  return results;
}

function normalizeAdminLevel(level) {
  if (level === 'super' || level === 'super_admin') return 'super';
  if (level === 'full' || level === 'full_access') return 'full';
  return 'standard';
}

function adminDocId(value) {
  return String(value || `adm_${Date.now().toString(36)}`)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '') || `adm_${Date.now().toString(36)}`;
}

async function createAdminAccount({ id = '', name = '', email = '', code = '', level = 'standard' }) {
  const cleanName = String(name || '').trim();
  const cleanCode = String(code || '').trim();
  if (!cleanName) throw new Error('Admin name is required.');
  if (cleanCode.length < 4) throw new Error('Use at least 4 characters for an admin code.');
  const cleanId = adminDocId(id || cleanName);
  const cleanLevel = normalizeAdminLevel(level);
  const payload = {
    id: cleanId,
    uid: cleanId,
    name: cleanName,
    email: String(email || '').trim(),
    displayName: cleanName,
    codeHash: await sha256(cleanCode),
    level: cleanLevel,
    role: cleanLevel === 'super' ? 'super_admin' : 'admin',
    createdBy: 'dashboard',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  await setDoc(doc(db, 'admins', cleanId), payload, { merge: true });
  return payload;
}

async function updateAdminAccount(id, updates = {}) {
  const cleanId = String(id || '').trim();
  if (!cleanId) throw new Error('Admin ID is required.');
  const payload = {
    updatedAt: serverTimestamp(),
  };
  if (updates.level || updates.role) {
    payload.level = normalizeAdminLevel(updates.level || updates.role);
    payload.role = payload.level === 'super' ? 'super_admin' : 'admin';
  }
  if (updates.name !== undefined) {
    payload.name = String(updates.name || '').trim();
    payload.displayName = payload.name;
  }
  if (updates.email !== undefined) payload.email = String(updates.email || '').trim();
  if (updates.code) payload.codeHash = await sha256(updates.code);
  await updateDoc(doc(db, 'admins', cleanId), payload);
  return payload;
}

async function deleteAdminAccount(id) {
  const cleanId = String(id || '').trim();
  if (!cleanId) throw new Error('Admin ID is required.');
  await deleteDoc(doc(db, 'admins', cleanId));
}

async function getAdmins() {
  const snapshot = await getDocs(collection(db, 'admins'));
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}

async function saveQuizSubmission(summary) {
  if (!summary || !summary.confirmation_code) throw new Error('Quiz submission needs a confirmation code.');
  const payload = {
    result_type: 'quiz',
    ...summary,
    createdAt: serverTimestamp(),
  };
  await setDoc(doc(db, 'quiz_submissions', summary.confirmation_code), payload, { merge: true });
  return payload;
}

async function saveLessonSubmission(summary) {
  if (!summary || !summary.confirmation_code) throw new Error('Lesson submission needs a confirmation code.');
  const payload = {
    result_type: 'lesson',
    ...summary,
    createdAt: serverTimestamp(),
  };
  await setDoc(doc(db, 'lesson_submissions', summary.confirmation_code), payload, { merge: true });
  return payload;
}

async function getQuizSubmissions(maxCount = 100) {
  const submissionQuery = query(
    collection(db, 'quiz_submissions'),
    orderBy('createdAt', 'desc'),
    limit(maxCount)
  );
  const snapshot = await getDocs(submissionQuery);
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}

async function getLessonSubmissions(maxCount = 100) {
  const submissionQuery = query(
    collection(db, 'lesson_submissions'),
    orderBy('createdAt', 'desc'),
    limit(maxCount)
  );
  const snapshot = await getDocs(submissionQuery);
  return snapshot.docs.map((item) => ({ id: item.id, result_type: 'lesson', ...item.data() }));
}

function submissionTimeMs(item) {
  const value = item && (item.createdAt || item.date);
  if (!value) return 0;
  if (typeof value.toDate === 'function') return value.toDate().getTime();
  if (typeof value === 'string') return Date.parse(value) || 0;
  if (value.seconds) return value.seconds * 1000;
  return 0;
}

async function getStudentResults(maxCount = 100) {
  const results = await Promise.allSettled([
    getQuizSubmissions(maxCount),
    getLessonSubmissions(maxCount),
  ]);
  const fulfilledResults = results.filter((result) => result.status === 'fulfilled');
  const successfulResults = results
    .filter((result) => result.status === 'fulfilled')
    .flatMap((result) => result.value);
  if (!fulfilledResults.length && results.some((result) => result.status === 'rejected')) {
    throw results.find((result) => result.status === 'rejected').reason;
  }
  return successfulResults
    .sort((a, b) => submissionTimeMs(b) - submissionTimeMs(a))
    .slice(0, maxCount);
}

async function getNarration(referenceId, voice, rate, textHash) {
  const pieces = [referenceId, voice, rate, textHash].filter(Boolean);
  if (!pieces.length) return null;
  const narrationId = pieces.join('_').replace(/[^\w.-]+/g, '-');
  const snapshot = await getDoc(doc(db, 'narration', narrationId));
  if (!snapshot.exists()) return null;

  const data = { id: snapshot.id, ...snapshot.data() };
  if (data.storagePath && !data.audioUrl) {
    data.audioUrl = await getDownloadURL(ref(storage, data.storagePath));
  }
  return data;
}

window.SwitchUpFirebase = {
  app,
  db,
  storage,
  analyticsPromise,
  getContentItem,
  getContentCollection,
  saveContentItem,
  saveContentItems,
  createAdminAccount,
  updateAdminAccount,
  deleteAdminAccount,
  getAdmins,
  hashAdminCode: sha256,
  saveQuizSubmission,
  saveLessonSubmission,
  getQuizSubmissions,
  getLessonSubmissions,
  getStudentResults,
  getNarration,
};

window.dispatchEvent(new CustomEvent('switchup:firebase-ready', {
  detail: window.SwitchUpFirebase,
}));
