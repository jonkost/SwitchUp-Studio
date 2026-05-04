# SwitchUp Studio Kokoro Narration

Place generated Kokoro `af_heart` MP3 files in this folder.

The app only tries to play local narration files listed in `manifest.json`. It is Kokoro-only: if a listed MP3 is missing or blocked, it stays quiet instead of using a browser system voice.

For best Safari reliability:

- Open the app from `https://`, `http://127.0.0.1`, or `http://localhost`, not `file://`.
- Export files as standard MP3, `audio/mpeg`.
- Keep each manifest ID exactly matched to the filename without `.mp3`.
- Let the user tap/click once before narration starts; the app uses that gesture to unlock audio.

File naming:

```text
{referenceId}.mp3
```

Examples:

```text
L2-l2-ready-cpu.instruction.mp3
L2-l2-ready-cpu.hint.mp3
Q-B1-01.prompt.mp3
Q-RTS1-01.prompt.mp3
```

After adding files, update `manifest.json`:

```json
{
  "voice": "af_heart",
  "format": "mp3",
  "files": [
    "L2-l2-ready-cpu.instruction",
    "Q-B1-01.prompt"
  ]
}
```
