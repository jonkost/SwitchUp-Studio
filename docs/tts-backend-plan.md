# Kokoro Voice Backend Plan

## Zero-Budget Recommendation

If the budget is truly $0, do not use Firebase Storage, Cloud Functions, Cloud Run, or any paid backend service.

Use this instead:

1. Generate Kokoro narration files locally.
2. Save the audio files into the repo, for example `assets/narration/af_heart/{encodedReferenceId}.mp3`.
3. Serve those files as normal static assets through free static hosting.
4. Keep native browser speech as fallback if an audio file is missing.

This keeps the Kokoro voice quality without a paid Firebase plan.

Good zero-budget hosts for static audio/assets:

- GitHub Pages, with published site/repo size limits. This is the current SwitchUp Studio hosting path.
- Firebase Hosting on Spark, if the project is ever moved off GitHub Pages.
- Cloudflare Pages Free, with static asset file limits.

Avoid Firebase Storage for a zero-budget plan because the console may require upgrading to Blaze.

## Local Static Audio Naming

The app now looks for local narration before using browser speech:

```text
assets/narration/af_heart/{encodeURIComponent(referenceId)}.mp3
```

Examples:

```text
assets/narration/af_heart/L2-l2-ready-cpu.instruction.mp3
assets/narration/af_heart/Q-B3-04.prompt.mp3
```

Most current IDs do not need visible escaping, but the app uses `encodeURIComponent` so future IDs remain file-safe.

## Current Hosting Direction

Keep the app and dashboard on GitHub Pages:

```text
https://jonkost.github.io/SwitchUp-Studio/
https://jonkost.github.io/SwitchUp-Studio/content-dashboard.html
```

Use Firebase only for:

- Google sign-in for the dashboard.
- Firestore lesson, quiz, and Run the Show text overrides.
- Admin write permissions through `admins/{uid}`.

Do not use Firebase Storage while the budget is zero. Save Kokoro narration as static repo files under `assets/narration/af_heart/`.

## Backend Recommendation

Use a backend for Kokoro voice generation. Keep Kokoro as the voice model, but move model loading, inference, and caching off the student browser.

This is the best technical route if a budget exists later. For now, static pre-generated audio is the safer free route.

## Why This Helps

The current browser-side approach asks each browser to:

- download model/runtime code,
- satisfy browser audio unlock rules,
- run inference locally,
- recover when Safari/Chrome/Firefox handle AudioContext differently,
- speak immediately while a lesson or quiz is changing state.

That is why playback can feel uneven even when the model voice is good.

A backend changes the browser job to: request an audio file and play it. That is much smoother and more predictable.

## Proposed Flow

1. The app requests narration by reference ID, for example `L2-l2-ready-cpu.instruction`.
2. The backend looks up the current text for that ID.
3. If cached audio exists for the text, the backend returns it immediately.
4. If the text changed, the backend runs Kokoro once, saves a new audio file, and returns it.
5. The browser plays the returned audio with a normal `<audio>` element.

## API Shape

Client-side lookup helper now exists in `firebase-client.js`:

```js
window.SwitchUpFirebase.getNarration(referenceId, voice, rate, textHash)
```

The backend/service still needs to generate the Kokoro audio and write the narration document plus Storage file.

```http
GET /api/narration/L2-l2-ready-cpu.instruction?voice=af_heart&rate=1.0
```

Returns:

```json
{
  "id": "L2-l2-ready-cpu.instruction",
  "textHash": "7b2c...",
  "voice": "af_heart",
  "rate": 1.0,
  "audioUrl": "/audio/narration/7b2c-af_heart-1.0.mp3"
}
```

## Content Control

Use `docs/content-reference.md` as the first reference layer. The next build step should move lesson and quiz copy into structured content files, such as:

- `content/lessons.json`
- `content/quiz-bank.json`
- `content/run-the-show.json`

Then a lightweight admin backend can edit those files or a database table, while the simulator keeps its check logic in code.

## Firebase / Firestore Direction

Since Firestore is available, use Firebase as the content and audio metadata layer:

- Firestore stores lesson, quiz, and Run the Show text by reference ID.
- Firestore stores narration metadata: text hash, voice, rate, audio path, generated date.
- Static GitHub Pages assets store generated Kokoro audio files while the budget is zero.
- A small local generation workflow can run Kokoro and save audio files into the repo.
- The static app reads content from Firestore and plays audio from `assets/narration/af_heart/`.

Firestore is a good fit for editable text and metadata. It is not the right place to store the actual audio blobs; those should live as static `.mp3` files in the repo for now, or in Firebase Storage only if the project later moves to a paid backend.

Example collections:

```text
content/lessons/items/{referenceId}
content/quizBank/items/{referenceId}
content/runTheShow/items/{referenceId}
narration/{referenceId_voice_rate_hash}
```

Example content document:

```json
{
  "id": "L2-l2-ready-cpu.instruction",
  "text": "Ready CPU on Preview.",
  "kind": "lesson",
  "lesson": 2,
  "stepId": "l2-ready-cpu",
  "field": "instruction",
  "updatedAt": "serverTimestamp"
}
```

Example narration document:

```json
{
  "contentId": "L2-l2-ready-cpu.instruction",
  "textHash": "7b2c...",
  "voice": "af_heart",
  "rate": 1.0,
  "storagePath": "narration/af_heart/7b2c.mp3",
  "status": "ready",
  "updatedAt": "serverTimestamp"
}
```

## Best First Backend

Start small:

- GitHub Pages for the static app and dashboard.
- Firestore for lesson/quiz text and narration metadata.
- Local Kokoro generation saved into `assets/narration/af_heart/`.
- Cloud Run or Cloud Functions for the Kokoro generation endpoint.
- Kokoro generation worker that creates audio on demand.
- Admin screen later, after the content schema is stable.

## Browser Fallback

Keep native browser speech as the emergency fallback only. If the backend is unavailable, the lesson still works, but the preferred path is cached Kokoro audio.
