// Loads SwitchUp Studio (index.html + script.js) in jsdom so Node tooling can
// read the lesson/quiz data and drive the switcher without a browser.
// Images "load" instantly (no pixels), canvases are inert, audio is silent.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

export function loadApp() {
  let html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  html = html.replace(/<script[^>]*src=[^>]*><\/script>/g, '');
  html = html.replace(/<script type="module">[\s\S]*?<\/script>/g, '');

  const dom = new JSDOM(html, { runScripts: 'outside-only', pretendToBeVisual: true, url: 'http://localhost:8080/' });
  const w = dom.window;

  w.fetch = () => Promise.reject(new Error('fetch disabled in headless mode'));
  w.matchMedia = w.matchMedia || (() => ({ matches: false, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} }));
  w.ResizeObserver = w.ResizeObserver || class { observe() {} unobserve() {} disconnect() {} };
  w.HTMLCanvasElement.prototype.getContext = () => null;
  w.HTMLMediaElement.prototype.pause = () => {};
  w.HTMLMediaElement.prototype.load = () => {};
  w.HTMLMediaElement.prototype.play = () => Promise.resolve();
  w.console.warn = () => {};

  // jsdom never fires load events for images; the app awaits them before
  // every transition, so resolve them on the next tick instead.
  w.Image = function HeadlessImage() {
    const img = w.document.createElement('img');
    let src = '';
    Object.defineProperty(img, 'src', {
      configurable: true,
      get() { return src; },
      set(value) {
        src = String(value || '');
        img.setAttribute('src', src);
        setTimeout(() => {
          Object.defineProperty(img, 'naturalWidth', { value: 1920, configurable: true });
          Object.defineProperty(img, 'naturalHeight', { value: 1080, configurable: true });
          Object.defineProperty(img, 'complete', { value: true, configurable: true });
          if (typeof img.onload === 'function') img.onload();
        }, 0);
      },
    });
    return img;
  };

  w.eval(fs.readFileSync(path.join(ROOT, 'script.js'), 'utf8'));
  return w;
}
