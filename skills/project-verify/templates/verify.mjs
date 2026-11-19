// Browser verification (puppeteer-core + installed Chrome).
//
//   node scripts/verify/verify.mjs --theme <theme> [--url <base url>] [--only 01,02] [--date _scratch]
//
// Writes screenshots, meta.json and report.md to docs/verify/<DATE>/<theme>/.
// Optional secrets come from scripts/verify/.env.local (git-ignored), never printed.
// Steps are independent: a failing step is recorded with a FAIL-<id>.png and the run goes on.
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DATE_FORMAT = '{{DATE_FORMAT}}'; // tokens: YYYY, YY, MM, DD
const EVIDENCE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../docs/verify');

const arg = (name, fallback) =>
{
    const i = process.argv.indexOf('--' + name);
    return i > -1 ? process.argv[i + 1] : fallback;
};
const pad = (n) => String(n).padStart(2, '0');
const formatDate = (fmt, d = new Date()) =>
    fmt.replace('YYYY', d.getFullYear()).replace('YY', pad(d.getFullYear() % 100)).replace('MM', pad(d.getMonth() + 1)).replace('DD', pad(d.getDate()));

function loadEnv()
{
    const file = path.join(path.dirname(fileURLToPath(import.meta.url)), '.env.local');
    if (!fs.existsSync(file)) return {};
    return Object.fromEntries(fs.readFileSync(file, 'utf8').split(/\r?\n/).filter((l) => l && !l.startsWith('#')).map((l) => l.split(/=(.*)/s).slice(0, 2)));
}

function findChrome()
{
    const candidates = [
        process.env.CHROME_PATH,
        'C:/Program Files/Google/Chrome/Application/chrome.exe',
        'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
        '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        '/usr/bin/google-chrome',
        '/usr/bin/chromium',
    ];
    const found = candidates.find((c) => c && fs.existsSync(c));
    if (!found) throw new Error('Chrome not found: set CHROME_PATH');
    return found;
}

const theme = arg('theme', 'general');
const baseUrl = arg('url', loadEnv().BASE_URL ?? 'http://localhost:3000');
const only = arg('only') ? arg('only').split(',') : null;
const date = arg('date', formatDate(DATE_FORMAT));
const outDir = path.join(EVIDENCE_ROOT, date, theme);
fs.mkdirSync(outDir, { recursive: true });

const meta = { theme, date, baseUrl, startedAt: new Date().toISOString(), chrome: null, steps: [] };
const browser = await puppeteer.launch({ executablePath: findChrome(), headless: true, args: ['--no-sandbox'], defaultViewport: { width: 1440, height: 900 } });
meta.chrome = await browser.version();

// One page with its console errors and failed requests collected from the start.
async function openPage(url, viewport)
{
    const page = await browser.newPage();
    if (viewport) await page.setViewport(viewport);
    page.problems = [];
    page.on('pageerror', (e) => page.problems.push('pageerror: ' + String(e.message).slice(0, 200)));
    page.on('console', (m) => m.type() === 'error' && page.problems.push('console: ' + m.text().slice(0, 200)));
    page.on('requestfailed', (r) => page.problems.push('request failed: ' + r.url().split('?')[0]));
    page.on('response', (r) => r.status() >= 400 && page.problems.push(`HTTP ${r.status()}: ${r.url().split('?')[0]}`));
    await page.goto(url, { waitUntil: 'networkidle2' });
    return page;
}

async function step(id, title, fn)
{
    if (only && !only.includes(id)) return;
    const started = Date.now();
    const rec = { id, title, status: 'pass', shots: [], checks: {}, notes: [] };
    let current = null;
    const shot = async (page, name, opts = {}) =>
    {
        current = page;
        const file = `${id}-${name}.png`;
        await page.screenshot({ path: path.join(outDir, file), ...opts });
        rec.shots.push(file);
    };
    try
    {
        await fn({ rec, shot, open: async (url, viewport) => (current = await openPage(url, viewport)) });
    }
    catch (e)
    {
        rec.status = 'fail';
        rec.error = String((e && e.message) || e).slice(0, 400);
        if (current)
        {
            try { await current.screenshot({ path: path.join(outDir, `FAIL-${id}.png`) }); rec.shots.push(`FAIL-${id}.png`); } catch { /* page is gone */ }
        }
    }
    if (Object.values(rec.checks).some((v) => v === false)) rec.status = 'fail';
    rec.ms = Date.now() - started;
    meta.steps.push(rec);
    const failed = Object.entries(rec.checks).filter(([, v]) => v === false).map(([k]) => ` [x ${k}]`).join('');
    console.log(`${rec.status.toUpperCase().padEnd(4)} ${id} ${title}${rec.error ? ' :: ' + rec.error : ''}${failed}`);
}

// ---------------------------------------------------------------- steps (replace with your own)

await step('01', 'Page loads, desktop', async ({ rec, shot, open }) =>
{
    const page = await open(baseUrl);
    rec.checks.hasTitle = (await page.title()).length > 0;
    rec.checks.noPageProblems = page.problems.length === 0;
    if (page.problems.length) rec.notes.push(...page.problems);
    await shot(page, 'desktop');
    await page.close();
});

await step('02', 'Page loads, mobile', async ({ rec, shot, open }) =>
{
    const page = await open(baseUrl, { width: 390, height: 844, isMobile: true });
    rec.checks.noHorizontalScroll = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);
    await shot(page, 'mobile');
    await page.close();
});

// ----------------------------------------------------------------

await browser.close();
const failed = meta.steps.filter((s) => s.status === 'fail');
meta.summary = { steps: meta.steps.length, passed: meta.steps.length - failed.length, failed: failed.length };
fs.writeFileSync(path.join(outDir, 'meta.json'), JSON.stringify(meta, null, 2));
fs.writeFileSync(path.join(outDir, 'report.md'), [
    `# ${theme} (${date})`,
    '',
    `${meta.summary.passed}/${meta.summary.steps} steps passed. Chrome ${meta.chrome}. ${baseUrl}`,
    '',
    '| Step | Result | Checks | Evidence |',
    '|---|---|---|---|',
    ...meta.steps.map((s) => `| ${s.id} ${s.title} | ${s.status} | ${Object.entries(s.checks).map(([k, v]) => `${v ? 'ok' : 'FAIL'} ${k}`).join(', ')} | ${s.shots.join(', ')} |`),
    '',
].join('\n'));
console.log(`\n${meta.summary.passed}/${meta.summary.steps} passed -> ${path.relative(process.cwd(), outDir)}`);
process.exit(failed.length ? 1 : 0);
