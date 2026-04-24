/**
 * build.mjs — Assembles public/index.html from src/ source files.
 *
 * Usage:
 *   node build.mjs
 *   npm run build
 *
 * Structure:
 *   src/template.html   — HTML skeleton with <!-- BUILD:CSS --> and <!-- BUILD:JS --> placeholders
 *   src/styles.css      — all CSS extracted from the original <style> block
 *   src/js/01-config.js through 22-pipeline.js — JS split by responsibility
 *
 * The build concatenates all JS files in order into a single <script> block,
 * and inlines the CSS into a <style> block. No ES module bundler needed.
 * All variables remain global — just split for readability and maintainability.
 */

import { readFileSync, writeFileSync } from 'fs';

const JS_FILES = [
  'src/js/01-config.js',
  'src/js/02-cache.js',
  'src/js/03-utils.js',
  'src/js/04-api.js',
  'src/js/05-fallbacks.js',
  'src/js/06-ui.js',
  'src/js/07-render-01.js',
  'src/js/08-render-02.js',
  'src/js/09-render-03.js',
  'src/js/10-render-04.js',
  'src/js/11-render-05.js',
  'src/js/12-render-06.js',
  'src/js/13-render-07.js',
  'src/js/14-render-08.js',
  'src/js/15-render-09.js',
  'src/js/16-render-10.js',
  'src/js/17-render-11.js',
  'src/js/18-render-12.js',
  'src/js/19-render-13.js',
  'src/js/20-render-14.js',
  'src/js/21-render-15.js',
  'src/js/22-pipeline.js',
  'src/js/23-drilldown.js',
];

const CSS_FILES = ['src/styles.css'];

// Read template HTML
let html = readFileSync('src/template.html', 'utf8');

// Inline CSS
const css = CSS_FILES.map(f => readFileSync(f, 'utf8')).join('\n');
// Use a function as the replacement to avoid special $-patterns in String.replace
html = html.replace('<!-- BUILD:CSS -->', () => `<style>\n${css}\n</style>`);

// Inline JS
const js = JS_FILES.map(f => readFileSync(f, 'utf8')).join('\n\n');
html = html.replace('<!-- BUILD:JS -->', () => `<script>\n${js}\n</script>`);

writeFileSync('public/index.html', html);
console.log(`Built public/index.html (${Buffer.byteLength(html)} bytes, ${html.split('\n').length} lines)`);
