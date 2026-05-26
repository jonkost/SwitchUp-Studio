# SwitchUp Studio Content Reference

Use these IDs when requesting copy edits. Example: "Change `L2-l2-ready-cpu.instruction` to ..." or "Adjust `Q-B3-04.prompt`."

Notes:
- Lesson entries use the source lesson step ID from `script.js`.
- Quiz bank levels draw 10 random questions from the listed bank.
- Run the Show levels use fixed sequences and keep state between steps.
- Level 1 quiz prompts are generated from the source names, so the IDs below expand those generated questions.
- Quiz prompts that mention M1 or M2 without an explicit media load get a runtime prefix: "Load Host to M1." and/or "Load Guest to M2."
- If a student skips a quiz prompt once, the runtime text adds: "skipped once. It will return at the end. Skip it again for no credit."

## Lessons

### Lesson 1 - Introduction

| Ref ID | Type | Text |
| --- | --- | --- |
| `L1-welcome.instruction` | Watch | Welcome to Lesson 1. You'll learn the switcher layout, how to ready sources, cut and dissolve between cameras, use hotkeys to work faster, and take the show to black. |
| `L1-multiviewer.instruction` | Watch | At the top is the MULTIVIEWER. PREVIEW (green border) is what's ready next. PROGRAM (red border) is what's live on air right now. Nothing goes to air until you take action. |
| `L1-thumbnails.instruction` | Watch | Below the multiviewer are source thumbnails - CAM 1, CAM 2, CAM 3, CPU, GFX, M1, M2, ME1, BLK, and BARS. These give you a visual reference of every source available to the switcher. |
| `L1-pvw-explained.instruction` | Watch | The PREVIEW row (PVW) is where you select your next shot. Watch - CAM 1 is being readied in Preview. The green highlight shows what's on deck. |
| `L1-pgm-explained.instruction` | Watch | The PROGRAM row (PGM) shows what is live right now - highlighted in red. Watch - CAM 1 cuts from Preview to Program. The switcher is live. |
| `L1-cut-explained.instruction` | Watch | CUT is an instant switch - no blend, just a hard take. Watch: CAM 2 is readied in Preview, then CUT takes it live immediately. |
| `L1-auto-explained.instruction` | Watch | AUTO performs a smooth dissolve between sources. Watch: CAM 3 is readied in Preview, then AUTO blends it onto Program. Use this for elegant transitions. |
| `L1-hotkeys-intro.instruction` | Watch | Pro operators use keyboard hotkeys to work without reaching for the mouse. SwitchUp Studio has shortcuts for every major action - learn them and your speed doubles. |
| `L1-hotkey-cut-auto.instruction` | Watch | The two most important hotkeys: press < (left angle bracket) to CUT instantly. Press > (right angle bracket) to AUTO dissolve. These are your bread-and-butter moves. |
| `L1-hotkey-surface.instruction` | Watch | Press M to switch between the ME P/P bus and ME 1 bus. The Surface panel shows which mix bus you're controlling at any time. |
| `L1-hotkey-dve-media.instruction` | Watch | Press D to toggle the DVE (picture-in-picture). Press B to open the Media Bank for loading graphics. Use Cmd+Z to undo your last action. |
| `L1-black-intro.instruction` | Watch | Every show starts and ends on BLACK. Select BLK in the Preview row before fading up at the top of the show - or when wrapping. Watch - BLK is being readied in Preview. |
| `L1-black-dissolve.instruction` | Watch | Watch - dissolving to BLACK fades the show clean. This is your show-ender. AUTO or the > hotkey does the job. Drive mode is next - your turn to take the wheel. |
| `L1-drive-intro-cam1-pvw.instruction` | Drive | DRIVE MODE - you're in control. Start by readying CAM 1 on Preview. Select CAM 1 in the PVW row. |
| `L1-drive-intro-cam1-pvw.hint` | Hint | Look at the PREVIEW row and tap CAM 1. |
| `L1-drive-cut-cam1.instruction` | Drive | CAM 1 is on Preview. Take it live with a CUT. Press the CUT button - or use the < hotkey on your keyboard. |
| `L1-drive-cut-cam1.hint` | Hint | Press the CUT button, or hit the < key on your keyboard. |
| `L1-drive-cam2-pvw.instruction` | Drive | Good cut! Now ready CAM 2 on Preview for your next shot. |
| `L1-drive-cam2-pvw.hint` | Hint | Select CAM 2 in the Preview row. |
| `L1-drive-dissolve-cam2.instruction` | Drive | CAM 2 is on Preview. Dissolve to it smoothly using AUTO - or press the > hotkey. |
| `L1-drive-dissolve-cam2.hint` | Hint | Press AUTO, or hit the > key on your keyboard. |
| `L1-drive-cam3-pvw.instruction` | Drive | Nice dissolve. Now ready CAM 3 on Preview. |
| `L1-drive-cam3-pvw.hint` | Hint | Select CAM 3 in the Preview row. |
| `L1-drive-cut-cam3.instruction` | Drive | CUT to CAM 3. Hard take - no dissolve. CUT button or < key. |
| `L1-drive-cut-cam3.hint` | Hint | Press CUT, or hit the < key. |
| `L1-drive-blk-pvw.instruction` | Drive | Time to wrap the segment. Ready BLACK on Preview - select BLK in the PVW row. |
| `L1-drive-blk-pvw.hint` | Hint | Select BLK in the Preview row. |
| `L1-drive-dissolve-blk.instruction` | Drive | Fade to black. Use AUTO - or the > hotkey - to dissolve the show to black. |
| `L1-drive-dissolve-blk.hint` | Hint | Press AUTO or hit > to fade to black. |
| `L1-complete.instruction` | Watch | Lesson 1 complete! You know the layout, CUT and AUTO transitions, the key hotkeys, and how to fade to black. You're ready to run a show. |

### Lesson 2 - Keying & Graphics

