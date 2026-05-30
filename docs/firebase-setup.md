# Firebase Setup Checklist

This project now has Firebase client wiring in `firebase-client.js`. The app can stay hosted on GitHub Pages while Firebase handles Auth and Firestore for editable content.

## 1. Firebase Project

Configured project:

- Project ID: `switchup-studio`
- Auth domain: `switchup-studio.firebaseapp.com`
- Storage bucket: `switchup-studio.firebasestorage.app`

The Firebase web config is included in `firebase-client.js`. This config is safe to include in client code. Security comes from Firestore and Storage rules.

## 2. Enable Firestore

In Firebase Console:

1. Go to Firestore Database.
2. Create database.
3. Start in production mode.
4. Choose the closest region.

Suggested first collections:

```text
content_lessons/{referenceId}
content_quiz_bank/{referenceId}
content_run_the_show/{referenceId}
narration/{referenceId_voice_rate_hash}
```

## 3. GitHub Pages Hosting

SwitchUp Studio is hosted from GitHub, so Firebase Hosting is not required.

Expected public paths after GitHub Pages publishes the repo:

```text
https://jonkost.github.io/SwitchUp-Studio/
https://jonkost.github.io/SwitchUp-Studio/content-dashboard.html
```

The app and dashboard use relative links, so the `/SwitchUp-Studio/` GitHub Pages subfolder should work without special routing.

In Firebase Console, add the GitHub Pages domain to Authentication authorized domains before using Google sign-in:

```text
jonkost.github.io
```

Local development also uses:

```text
127.0.0.1
localhost
```

## 4. Firebase Storage

Skip Firebase Storage for a zero-budget build if Firebase asks you to upgrade to Blaze.

Instead, store generated Kokoro audio files as static repo assets:

Suggested storage path:

```text
assets/narration/{voice}/{encodedReferenceId}.mp3
```

If you later upgrade to Blaze, Firebase Storage can use:

```text
narration/{voice}/{textHash}.mp3
```

## 5. Firestore Rules

The repo now includes `firestore.rules`. It allows public reads for app content and narration metadata, but only authenticated admin users can write.

Deploy with:

```bash
firebase deploy --only firestore:rules
```

Before using the admin editor, create one `admins/{uid}` document for your own Firebase Auth user. This first account is the super admin.

Example document:

```text
Collection: admins
Document ID: your Firebase Auth UID

uid: your Firebase Auth UID
email: your email address
role: super_admin
createdAt: 2026-05-05T00:00:00Z
```

After that, sign into the dashboard with Google and open **Admin Accounts**. The super admin can create one-time admin codes for other instructors. The dashboard stores those codes as SHA-256 hashes in `admin_invites`, so the original code is not shown again after creation.

Suggested additional collections:

```text
admins/{uid}
admin_invites/{codeHash}
quiz_submissions/{confirmationCode}
lesson_submissions/{confirmationCode}
```

## 6. Storage Rules

The repo includes `storage.rules`, but you only need these if you enable Firebase Storage. For a zero-budget setup, leave Firebase Storage disabled and use static narration files in the repo.

Deploy with:

```bash
firebase deploy --only storage
```

The backend service should write audio using an Admin SDK or service account, not public client permissions.

## 7. Local App Wiring

Project files added:

- `.firebaserc`
- `firebase.json`
- `firestore.rules`
- `firestore.indexes.json`
- `storage.rules`
- `firebase-client.js`

`index.html` loads:

```html
<script type="module" src="firebase-client.js?v=2"></script>
```

That module exposes:

```js
window.SwitchUpFirebase
```

Available helpers:

- `getContentItem(collectionName, referenceId)`
- `getContentCollection(collectionName)`
- `saveQuizSubmission(summary)`
- `saveLessonSubmission(summary)`
- `getStudentResults(maxCount)`
- `getNarration(referenceId, voice, rate, textHash)`

The simulator does not require Firebase to open. If Firebase fails to load, the static app should still run with local lesson and quiz text.

## 8. What To Send Codex

To wire the app, provide:

1. Whether the GitHub Pages URL changed.
2. Whether you want content editing now, or only Kokoro narration first.
3. Your preferred Kokoro voice ID, for example `af_heart`.

Do not paste private service account JSON into chat unless you are ready for local backend setup and understand it is sensitive. For Cloud Run or Cloud Functions, use Firebase/Google Cloud secrets instead.

## 9. First Implementation Order

Recommended first pass:

1. Deploy `firestore.rules`.
2. Skip Storage unless you are comfortable upgrading to Blaze.
3. Add Firestore seed script from `docs/content-reference.md`.
4. Load content from local fallback first, Firestore second.
5. Add static Kokoro audio lookup by reference ID.
6. Keep browser speech as fallback.
7. Add admin editing screen after content loading is stable.

## 10. Grade Book

The simulator still sends non-practice quiz and guided lesson results to Formspree, but it also writes the same result payloads to Firestore:

```text
quiz_submissions/{confirmationCode}
lesson_submissions/{confirmationCode}
```

The dashboard **Grade book** tab reads those collections for signed-in admins. This avoids putting a private Formspree API token into GitHub Pages. If you later want true Formspree inbox sync, use a small server-side function or scheduled job so the Formspree API token stays private.
