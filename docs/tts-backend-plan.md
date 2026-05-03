# Kokoro Voice Backend Plan

## Recommendation

Use a backend for Kokoro voice generation. Keep Kokoro as the voice model, but move model loading, inference, and caching off the student browser.

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
- Firebase Storage stores generated Kokoro audio files.
- A small backend function or service runs Kokoro and writes audio to Storage.
- The static app reads content from Firestore and plays audio from Storage URLs.

Firestore is a good fit for editable text and metadata. It is not the right place to store the actual audio blobs; those should live in Firebase Storage.

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

- Firebase Hosting for the static app.
- Firestore for lesson/quiz text and narration metadata.
- Firebase Storage for generated `.mp3` or `.wav` audio.
- Cloud Run or Cloud Functions for the Kokoro generation endpoint.
- Kokoro generation worker that creates audio on demand.
- Admin screen later, after the content schema is stable.

## Browser Fallback

Keep native browser speech as the emergency fallback only. If the backend is unavailable, the lesson still works, but the preferred path is cached Kokoro audio.
