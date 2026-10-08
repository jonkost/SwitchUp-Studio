# SwitchUp Studio

SwitchUp Studio is a browser-based broadcast production simulator for higher education. Students learn to operate a virtual video switcher through hands-on simulation and built-in quizzes, all in a risk-free classroom environment.

## What's New in v6.5.19

1. Preview/Tie row now behaves like a hardware next-transition selector: pressing an unlit tie adds it, pressing a lit tie while others are lit makes it the only selection, and the last lit tie cannot be cleared, so one tie (normally BKGD) is always engaged.
2. PREVIEW is a look-ahead monitor: it shows what PROGRAM will look like after the next transition. A tied key that is on air no longer appears in preview; an untied key that is on air does.
3. Chroma key matte rebuilt. The Live Bug and OTS graphics render fully opaque (the old filter left red, green, and white pixels up to 47% see-through).
4. Lessons and quizzes no longer auto-select the key type or chroma colour when media is loaded. Students press SELF, LUMA, or CHR and pick the colour themselves.
5. Quizzes (banks and Run the Show) start with M1 and M2 empty ("NO MEDIA"); every prompt names the graphic to load. Leaving a quiz restores the freeplay defaults.
6. The Media Resources panel banner mirrors the lesson or quiz command text word for word.
7. Lesson, quiz bank, and Run the Show text rewritten as director calls with one shared vocabulary. Lesson 2 now teaches how ties select and deselect. Narration MP3s regenerated for every changed line.
8. Welcome title is plain white text.
9. Content tooling: `npm run content-reference` regenerates `docs/content-reference.md` from `script.js`; `node scripts/verify_content.mjs` drives every lesson step and quiz item headlessly against the app's own check logic.

<details>
<summary>Release notes — 6.5.18</summary>

1. Voice over now uses local Kokoro Heart MP3 files for lessons and quizzes.
2. Added `docs/content-reference.md` with lesson, hint, quiz, and Run the Show reference IDs.
3. Light mode now has stronger late overrides for dialogs, panels, buttons, and text.
4. Phone layouts get tighter wrapping and safer scrolling for lesson, quiz, menu, and dialog surfaces.

</details>

## Running Locally

SwitchUp Studio is a static site — no build step. Serve the repo root over HTTP and open `index.html`:

```bash
python3 -m http.server 8080
```

Then visit <http://localhost:8080>.

## Version History

- **6.5.19** Tie rules, look-ahead preview, chroma matte, director-call content rewrite, content tooling
- **6.5.18** Voice narration, content reference, light/mobile polish
- **6.5.17** Polish pass — 13 UI fixes
- **6.5.16** Polish pass — 8 UI fixes
- **6.5.15** Mockup-accurate proportional flex layout
- **6.5.14** Panel stretch fix
- **6.5.13** Right panel layout rebuild
- **6.5.12** DVE rep system, design consolidation
- **6.5.9** Design system token unification
- **6.5.5** Stable baseline

<details>
<summary>Detailed release notes — 6.5.17</summary>

1. Quiz Dialog — Practice Quiz restored as a button; note text below is plain (no box)
2. Quiz Dialog — CONTINUE is full-width and centered; BACK TO FREEPLAY stacked below
3. Main Menu — MAIN MENU label is a plain heading, no pill/button appearance
4. Main Menu — Open Media Resources title wraps to give visual space for the B hotkey
5. DVE Editor — Better scaling at all viewport sizes; tighter padding and clamp() font sizes
6. DVE Row — Info text uses Inter font (was monospace) for cleaner appearance
7. DVE Row — LED dot removed
8. CHR Controls — "Chroma Color" relabeled to "CHR Color"
9. DVE Row — Reset button redesigned in program red
10. Text Scaling — Key UI text uses clamp() for better readability at reduced scale
11. Multiviewer — PREVIEW/PROGRAM indicator bars now span full window width
12. Hotkeys — CUT and AUTO shortcut chips positioned outside button bounds for full visibility
13. Packaged as v6.5.17

</details>

## Editing Lesson and Quiz Text

All lesson steps, quiz banks, and Run the Show sequences live in `script.js`. After editing text there:

```bash
npm install
```

```bash
npm run content-reference
```

```bash
node scripts/verify_content.mjs
```

```bash
.venv-kokoro/bin/python scripts/generate_kokoro_narration.py
```

The first command installs jsdom (once). The second regenerates `docs/content-reference.md`, which the content dashboard and the narration generator both read. The third runs every lesson drive step, quiz bank item, and Run the Show step headlessly using the canonical solutions in `scripts/content-solutions.json` and fails if a prompt's check cannot be satisfied (add a solution for any new item). The last regenerates narration MP3s for missing reference IDs; pass `--force-ref <id>` for IDs whose text changed.

## Documentation

- [`docs/content-reference.md`](docs/content-reference.md) — lesson, hint, quiz, and Run the Show reference IDs (generated)
- [`docs/firebase-setup.md`](docs/firebase-setup.md) — Firebase project configuration
- [`docs/tts-backend-plan.md`](docs/tts-backend-plan.md) — narration/TTS backend notes

## License

SwitchUp Studio is licensed under CC BY-NC-ND 4.0. Free for educational use. Not for commercial use or redistribution. Copyright Jon Kost.
