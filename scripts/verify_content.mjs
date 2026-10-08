#!/usr/bin/env node
// Drives every lesson DRIVE step, quiz-bank item and Run-the-Show step
// headlessly and checks that the canonical solution in
// scripts/content-solutions.json satisfies the app's own check logic.
//
//   npm install                      (once; installs jsdom)
//   node scripts/verify_content.mjs  [--only lessons|banks|rts] [--level bank-2]
//
// Solutions file shape:
//   {
//     "lessons": { "2": { "<stepId>": ["selectPvw(0)", "doCut()"] , ... } },
//     "banks":   { "bank-2": [ { "actions": [...], "overdo": [...] }, ... ] },
//     "rts":     { "rts-2": [ { "actions": [...] }, ... ] }
//   }
// Each action is a JavaScript expression evaluated in the app window
// (window functions such as selectPvw, doCut, togglePreviewKey, selectDSK,
// selectDSKSource, selectKeyMode, setChrColor, dskCutChannel, dskAutoChannel,
// assignMediaToBank, switchSurface, ...). Promises are awaited. "overdo" lists
// extra actions that must make a quiz check FAIL (for partial commands).

import fs from 'node:fs';
import path from 'node:path';
import { ROOT, loadApp } from './lib/headless-app.mjs';

const args = process.argv.slice(2);
const only = args.includes('--only') ? args[args.indexOf('--only') + 1] : null;
const levelFilter = args.includes('--level') ? args[args.indexOf('--level') + 1] : null;
const solutionsPath = path.join(ROOT, 'scripts', 'content-solutions.json');
const solutions = JSON.parse(fs.readFileSync(solutionsPath, 'utf8'));

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const failures = [];
let passes = 0;

function fail(message) {
  failures.push(message);
  console.log(`  FAIL ${message}`);
}

async function runActions(w, actions, label) {
  for (const action of actions || []) {
    try {
      const result = w.eval(action);
      if (result && typeof result.then === 'function') await result;
    } catch (error) {
      fail(`${label}: action "${action}" threw ${error.message}`);
      return false;
    }
    await sleep(20);
  }
  return true;
}

async function settle(w) {
  // DSK auto is 400 ms, dissolve is 1 s, lesson advance timer is 600 ms.
  await sleep(1300);
}

async function verifyLessons(w) {
  const hooks = w.SwitchUpTestHooks;
  for (const lessonId of Object.keys(solutions.lessons || {})) {
    if (levelFilter && levelFilter !== `lesson-${lessonId}`) continue;
    console.log(`Lesson ${lessonId}`);
    const steps = hooks.getLessonSteps(Number(lessonId));
    const driveSteps = steps.filter((step) => !step.watchOnly);
    const stepSolutions = solutions.lessons[lessonId];
    hooks.setQuizMode(false);
    w.dismissWelcome();
    hooks.startLessonDrive(Number(lessonId));
    await sleep(50);

    let expectedIndex = 0;
    let guard = 0;
    while (hooks.isLessonActive() && guard++ < 300) {
      const stepId = hooks.currentLessonStepId();
      if (!stepId) break;
      const expected = driveSteps[expectedIndex];
      if (!expected) break;
      if (expected.id !== stepId) {
        fail(`lesson ${lessonId}: expected step "${expected.id}" but the lesson is on "${stepId}" (a step was auto-skipped or the order changed)`);
        expectedIndex = driveSteps.findIndex((step) => step.id === stepId);
        if (expectedIndex < 0) break;
      }
      const actions = stepSolutions[stepId];
      if (!actions) {
        fail(`lesson ${lessonId}: no solution for step "${stepId}"`);
        break;
      }
      const ok = await runActions(w, actions, `lesson ${lessonId} step ${stepId}`);
      await settle(w);
      if (!ok) break;
      const after = hooks.currentLessonStepId();
      const stillActive = hooks.isLessonActive();
      const resultsShown = w.document.getElementById('lesson-results-overlay')?.classList.contains('show');
      if (after === stepId && stillActive && !resultsShown) {
        fail(`lesson ${lessonId}: step "${stepId}" did not advance after its solution`);
        break;
      }
      passes += 1;
      expectedIndex += 1;
      if (resultsShown || !stillActive) break;
    }
    const log = hooks.getLessonStepLog();
    if (log.length !== driveSteps.length) {
      fail(`lesson ${lessonId}: completed ${log.length} of ${driveSteps.length} drive steps`);
    } else {
      console.log(`  ok: ${log.length} drive steps completed`);
    }
    try { w.exitLessonMode(); } catch (error) { /* ignore */ }
    const leave = w.document.getElementById('confirm-leave-btn');
    if (leave) leave.click();
    await sleep(50);
  }
}

