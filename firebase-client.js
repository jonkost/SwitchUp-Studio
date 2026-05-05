import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js';
import { getAnalytics, isSupported as analyticsIsSupported } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-analytics.js';
import {
  GoogleAuthProvider,
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js';
import {
  collection,
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
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const analyticsPromise = analyticsIsSupported()
  .then((supported) => (supported ? getAnalytics(app) : null))
  .catch(() => null);

function currentUser() {
  return auth.currentUser;
}

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

async function getAdminProfile(uid) {
  if (!uid) return null;
  const snapshot = await getDoc(doc(db, 'admins', uid));
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
}

async function createAdminInvite(code) {
  const user = currentUser();
  if (!user) throw new Error('Sign in before creating an invite code.');
  const trimmedCode = String(code || '').trim();
  if (trimmedCode.length < 6) throw new Error('Use at least 6 characters for an admin code.');
  const inviteHash = await sha256(trimmedCode);
  const payload = {
    inviteHash,
    role: 'admin',
    active: true,
    createdBy: user.uid,
    createdByEmail: user.email || '',
    createdAt: serverTimestamp(),
    usedBy: '',
    usedByEmail: '',
  };
  await setDoc(doc(db, 'admin_invites', inviteHash), payload, { merge: true });
  return payload;
}

async function redeemAdminInvite(code) {
  const user = currentUser();
  if (!user) throw new Error('Sign in before redeeming an admin code.');
  const inviteHash = await sha256(code);
  const inviteRef = doc(db, 'admin_invites', inviteHash);
  const inviteSnapshot = await getDoc(inviteRef);
  if (!inviteSnapshot.exists()) throw new Error('That admin code was not found.');
  const invite = inviteSnapshot.data();
  if (!invite.active || invite.usedBy) throw new Error('That admin code has already been used.');
  const adminPayload = {
    uid: user.uid,
    email: user.email || '',
    displayName: user.displayName || '',
    role: 'admin',
    inviteHash,
    invitedBy: invite.createdBy || '',
    createdAt: serverTimestamp(),
  };
  await setDoc(doc(db, 'admins', user.uid), adminPayload, { merge: true });
  await updateDoc(inviteRef, {
    active: false,
    usedBy: user.uid,
    usedByEmail: user.email || '',
    usedAt: serverTimestamp(),
  });
  return adminPayload;
}

async function getAdminInvites() {
  const snapshot = await getDocs(collection(db, 'admin_invites'));
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}

async function getAdmins() {
  const snapshot = await getDocs(collection(db, 'admins'));
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}

async function saveQuizSubmission(summary) {
  if (!summary || !summary.confirmation_code) throw new Error('Quiz submission needs a confirmation code.');
  const payload = {
    ...summary,
    createdAt: serverTimestamp(),
  };
  await setDoc(doc(db, 'quiz_submissions', summary.confirmation_code), payload, { merge: true });
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

function signInWithGoogle() {
  return signInWithPopup(auth, googleProvider);
}

function signOutUser() {
  return signOut(auth);
}

window.SwitchUpFirebase = {
  app,
  auth,
  db,
  storage,
  analyticsPromise,
  getContentItem,
  getContentCollection,
  saveContentItem,
  saveContentItems,
  getAdminProfile,
  createAdminInvite,
  redeemAdminInvite,
  getAdminInvites,
  getAdmins,
  saveQuizSubmission,
  getQuizSubmissions,
  getNarration,
  onAuthStateChanged: (callback) => onAuthStateChanged(auth, callback),
  signInWithGoogle,
  signOutUser,
};

window.dispatchEvent(new CustomEvent('switchup:firebase-ready', {
  detail: window.SwitchUpFirebase,
}));