| Ref ID | Type | Text |
| --- | --- | --- |
| `L2-l2-intro.instruction` | Watch | Lesson 2 covers keying and graphics. You'll load media, set a key type, preview it on the transition, and bring it on air - with and without the background. |
| `L2-l2-media-explained.instruction` | Watch | MEDIA SEL opens the media resource panel. This is where you load a graphic into M1 or M2 before keying it. |
| `L2-l2-key-type-explained.instruction` | Watch | The Type of Key row lets you choose SELF, LUMA, or CHR. The right key type depends on how the graphic was made. |
| `L2-l2-key-source-explained.instruction` | Watch | The Key Source row is where you select which source feeds into DSK 1. You'll typically assign M1 or M2 here. |
| `L2-l2-tie-explained.instruction` | Watch | Pressing KEY 1 in the Preview/Tie row arms the key to transition with the background. It will ride along when you cut or dissolve. |
| `L2-l2-dsk-cut-explained.instruction` | Watch | DSK CUT drops the key on or off instantly - independent of the background. DSK AUTO dissolves it on or off smoothly. |
| `L2-l2-take-cam1.instruction` | Drive | First, take CAM 1 to Program. Ready it on Preview, then CUT. |
| `L2-l2-take-cam1.hint` | Hint | Select CAM 1 in Preview, then press CUT. |
| `L2-l2-open-media.instruction` | Drive | Open Media Resources using the MEDIA SEL button. |
| `L2-l2-open-media.hint` | Hint | Press the MEDIA SEL button. |
| `L2-l2-close-media.instruction` | Drive | In the Graphics Library, tap Side Graphic to load it into M1, then press DONE to close the panel. |
| `L2-l2-close-media.hint` | Hint | Tap Side Graphic in the Graphics Library, then press DONE. |
| `L2-l2-select-dsk1.instruction` | Drive | Select DSK channel 1 using the SEL 1 button. |
| `L2-l2-select-dsk1.hint` | Hint | Press SEL 1 in the DSK section. |
| `L2-l2-set-key-source-m1.instruction` | Drive | Set the Key Source to M1. |
| `L2-l2-set-key-source-m1.hint` | Hint | Find M1 in the Key Source row and tap it. |
| `L2-l2-set-self-key.instruction` | Drive | Set the key type to SELF. |
| `L2-l2-set-self-key.hint` | Hint | Press SELF in the Type of Key row. |
| `L2-l2-preview-key.instruction` | Drive | Arm KEY 1 in the Preview/Tie row so it will ride with the next transition. |
| `L2-l2-preview-key.hint` | Hint | Press KEY 1 in the Preview / Tie row. |
| `L2-l2-ready-cam1-again.instruction` | Drive | Now ready CAM 1 on Preview (it's already on Program - this sets up the dissolve with the key). |
| `L2-l2-ready-cam1-again.hint` | Hint | Select CAM 1 in the Preview row. |
| `L2-l2-dissolve-cam1-with-key.instruction` | Drive | Dissolve to CAM 1 with Key 1 using AUTO. The graphic rides onto air with the background. |
| `L2-l2-dissolve-cam1-with-key.hint` | Hint | Press AUTO. Both the background and Key 1 will come on together. |
| `L2-l2-lose-tie.instruction` | Drive | Now lose the KEY 1 tie by pressing KEY 1 in the Preview/Tie row again. The key stays live but will no longer ride with the next transition. |
| `L2-l2-lose-tie.hint` | Hint | Press KEY 1 in the Preview/Tie row to toggle the tie off. |
| `L2-l2-ready-cam2.instruction` | Drive | Ready CAM 2 on Preview. |
| `L2-l2-ready-cam2.hint` | Hint | Select CAM 2 in the Preview row. |
| `L2-l2-cut-cam2-under-key.instruction` | Drive | CUT to CAM 2. The background switches but the key stays on - that's "under the key." |
| `L2-l2-cut-cam2-under-key.hint` | Hint | Press CUT. The background changes but Key 1 remains on air. |
| `L2-l2-cut-key-off.instruction` | Drive | Take Key 1 off using DSK CUT 1. |
| `L2-l2-cut-key-off.hint` | Hint | Press CUT in the DSK 1 row to take the key off. |
| `L2-l2-dsk-auto-intro.instruction` | Drive | Good. Now let's practice dissolving a key on and off using DSK AUTO. Press NEXT to continue. |
| `L2-l2-auto-key-on.instruction` | Drive | Dissolve Key 1 back on using DSK AUTO 1. |
| `L2-l2-auto-key-on.hint` | Hint | Press AUTO in the DSK 1 row. |
| `L2-l2-auto-key-off.instruction` | Drive | Now dissolve Key 1 off using DSK AUTO 1. |
| `L2-l2-auto-key-off.hint` | Hint | Press AUTO in the DSK 1 row again to dissolve the key off. |
| `L2-l2-chroma-intro.instruction` | Drive | Now let's try a chroma key. Next you'll open MEDIA SEL and load Live Bug into M1. Press NEXT to continue. |
| `L2-l2-chroma-open-media.instruction` | Drive | Open Media Resources using the MEDIA SEL button. |
| `L2-l2-chroma-open-media.hint` | Hint | Press MEDIA SEL. |
| `L2-l2-chroma-close-media.instruction` | Drive | Tap Live Bug in the Graphics Library to load it into M1, then press DONE. |
| `L2-l2-chroma-close-media.hint` | Hint | Tap Live Bug in the Graphics Library, then press DONE. |
| `L2-l2-set-chr-key.instruction` | Drive | Set the key type to CHR (chroma key). |
| `L2-l2-set-chr-key.hint` | Hint | Press CHR in the Type of Key row. |
| `L2-l2-set-chr-blue.instruction` | Drive | Set the chroma color to BLUE (Live Bug uses a blue screen). |
| `L2-l2-set-chr-blue.hint` | Hint | Press BLUE in the CHR Color selector. |
| `L2-l2-preview-chr-key.instruction` | Drive | Arm KEY 1 in the Preview/Tie row. |
| `L2-l2-preview-chr-key.hint` | Hint | Press KEY 1 in the Preview/Tie row. |
| `L2-l2-ready-cpu.instruction` | Drive | Ready CPU on Preview. |
| `L2-l2-ready-cpu.hint` | Hint | Select CPU in the Preview row. |
| `L2-l2-dissolve-cpu-with-bug.instruction` | Drive | Dissolve to CPU with the Live Bug chroma key riding on. |
| `L2-l2-dissolve-cpu-with-bug.hint` | Hint | Press AUTO. |
| `L2-l2-complete.instruction` | Watch | Lesson 2 complete! You can now load media, set key types, tie keys to transitions, switch under a live key, and remove keys cleanly. Ready for Lesson 3? |

### Lesson 3 - M/Es & DSK Ties

| Ref ID | Type | Text |
| --- | --- | --- |
| `L3-l3-intro.instruction` | Watch | Lesson 3 is about Mix/Effects and DVE keys. You'll build composites on ME 1 and use them as a key source on ME P/P. |
| `L3-l3-surface-explained.instruction` | Watch | The Surface selector switches you between ME P/P (main output) and ME 1 (a separate bus you use to build composites). The ME P/P row stays in the switcher output at all times. |
| `L3-l3-me1-explained.instruction` | Watch | When you switch to ME 1, you're now controlling that separate bus. Anything you build here can be recalled as a source called "ME1" on ME P/P. |
| `L3-l3-dve-toggle-explained.instruction` | Watch | The DVE button enables a Picture-in-Picture effect on a key. Once on, tap the DVE slot to open the editor and reposition or resize the source. |
| `L3-l3-key2-key3-explained.instruction` | Watch | You can run up to 4 keys at once using SEL 1-4. In Quiz Level 3 you'll often be working with Key 2 and Key 3 - not just Key 1. |
| `L3-l3-take-cam1.instruction` | Drive | Take CAM 1 to Program. |
| `L3-l3-take-cam1.hint` | Hint | Ready CAM 1 on Preview then CUT. |
| `L3-l3-select-dsk1.instruction` | Drive | Select DSK 1. |
| `L3-l3-select-dsk1.hint` | Hint | Press SEL 1. |
| `L3-l3-set-cpu-source.instruction` | Drive | Set the Key Source to CPU. |
| `L3-l3-set-cpu-source.hint` | Hint | Find CPU in the Key Source row. |
| `L3-l3-enable-dve.instruction` | Drive | Enable DVE on this key using the DVE button. |
| `L3-l3-enable-dve.hint` | Hint | Press DVE in the Type of Key row. |
| `L3-l3-open-dve-editor.instruction` | Drive | Tap the DVE slot to open the editor. Use the Scale slider to size it down (around 50%), then use the D-pad to move it to the bottom-right corner. Close the editor when done. |
| `L3-l3-open-dve-editor.hint` | Hint | Tap the DVE slot. Drag Scale down toward 50%, then use the D-pad to move bottom-right. |
| `L3-l3-preview-dve-key.instruction` | Drive | When positioned, arm KEY 1 in the Preview/Tie row. |
| `L3-l3-preview-dve-key.hint` | Hint | Press KEY 1 in the Preview/Tie row. |
| `L3-l3-ready-cam2.instruction` | Drive | Ready CAM 2 on Preview. |
| `L3-l3-ready-cam2.hint` | Hint | Select CAM 2 in the Preview row. |
| `L3-l3-take-cam2-with-dve.instruction` | Drive | Take CAM 2 to Program with the DVE key riding on. |
| `L3-l3-take-cam2-with-dve.hint` | Hint | Press CUT. |
| `L3-l3-lose-tie-dve.instruction` | Drive | Lose the KEY 1 tie. |
| `L3-l3-lose-tie-dve.hint` | Hint | Press KEY 1 in the Preview/Tie row to toggle the tie off. |
| `L3-l3-ready-cpu-bg.instruction` | Drive | Ready CPU on Preview. |
| `L3-l3-ready-cpu-bg.hint` | Hint | Select CPU in the Preview row. |
| `L3-l3-cut-cpu-under-key.instruction` | Drive | CUT to CPU under the live DVE key. |
| `L3-l3-cut-cpu-under-key.hint` | Hint | Press CUT. |
| `L3-l3-auto-key-off.instruction` | Drive | Auto Key 1 off using DSK AUTO 1. |
| `L3-l3-auto-key-off.hint` | Hint | Press AUTO in the DSK 1 row. |
| `L3-l3-me1-intro.instruction` | Drive | Now let's build a composite on ME 1. Press NEXT, then switch the surface to ME 1. |
| `L3-l3-switch-to-me1.instruction` | Drive | Switch the active surface to ME 1. |
| `L3-l3-switch-to-me1.hint` | Hint | Press ME 1 in the Surface selector. |
| `L3-l3-take-blk-me1.instruction` | Drive | Take BLK on ME 1 - this gives us a clean black canvas to build on. |
| `L3-l3-take-blk-me1.hint` | Hint | Ready BLK on Preview then press CUT. |
| `L3-l3-me1-build-intro.instruction` | Drive | On ME 1, build a side-by-side composite: two sources in DVE PIP boxes, side by side with borders and crop. Use Key 1 for one source and Key 2 for the other. (Lesson 4 walks through this step by step - for now, build what you can, then press NEXT to continue.) |
| `L3-l3-switch-back-mepp.instruction` | Drive | When your side-by-side composite is complete, switch back to ME P/P. |
| `L3-l3-switch-back-mepp.hint` | Hint | Press ME P/P in the Surface selector. |
| `L3-l3-ready-me1.instruction` | Drive | Ready ME1 as a source on Preview. |
| `L3-l3-ready-me1.hint` | Hint | Find ME1 in the Preview row and select it. |
| `L3-l3-take-me1.instruction` | Drive | CUT ME1 to Program. |
| `L3-l3-take-me1.hint` | Hint | Press CUT. |
| `L3-l3-ready-cam2-from-me1.instruction` | Drive | Ready CAM 2 on Preview. |
| `L3-l3-ready-cam2-from-me1.hint` | Hint | Select CAM 2 in the Preview row. |
| `L3-l3-take-cam2-from-me1.instruction` | Drive | CUT to CAM 2. |
| `L3-l3-take-cam2-from-me1.hint` | Hint | Press CUT. |
| `L3-l3-me1-as-key-intro.instruction` | Drive | Great. Next, you'll use that ME 1 composite as a DVE key source - like a picture-in-picture of the whole composite. Press NEXT to continue. |
| `L3-l3-sel-dsk1-for-me1.instruction` | Drive | Select DSK 1. |
| `L3-l3-sel-dsk1-for-me1.hint` | Hint | Press SEL 1. |
| `L3-l3-set-me1-source.instruction` | Drive | Set the Key Source to ME1. |
| `L3-l3-set-me1-source.hint` | Hint | Find ME1 in the Key Source row. |
| `L3-l3-enable-dve-me1.instruction` | Drive | Enable DVE for this key. |
| `L3-l3-enable-dve-me1.hint` | Hint | Press DVE in the Type of Key row. |
| `L3-l3-position-dve-me1.instruction` | Drive | Tap the DVE slot to open the editor. Size it down and move it to the bottom-right corner, then close the editor. |
| `L3-l3-position-dve-me1.hint` | Hint | Tap the DVE slot. Lower Scale and use the D-pad to move bottom-right. |
| `L3-l3-preview-me1-key.instruction` | Drive | Arm KEY 1 in the Preview/Tie row. |
| `L3-l3-preview-me1-key.hint` | Hint | Press KEY 1 in the Preview/Tie row. |
| `L3-l3-ready-cam1-for-me1-key.instruction` | Drive | Ready CAM 1 on Preview. |
| `L3-l3-ready-cam1-for-me1-key.hint` | Hint | Select CAM 1 in the Preview row. |
| `L3-l3-dissolve-cam1-me1-key.instruction` | Drive | Dissolve to CAM 1 with the ME1 DVE key riding on. |
| `L3-l3-dissolve-cam1-me1-key.hint` | Hint | Press AUTO. |
| `L3-l3-auto-key1-off.instruction` | Drive | Dissolve Key 1 off. |
| `L3-l3-auto-key1-off.hint` | Hint | Press AUTO in the DSK 1 row. |
| `L3-l3-complete.instruction` | Watch | Lesson 3 complete! You can now work with DVE keys, multiple DSK channels, build ME 1 composites, and use ME 1 as a key source. Ready for Lesson 4? |

### Lesson 4 - Advanced & Review

| Ref ID | Type | Text |
| --- | --- | --- |
| `L4-l4-intro.instruction` | Watch | Lesson 4 is the advanced and review lesson. You'll build ME 1 precomps, store them to ME 1 macros, recall them, and use them as live key sources - the full expert workflow. |
| `L4-l4-memory-explained.instruction` | Watch | The Macro row at the top of the panel has STORE and RECALL for both ME P/P and ME 1. Storing a macro saves the entire bus state - sources, keys, DVE positions, everything. |
| `L4-l4-workflow-explained.instruction` | Watch | The expert workflow is: build composite -> store to ME 1 macro -> clear and build a second composite -> store that -> then recall either one on demand during a show. |
| `L4-l4-switch-to-me1-build1.instruction` | Drive | Switch to ME 1. |
| `L4-l4-switch-to-me1-build1.hint` | Hint | Press ME 1 in the Surface selector. |
| `L4-l4-blk-me1-build1.instruction` | Drive | Take BLK on ME 1. |
| `L4-l4-blk-me1-build1.hint` | Hint | Ready BLK then CUT. |
| `L4-l4-sbs-intro.instruction` | Drive | Build the side-by-side: DSK 1 = CAM 3 on the left, DSK 2 = CAM 1 on the right. Both need DVE on at ~95% scale with H crop ~40% and a border. Press NEXT to begin. |
| `L4-l4-sbs-sel-dsk1.instruction` | Drive | Select DSK 1. |
| `L4-l4-sbs-sel-dsk1.hint` | Hint | Press SEL 1. |
| `L4-l4-sbs-src-cam3.instruction` | Drive | Set the Key Source to CAM 3 - the left side of the frame. |
| `L4-l4-sbs-src-cam3.hint` | Hint | Select CAM 3 in the Key Source row. |
| `L4-l4-sbs-dve1.instruction` | Drive | Enable DVE for DSK 1. |
| `L4-l4-sbs-dve1.hint` | Hint | Press DVE in the Type of Key row. |
| `L4-l4-sbs-cut1-on.instruction` | Drive | Cut DSK 1 on to activate it. |
| `L4-l4-sbs-cut1-on.hint` | Hint | Press CUT in the DSK 1 column. |
| `L4-l4-sbs-config-dve1.instruction` | Drive | Tap the DVE slot to open the editor for DSK 1. Set Scale to about 95%, H crop to about 40%, move X all the way left (~15%), and turn the Border on. Close when done. |
| `L4-l4-sbs-config-dve1.hint` | Hint | Tap the DVE slot. Scale up to ~95%, H crop ~40%, drag X left to ~15%, enable Border. Then close. |
| `L4-l4-sbs-sel-dsk2.instruction` | Drive | Select DSK 2. |
| `L4-l4-sbs-sel-dsk2.hint` | Hint | Press SEL 2. |
| `L4-l4-sbs-src-cam1.instruction` | Drive | Set the Key Source to CAM 1 - the right side of the frame. |
| `L4-l4-sbs-src-cam1.hint` | Hint | Select CAM 1 in the Key Source row. |
| `L4-l4-sbs-dve2.instruction` | Drive | Enable DVE for DSK 2. |
| `L4-l4-sbs-dve2.hint` | Hint | Press DVE in the Type of Key row. |
| `L4-l4-sbs-cut2-on.instruction` | Drive | Cut DSK 2 on. |
| `L4-l4-sbs-cut2-on.hint` | Hint | Press CUT in the DSK 2 column. |
| `L4-l4-sbs-config-dve2.instruction` | Drive | Tap the DVE slot to open the editor for DSK 2. Same Scale (~95%) and H crop (~40%) as DSK 1, but move X all the way right (~85%) and turn the Border on. Close when done. |
| `L4-l4-sbs-config-dve2.hint` | Hint | Tap the DVE slot. Scale ~95%, H crop ~40%, drag X right to ~85%, enable Border. Then close. |
| `L4-l4-store-macro1.instruction` | Drive | Store this side-by-side to ME 1 Macro 1 - press STORE next to the ME1 memory bank, then press slot 1. |
| `L4-l4-store-macro1.hint` | Hint | Press STORE in the ME1 memory row, then press slot button 1. |
| `L4-l4-blk-me1-build2.instruction` | Drive | Take BLK on ME 1 again to clear the canvas. |
| `L4-l4-blk-me1-build2.hint` | Hint | Ready BLK then CUT. |
| `L4-l4-quad-intro.instruction` | Drive | Build the quad: four DVE keys at ~50% scale, each cropped into a corner with H and V crop and borders. CAM 1 top-left, CAM 2 top-right, CAM 3 bottom-left, CPU bottom-right. Press NEXT to begin. |
| `L4-l4-quad-sel-dsk1.instruction` | Drive | Select DSK 1. |
| `L4-l4-quad-sel-dsk1.hint` | Hint | Press SEL 1. |
| `L4-l4-quad-src-cam1.instruction` | Drive | Set DSK 1 Key Source to CAM 1 - top-left corner. |
| `L4-l4-quad-src-cam1.hint` | Hint | Select CAM 1 in the Key Source row. |
| `L4-l4-quad-dve1.instruction` | Drive | Enable DVE for DSK 1. |
| `L4-l4-quad-dve1.hint` | Hint | Press DVE in the Type of Key row. |
| `L4-l4-quad-cut1-on.instruction` | Drive | Cut DSK 1 on. |
| `L4-l4-quad-cut1-on.hint` | Hint | Press CUT in the DSK 1 column. |
| `L4-l4-quad-config-dve1.instruction` | Drive | Tap the DVE slot to open the editor for DSK 1. Set Scale to about 50%, add some H and V crop, move to the top-left corner, and turn the Border on. Close when done. |
| `L4-l4-quad-config-dve1.hint` | Hint | Tap the DVE slot. Scale ~50%, add H and V crop, drag to the top-left corner, enable Border. |
| `L4-l4-quad-sel-dsk2.instruction` | Drive | Select DSK 2. |
| `L4-l4-quad-sel-dsk2.hint` | Hint | Press SEL 2. |
| `L4-l4-quad-src-cam2.instruction` | Drive | Set DSK 2 Key Source to CAM 2 - top-right corner. |
| `L4-l4-quad-src-cam2.hint` | Hint | Select CAM 2 in the Key Source row. |
| `L4-l4-quad-dve2.instruction` | Drive | Enable DVE for DSK 2. |
| `L4-l4-quad-dve2.hint` | Hint | Press DVE in the Type of Key row. |
| `L4-l4-quad-cut2-on.instruction` | Drive | Cut DSK 2 on. |
| `L4-l4-quad-cut2-on.hint` | Hint | Press CUT in the DSK 2 column. |
| `L4-l4-quad-config-dve2.instruction` | Drive | Tap the DVE slot to open the editor for DSK 2. Same Scale (~50%) and crop as DSK 1, but move to the top-right corner. Turn the Border on. Close when done. |
| `L4-l4-quad-config-dve2.hint` | Hint | Tap the DVE slot. Scale ~50%, add crop, drag to top-right, enable Border. |
| `L4-l4-quad-sel-dsk3.instruction` | Drive | Select DSK 3. |
| `L4-l4-quad-sel-dsk3.hint` | Hint | Press SEL 3. |
| `L4-l4-quad-src-cam3.instruction` | Drive | Set DSK 3 Key Source to CAM 3 - bottom-left corner. |
| `L4-l4-quad-src-cam3.hint` | Hint | Select CAM 3 in the Key Source row. |
| `L4-l4-quad-dve3.instruction` | Drive | Enable DVE for DSK 3. |
| `L4-l4-quad-dve3.hint` | Hint | Press DVE in the Type of Key row. |
| `L4-l4-quad-cut3-on.instruction` | Drive | Cut DSK 3 on. |
| `L4-l4-quad-cut3-on.hint` | Hint | Press CUT in the DSK 3 column. |
| `L4-l4-quad-config-dve3.instruction` | Drive | Tap the DVE slot to open the editor for DSK 3. Same Scale (~50%) and crop, move to the bottom-left corner. Turn the Border on. Close when done. |
| `L4-l4-quad-config-dve3.hint` | Hint | Tap the DVE slot. Scale ~50%, add crop, drag to bottom-left, enable Border. |
| `L4-l4-quad-sel-dsk4.instruction` | Drive | Select DSK 4. |
| `L4-l4-quad-sel-dsk4.hint` | Hint | Press SEL 4. |
| `L4-l4-quad-src-cpu.instruction` | Drive | Set DSK 4 Key Source to CPU - bottom-right corner. |
| `L4-l4-quad-src-cpu.hint` | Hint | Select CPU in the Key Source row. |
| `L4-l4-quad-dve4.instruction` | Drive | Enable DVE for DSK 4. |
| `L4-l4-quad-dve4.hint` | Hint | Press DVE in the Type of Key row. |
| `L4-l4-quad-cut4-on.instruction` | Drive | Cut DSK 4 on. |
| `L4-l4-quad-cut4-on.hint` | Hint | Press CUT in the DSK 4 column. |
| `L4-l4-quad-config-dve4.instruction` | Drive | Tap the DVE slot to open the editor for DSK 4. Same Scale (~50%) and crop, move to the bottom-right corner. Turn the Border on. Close when done. |
| `L4-l4-quad-config-dve4.hint` | Hint | Tap the DVE slot. Scale ~50%, add crop, drag to bottom-right, enable Border. |
| `L4-l4-store-macro2.instruction` | Drive | Store the quad to ME 1 Macro 2. |
| `L4-l4-store-macro2.hint` | Hint | Press STORE in the ME1 row, then press slot 2. |
| `L4-l4-recall-intro.instruction` | Drive | Both composites are stored. Now you'll practice recalling them on demand - like you would live during a show. Press NEXT to continue. |
| `L4-l4-recall-macro1.instruction` | Drive | Recall ME 1 Macro 1 to load the side-by-side back onto ME 1. |
| `L4-l4-recall-macro1.hint` | Hint | Press RECALL then slot 1 in the ME1 memory row. |
| `L4-l4-switch-to-mepp.instruction` | Drive | Switch back to ME P/P. |
| `L4-l4-switch-to-mepp.hint` | Hint | Press ME P/P in the Surface selector. |
| `L4-l4-ready-me1.instruction` | Drive | Ready ME1 on Preview. |
| `L4-l4-ready-me1.hint` | Hint | Select ME1 in the Preview row. |
| `L4-l4-cut-me1.instruction` | Drive | CUT ME1 to Program. |
| `L4-l4-cut-me1.hint` | Hint | Press CUT. |
| `L4-l4-ready-cam2-after-me1.instruction` | Drive | Ready CAM 2 on Preview. |
| `L4-l4-ready-cam2-after-me1.hint` | Hint | Select CAM 2 in the Preview row. |
| `L4-l4-cut-cam2.instruction` | Drive | CUT to CAM 2. |
| `L4-l4-cut-cam2.hint` | Hint | Press CUT. |
| `L4-l4-sel-dsk1.instruction` | Drive | Select DSK 1. |
| `L4-l4-sel-dsk1.hint` | Hint | Press SEL 1. |
| `L4-l4-set-me1-key-source.instruction` | Drive | Set the Key Source to ME1. |
| `L4-l4-set-me1-key-source.hint` | Hint | Find ME1 in the Key Source row. |
| `L4-l4-enable-dve-key.instruction` | Drive | Enable DVE for Key 1. |
| `L4-l4-enable-dve-key.hint` | Hint | Press DVE in the Type of Key row. |
| `L4-l4-position-dve-bottom-right.instruction` | Drive | Tap the DVE slot to open the editor. Size it down and move it to the bottom-right corner. Close when done. |
| `L4-l4-position-dve-bottom-right.hint` | Hint | Tap the DVE slot. Lower Scale and drag to bottom-right. |
| `L4-l4-preview-key1-me1.instruction` | Drive | Arm KEY 1 in the Preview/Tie row. |
| `L4-l4-preview-key1-me1.hint` | Hint | Press KEY 1 in the Preview/Tie row. |
| `L4-l4-ready-cam1-for-key.instruction` | Drive | Ready CAM 1 on Preview. |
| `L4-l4-ready-cam1-for-key.hint` | Hint | Select CAM 1 in the Preview row. |
| `L4-l4-dissolve-cam1-with-me1-key.instruction` | Drive | Dissolve to CAM 1 with the ME1 DVE key. |
| `L4-l4-dissolve-cam1-with-me1-key.hint` | Hint | Press AUTO. |
| `L4-l4-auto-off-final.instruction` | Drive | Dissolve Key 1 off. |
| `L4-l4-auto-off-final.hint` | Hint | Press AUTO in the DSK 1 row. |
| `L4-l4-recall-macro2-prep.instruction` | Drive | Final challenge: recall the quad composite from ME 1 Macro 2 and dissolve it to air. Press NEXT to begin. |
| `L4-l4-switch-to-me1-recall2.instruction` | Drive | Switch to ME 1. |
| `L4-l4-switch-to-me1-recall2.hint` | Hint | Press ME 1. |
| `L4-l4-recall-macro2.instruction` | Drive | Recall ME 1 Macro 2. |
| `L4-l4-recall-macro2.hint` | Hint | Press RECALL then slot 2 in the ME1 row. |
| `L4-l4-switch-to-mepp-final.instruction` | Drive | Switch back to ME P/P. |
| `L4-l4-switch-to-mepp-final.hint` | Hint | Press ME P/P. |
| `L4-l4-ready-me1-quad.instruction` | Drive | Set ME1 on Preview. |
| `L4-l4-ready-me1-quad.hint` | Hint | Select ME1 in the Preview row. |
| `L4-l4-dissolve-me1-quad.instruction` | Drive | Dissolve ME1 to Program. |
| `L4-l4-dissolve-me1-quad.hint` | Hint | Press AUTO. |
| `L4-l4-ready-blk-final.instruction` | Drive | Set BLK on Preview. |
| `L4-l4-ready-blk-final.hint` | Hint | Select BLK in the Preview row. |
| `L4-l4-dissolve-to-black.instruction` | Drive | Dissolve to black. |
| `L4-l4-dissolve-to-black.hint` | Hint | Press AUTO. |
| `L4-l4-complete.instruction` | Watch | Lesson 4 complete! You can now build ME 1 composites, store and recall them as macros, and use them as live key sources. You're ready for the Expert quiz. |

## Quiz Banks

### Level 1 - Beginner Bank

| Ref ID | Text |
| --- | --- |
| `Q-B1-01.prompt` | Ready GFX. Take GFX. |
| `Q-B1-02.prompt` | Set GFX. Dissolve to GFX. |
| `Q-B1-03.prompt` | Ready CPU. Take CPU. |
| `Q-B1-04.prompt` | Set CPU. Dissolve to CPU. |
| `Q-B1-05.prompt` | Ready CAM 1. Take CAM 1. |
| `Q-B1-06.prompt` | Set CAM 1. Dissolve to CAM 1. |
| `Q-B1-07.prompt` | Ready CAM 2. Take CAM 2. |
| `Q-B1-08.prompt` | Set CAM 2. Dissolve to CAM 2. |
| `Q-B1-09.prompt` | Ready CAM 3. Take CAM 3. |
| `Q-B1-10.prompt` | Set CAM 3. Dissolve to CAM 3. |
| `Q-B1-11.prompt` | Ready BLK. Take BLK. |
| `Q-B1-12.prompt` | Set BLK. Dissolve to BLK. |
| `Q-B1-13.prompt` | Ready M1. Take M1. |
| `Q-B1-14.prompt` | Set M1. Dissolve to M1. |
| `Q-B1-15.prompt` | Ready M2. Take M2. |
| `Q-B1-16.prompt` | Set M2. Dissolve to M2. |
| `Q-B1-17.prompt` | Ready ME1. Take ME1. |
| `Q-B1-18.prompt` | Set ME1. Dissolve to ME1. |
| `Q-B1-19.prompt` | Ready BARS. Take BARS. |
| `Q-B1-20.prompt` | Set BARS. Dissolve to BARS. |

### Level 2 - Keying & Graphics Bank

| Ref ID | Text |
| --- | --- |
| `Q-B2-01.prompt` | Load Side Graphic to M1. Set Key 1 with M1, self key. |
| `Q-B2-02.prompt` | Load Live Bug to M1. Set Key 1 with M1, chroma blue. |
| `Q-B2-03.prompt` | Load OTS to M2. Set Key 1 with M2, chroma green. |
| `Q-B2-04.prompt` | Load Full Screen Graphic to M1. Set Key 1 with M1, luma key. |
| `Q-B2-05.prompt` | Load Side Graphic to M1. Set Key 1 with M1, self key. Preview Key 1. |
| `Q-B2-06.prompt` | Load Live Bug to M1. Set Key 1 with M1, chroma blue. Preview Key 1. |
| `Q-B2-07.prompt` | Load OTS to M2. Set Key 1 with M2, chroma green. Preview Key 1. |
| `Q-B2-08.prompt` | Load Side Graphic to M1. Set Key 1 with M1, self key. Take CAM 1 with Key 1. |
| `Q-B2-09.prompt` | Load Side Graphic to M2. Set Key 1 with M2, self key. Dissolve to CAM 3 with Key 1. |
| `Q-B2-10.prompt` | Load Live Bug to M1. Set Key 1 with M1, chroma blue. Dissolve to CPU with Key 1. |
| `Q-B2-11.prompt` | Load OTS to M2. Set Key 1 with M2, chroma green. Take CAM 2 with Key 1. |
| `Q-B2-12.prompt` | Load Full Screen Graphic to M1. Set Key 1 with M1, luma key. Take CAM 1 with Key 1. |
| `Q-B2-13.prompt` | Set Key 1 with M1, self key. Take Key 1. |
| `Q-B2-14.prompt` | Set Key 1 with M2, self key. Auto Key 1 on. |
| `Q-B2-15.prompt` | Load Side Graphic to M1. Set Key 2 with M1, self key. Take CAM 3 with Key 2. |
| `Q-B2-16.prompt` | Load Live Bug to M2. Set Key 2 with M2, chroma blue. Dissolve to CAM 1 with Key 2. |
| `Q-B2-17.prompt` | Load OTS to M2. Set Key 3 with M2, chroma green. Take CPU with Key 3. |
| `Q-B2-18.prompt` | Load OTS to M1. Set Key 1 with M1, chroma green. Take CAM 3 with Key 1. |
| `Q-B2-19.prompt` | Set Key 1 with M1, self key. Preview Key 1. |
| `Q-B2-20.prompt` | Set Key 1 with M2, self key. Preview Key 1. |

### Level 3 - Advanced Bank

| Ref ID | Text |
| --- | --- |
| `Q-B3-01.prompt` | Set Key 1 with CPU. DVE Key 1 on. Move it bottom right. |
| `Q-B3-02.prompt` | Set Key 1 with CPU. DVE Key 1 on. Move it top left. |
| `Q-B3-03.prompt` | Set Key 1 with CPU. DVE Key 1 on. Move it top right. |
| `Q-B3-04.prompt` | Set Key 1 with CPU. DVE Key 1 on. Move it bottom left. |
| `Q-B3-05.prompt` | Set Key 1 with CPU. DVE Key 1 on. Scale it up and move it left. |
| `Q-B3-06.prompt` | Load Side Graphic to M1. Set Key 1 with M1, self key. DVE Key 1 on. |
| `Q-B3-07.prompt` | Set Key 1 with CPU. DVE Key 1 on. Preview Key 1. |
| `Q-B3-08.prompt` | Set Key 1 with CPU. Preview Key 1. Take CAM 2 with Key 1. |
| `Q-B3-09.prompt` | Set Key 1 with CPU. Preview Key 1. Dissolve to CAM 1 with Key 1. |
| `Q-B3-10.prompt` | Set Key 2 with CPU. DVE Key 2 on. Move it bottom left. |
| `Q-B3-11.prompt` | Set Key 2 with CPU. DVE Key 2 on. Move it right. |
| `Q-B3-12.prompt` | Set Key 2 with CPU. Preview Key 2. Take CAM 3 with Key 2. |
| `Q-B3-13.prompt` | Set Key 2 with CPU. Preview Key 2. Dissolve to CAM 1 with Key 2. |
| `Q-B3-14.prompt` | Set Key 3 with CPU. DVE Key 3 on. Scale it up and move it left. |
| `Q-B3-15.prompt` | Set Key 3 with CPU. Preview Key 3. Take CAM 2 with Key 3. |
| `Q-B3-16.prompt` | Load OTS to M2. Set Key 1 with M2, chroma green. Preview Key 1. |
| `Q-B3-17.prompt` | Load OTS to M2. Set Key 1 with M2, chroma green. Dissolve to BLK with Key 1. |
| `Q-B3-18.prompt` | Load Full Screen Graphic to M1. Set Key 3 with M1, luma key. Auto Key 3 on. |
| `Q-B3-19.prompt` | Set Key 1 with CPU. DVE Key 1 on. Move it center. |
| `Q-B3-20.prompt` | Load Live Bug to M1. Set Key 1 with M1, chroma blue. Preview Key 1. |

### Level 4 - Expert Bank

| Ref ID | Text |
| --- | --- |
| `Q-B4-01.prompt` | Switch to ME 1. Take BLK. Build a CAM 3 \| CAM 1 side-by-side with DVE, crop, and borders. |
| `Q-B4-02.prompt` | Switch to ME 1. Take BLK. Build a quad of CAM 1, CAM 2, CAM 3, and CPU with DVE, crop, and borders. |
| `Q-B4-03.prompt` | Switch to ME 1. Build a CAM 3 \| CAM 1 side-by-side. Store it to ME 1 Macro 1. |
| `Q-B4-04.prompt` | Switch to ME 1. Build a quad composite. Store it to ME 1 Macro 2. |
| `Q-B4-05.prompt` | Switch to ME 1. Build a CAM 3 \| CAM 1 side-by-side. Store it to ME 1 Macro 3. |
| `Q-B4-06.prompt` | Switch to ME 1. Build a CAM 3 \| CAM 1 side-by-side. Switch back to ME P/P. |
| `Q-B4-07.prompt` | Switch to ME 1. Build a quad composite. Switch back to ME P/P. |
| `Q-B4-08.prompt` | Switch to ME P/P. Ready ME1. Take ME1. |
| `Q-B4-09.prompt` | Switch to ME P/P. Set ME1. Dissolve to ME1. |
| `Q-B4-10.prompt` | Set Key 1 with ME1. DVE Key 1 on. Move it bottom right. |
| `Q-B4-11.prompt` | Set Key 1 with ME1. DVE Key 1 on. Move it top left. |
| `Q-B4-12.prompt` | Set Key 2 with ME1. DVE Key 2 on. Move it bottom left. |
| `Q-B4-13.prompt` | Set Key 3 with ME1. DVE Key 3 on. Move it top right. |
| `Q-B4-14.prompt` | Set Key 4 with ME1. DVE Key 4 on. Move it right. |
| `Q-B4-15.prompt` | Set Key 1 with ME1. Preview Key 1. Take CAM 2 with Key 1. |
| `Q-B4-16.prompt` | Set Key 1 with ME1. Preview Key 1. Dissolve to CAM 3 with Key 1. |
| `Q-B4-17.prompt` | Set Key 2 with ME1. Preview Key 2. Take CAM 1 with Key 2. |
| `Q-B4-18.prompt` | Set Key 2 with ME1. Preview Key 2. Dissolve to CPU with Key 2. |
| `Q-B4-19.prompt` | Set Key 3 with ME1. Preview Key 3. Take CAM 2 with Key 3. |
| `Q-B4-20.prompt` | Set Key 4 with ME1. Preview Key 4. Dissolve to CAM 1 with Key 4. |

## Run The Show

### Run The Show - Level 1

| Ref ID | Text |
| --- | --- |
| `Q-RTS1-01.prompt` | Set GFX. Dissolve to GFX. |
| `Q-RTS1-02.prompt` | Ready CPU. Take CPU. |
| `Q-RTS1-03.prompt` | Set CAM 1. Dissolve to CAM 1. |
| `Q-RTS1-04.prompt` | Ready CAM 2. Take CAM 2. |
| `Q-RTS1-05.prompt` | Set CAM 3. Dissolve to CAM 3. |
| `Q-RTS1-06.prompt` | Ready CPU. Take CPU. |
| `Q-RTS1-07.prompt` | Set CAM 1. Dissolve to CAM 1. |
| `Q-RTS1-08.prompt` | Ready CAM 2. Take CAM 2. |
| `Q-RTS1-09.prompt` | Set CAM 3. Dissolve to CAM 3. |
| `Q-RTS1-10.prompt` | Set BLK. Dissolve to BLK. |

### Run The Show - Level 2

| Ref ID | Text |
| --- | --- |
| `Q-RTS2-01.prompt` | Set GFX. Dissolve to GFX. |
| `Q-RTS2-02.prompt` | Ready CAM 1. Take CAM 1. |
| `Q-RTS2-03.prompt` | Load Side Graphic to M1. Set Key 1 with M1, self key. |
| `Q-RTS2-04.prompt` | Preview Key 1. |
| `Q-RTS2-05.prompt` | Set CAM 1. Dissolve to CAM 1 with Key 1. |
| `Q-RTS2-06.prompt` | Lose Key 1 tie. |
| `Q-RTS2-07.prompt` | Ready CAM 2. Take CAM 2 under Key 1. |
| `Q-RTS2-08.prompt` | Take Key 1 off. |
| `Q-RTS2-09.prompt` | Load Live Bug to M1. Set Key 1 with M1, chroma blue. |
| `Q-RTS2-10.prompt` | Preview Key 1. |
| `Q-RTS2-11.prompt` | Set CPU. Dissolve to CPU with Key 1. |
| `Q-RTS2-12.prompt` | Lose Key 1 tie. |
| `Q-RTS2-13.prompt` | Ready CAM 3. Take CAM 3 under Key 1. |
| `Q-RTS2-14.prompt` | Auto Key 1 off. |
| `Q-RTS2-15.prompt` | Set BLK. Dissolve to BLK. |

### Run The Show - Level 3

| Ref ID | Text |
| --- | --- |
| `Q-RTS3-01.prompt` | Switch to ME 1. |
| `Q-RTS3-02.prompt` | Take BLK on ME 1. |
| `Q-RTS3-03.prompt` | Build a CAM 3 \| CAM 1 side-by-side with DVE, crop, and borders on ME 1. |
| `Q-RTS3-04.prompt` | Switch to ME P/P. |
| `Q-RTS3-05.prompt` | Ready ME1. Take ME1. |
| `Q-RTS3-06.prompt` | Ready CAM 2. Take CAM 2. |
| `Q-RTS3-07.prompt` | Set Key 1 with ME1. |
| `Q-RTS3-08.prompt` | DVE Key 1 on. Size it down and move it bottom right. |
| `Q-RTS3-09.prompt` | Preview Key 1. |
| `Q-RTS3-10.prompt` | Set CAM 1. Dissolve to CAM 1 with Key 1. |
| `Q-RTS3-11.prompt` | Auto Key 1 off. |
| `Q-RTS3-12.prompt` | Switch to ME 1. |
| `Q-RTS3-13.prompt` | Take BLK on ME 1. |
| `Q-RTS3-14.prompt` | Build a quad of CAM 1, CAM 2, CAM 3, and CPU with DVE, crop, and borders on ME 1. |
| `Q-RTS3-15.prompt` | Switch to ME P/P. |
| `Q-RTS3-16.prompt` | Set ME1. Dissolve to ME1. |
| `Q-RTS3-17.prompt` | Set BLK. Dissolve to BLK. |

### Run The Show - Level 4

| Ref ID | Text |
| --- | --- |
| `Q-RTS4-01.prompt` | Switch to ME 1. |
| `Q-RTS4-02.prompt` | Take BLK on ME 1. |
| `Q-RTS4-03.prompt` | Build a CAM 3 \| CAM 1 side-by-side with DVE, crop, and borders on ME 1. |
| `Q-RTS4-04.prompt` | Store that side-by-side to ME 1 Macro 1. |
| `Q-RTS4-05.prompt` | Take BLK on ME 1 again. |
| `Q-RTS4-06.prompt` | Build a quad of CAM 1, CAM 2, CAM 3, and CPU with DVE, crop, and borders on ME 1. |
| `Q-RTS4-07.prompt` | Store that quad to ME 1 Macro 2. |
| `Q-RTS4-08.prompt` | Recall ME 1 Macro 1. |
| `Q-RTS4-09.prompt` | Switch to ME P/P. |
| `Q-RTS4-10.prompt` | Ready ME1. Take ME1. |
| `Q-RTS4-11.prompt` | Ready CAM 2. Take CAM 2. |
| `Q-RTS4-12.prompt` | Set Key 1 with ME1. DVE Key 1 on. Size it down and move it bottom right. |
| `Q-RTS4-13.prompt` | Preview Key 1. |
| `Q-RTS4-14.prompt` | Set CAM 1. Dissolve to CAM 1 with Key 1. |
| `Q-RTS4-15.prompt` | Auto Key 1 off. |
| `Q-RTS4-16.prompt` | Switch to ME 1 and recall ME 1 Macro 2. |
| `Q-RTS4-17.prompt` | Switch back to ME P/P. |
| `Q-RTS4-18.prompt` | Set ME1. Dissolve to ME1. |

## UI Prompts

| Ref ID | Text |
| --- | --- |
| `UI-vo-preview.prompt` | Voice over is on. Heart voice is ready. |
| `UI-quiz-name.prompt` | Quiz Mode. Enter your name and class, or choose Practice Quiz to continue without submitting results. |
| `UI-quiz-select.prompt` | Select a quiz. Choose a Quiz Bank level, or choose Run the Show for live director calls. |
| `UI-lesson-name.prompt` | Guided Lessons. Enter your name and class, or leave either field blank to practice without submitting results. |
| `UI-lesson-select.prompt` | Guided Lessons. Choose a lesson to begin step-by-step training. |

## Backend Direction

A full backend would be useful once this text needs non-technical editing. The cleanest next step would be to move lessons and quiz banks from `script.js` into versioned JSON files first. After that, an admin backend can edit the JSON and the app can validate each item against its required check logic. This keeps instructional text editable without risking the simulator mechanics.

For voice narration, see `docs/tts-backend-plan.md`. The recommended direction is backend-generated, cached Kokoro audio keyed to these same reference IDs.