async function verifyBanks(w) {
  const hooks = w.SwitchUpTestHooks;
  for (const level of Object.keys(solutions.banks || {})) {
    if (levelFilter && levelFilter !== level) continue;
    console.log(`Quiz ${level}`);
    const items = hooks.getQuizItems(level);
    const itemSolutions = solutions.banks[level];
    if (items.length !== itemSolutions.length) fail(`${level}: ${items.length} items but ${itemSolutions.length} solutions`);
    for (let index = 0; index < Math.min(items.length, itemSolutions.length); index += 1) {
      const item = items[index];
      const solution = itemSolutions[index];
      const label = `${level} #${String(index + 1).padStart(2, '0')} "${item.prompt}"`;
      hooks.setQuizMode(true);
      hooks.resetSwitcherState();
      await sleep(30);
      if (item.check()) {
        fail(`${label}: check is already true on a fresh switcher`);
        continue;
      }
      const ok = await runActions(w, solution.actions, label);
      await sleep(1300);
      if (!ok) continue;
      if (!item.check()) {
        fail(`${label}: check is false after the solution`);
        continue;
      }
      if (solution.overdo && solution.overdo.length) {
        const overOk = await runActions(w, solution.overdo, `${label} (overdo)`);
        await sleep(1300);
        if (overOk && item.check()) {
          fail(`${label}: check still passes after over-doing it (${solution.overdo.join('; ')})`);
          continue;
        }
      }
      passes += 1;
    }
    hooks.setQuizMode(false);
    hooks.resetSwitcherState();
  }
}

async function verifyRts(w) {
  const hooks = w.SwitchUpTestHooks;
  for (const level of Object.keys(solutions.rts || {})) {
    if (levelFilter && levelFilter !== level) continue;
    console.log(`Run the Show ${level}`);
    const items = hooks.getRtsItems(level);
    const itemSolutions = solutions.rts[level];
    if (items.length !== itemSolutions.length) fail(`${level}: ${items.length} steps but ${itemSolutions.length} solutions`);
    hooks.setQuizMode(true);
    hooks.resetSwitcherState();
    await sleep(30);
    for (let index = 0; index < Math.min(items.length, itemSolutions.length); index += 1) {
      const item = items[index];
      const solution = itemSolutions[index];
      const label = `${level} #${String(index + 1).padStart(2, '0')} "${item.prompt}"`;
      if (item.check()) {
        fail(`${label}: step is already satisfied before the student does anything`);
      }
      const ok = await runActions(w, solution.actions, label);
      await sleep(1300);
      if (!ok) break;
      if (!item.check()) {
        fail(`${label}: check is false after the solution`);
        break;
      }
      passes += 1;
    }
    hooks.setQuizMode(false);
    hooks.resetSwitcherState();
  }
}

const w = loadApp();
if (!w.SwitchUpTestHooks) throw new Error('script.js did not expose window.SwitchUpTestHooks');
w.dismissWelcome();

if (!only || only === 'lessons') await verifyLessons(w);
if (!only || only === 'banks') await verifyBanks(w);
if (!only || only === 'rts') await verifyRts(w);

console.log(`\n${passes} passed, ${failures.length} failed`);
process.exit(failures.length ? 1 : 0);
