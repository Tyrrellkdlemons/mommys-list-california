import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, "..");
const failures = [];
const warnings = [];

function check(condition, message) {
  if (!condition) failures.push(message);
}

function warn(condition, message) {
  if (!condition) warnings.push(message);
}

function read(relativePath) {
  return fs.readFileSync(path.join(projectRoot, relativePath), "utf8");
}

function sha256(bytes) {
  return crypto.createHash("sha256").update(bytes).digest("hex");
}

function markdownFiles(directory) {
  const result = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === ".git" || entry.name === ".netlify" || entry.name === "node_modules") continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) result.push(...markdownFiles(absolute));
    if (entry.isFile() && entry.name.toLowerCase().endsWith(".md")) result.push(absolute);
  }
  return result;
}

const requiredFiles = [
  "index.html",
  "README.md",
  "START_HERE.txt",
  ".gitignore",
  "assets/branding/mommys-list-logo-original.jpg",
  "assets/branding/README.md",
  "docs/README.md",
  "docs/OWNER_GUIDE.md",
  "docs/EDITING_GUIDE.md",
  "docs/RELEASE_GUIDE.md",
  "docs/TROUBLESHOOTING.md",
  "docs/TECHNICAL_REFERENCE.md",
  "docs/RESOURCE_CATALOG.md",
  "docs/PROJECT_HISTORY.md",
  "scripts/verify-project.mjs",
  "scripts/preview-local.ps1",
  "scripts/embed-logo.ps1",
  "scripts/deploy-netlify.ps1"
];

for (const relativePath of requiredFiles) {
  check(fs.existsSync(path.join(projectRoot, relativePath)), `Missing required project file: ${relativePath}`);
}

const rootHtmlFiles = fs.readdirSync(projectRoot, { withFileTypes: true })
  .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".html"))
  .map((entry) => entry.name);
check(rootHtmlFiles.length === 1 && rootHtmlFiles[0] === "index.html", "The repository root must contain one authoritative HTML file: index.html.");
check(!fs.existsSync(path.join(projectRoot, "Logo.jpg")), "The old root Logo.jpg still exists; keep the source under assets/branding only.");

const html = read("index.html");
check(/^\s*<!doctype html>/i.test(html), "index.html is missing a complete DOCTYPE.");
check(/<html\s+lang=["']en["']/i.test(html), "index.html must declare lang=\"en\".");
check(/<meta\s+charset=["']UTF-8["']/i.test(html), "index.html must declare UTF-8.");
check(/<meta\s+name=["']viewport["'][^>]*width=device-width/i.test(html), "index.html is missing its responsive viewport metadata.");

const inlineStyles = [...html.matchAll(/<style(?:\s[^>]*)?>([\s\S]*?)<\/style>/gi)];
const allScripts = [...html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/gi)];
const inlineScripts = allScripts.filter((match) => !/\bsrc\s*=/i.test(match[1]));
const externalScripts = allScripts.filter((match) => /\bsrc\s*=/i.test(match[1]));
check(inlineStyles.length === 1, `Expected one inline style block; found ${inlineStyles.length}.`);
check(inlineScripts.length === 1, `Expected one inline application script; found ${inlineScripts.length}.`);
check(externalScripts.length === 0, `Expected no external JavaScript; found ${externalScripts.length} external script tag(s).`);

const applicationScript = inlineScripts[0]?.[2] ?? "";
try {
  // Parse the checked-in browser program without executing it.
  new Function(applicationScript);
} catch (error) {
  failures.push(`Inline JavaScript does not parse: ${error.message}`);
}

const ids = [...html.matchAll(/\bid=["']([^"']+)["']/gi)].map((match) => match[1]);
const duplicateIds = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
check(duplicateIds.length === 0, `Duplicate DOM IDs: ${duplicateIds.join(", ")}`);
const idReferences = [...applicationScript.matchAll(/getElementById\(["']([^"']+)["']\)/g)].map((match) => match[1]);
const missingIdReferences = [...new Set(idReferences.filter((id) => !ids.includes(id)))];
check(missingIdReferences.length === 0, `Missing getElementById targets: ${missingIdReferences.join(", ")}`);

for (const section of ["home", "resources", "profile", "baby-shower"]) {
  check(new RegExp(`id=["']${section}["']`).test(html), `Missing #${section} section.`);
  check(new RegExp(`data-nav-section=["']${section}["']`).test(html), `Missing data-nav-section for ${section}.`);
  check(new RegExp(`data-nav-link=["']${section}["']`).test(html), `Missing data-nav-link for ${section}.`);
}

const resourceMatch = applicationScript.match(/var\s+RESOURCES\s*=\s*(\[[\s\S]*?\]);\s*var\s+SHOWER_ITEMS/);
const showerMatch = applicationScript.match(/var\s+SHOWER_ITEMS\s*=\s*(\[[\s\S]*?\]);\s*var\s+state/);
check(Boolean(resourceMatch), "Could not locate the static RESOURCES array.");
check(Boolean(showerMatch), "Could not locate the static SHOWER_ITEMS array.");

let resources = [];
let showerItems = [];
try {
  if (resourceMatch) resources = new Function(`return ${resourceMatch[1]}`)();
  if (showerMatch) showerItems = new Function(`return ${showerMatch[1]}`)();
} catch (error) {
  failures.push(`Could not evaluate static data arrays: ${error.message}`);
}

const expectedCategories = { government: 7, education: 5, childcare: 3, relationship: 4, health: 5 };
const categoryCounts = Object.fromEntries(Object.keys(expectedCategories).map((category) => [category, 0]));
const resourceTitles = new Set();
const resourceUrls = new Set();

check(resources.length === 24, `Expected 24 resources; found ${resources.length}.`);
resources.forEach((resource, index) => {
  const label = `Resource ${index + 1}`;
  check(resource && typeof resource === "object", `${label} is not an object.`);
  if (!resource || typeof resource !== "object") return;
  check(typeof resource.title === "string" && resource.title.trim().length > 0, `${label} is missing a title.`);
  check(typeof resource.description === "string" && resource.description.trim().length > 0, `${label} is missing a description.`);
  check(typeof resource.tag === "string" && resource.tag.trim().length > 0, `${label} is missing a tag.`);
  check(typeof resource.url === "string" && /^https:\/\//i.test(resource.url), `${label} must have an HTTPS URL.`);
  check(typeof resource.icon === "string" && /\bfa-(?:solid|regular|brands)\b/.test(resource.icon), `${label} has an invalid Font Awesome class.`);
  check(typeof resource.color === "string" && /^#[0-9a-f]{6}$/i.test(resource.color), `${label} has an invalid six-digit color.`);
  check(Object.hasOwn(expectedCategories, resource.category), `${label} has an unknown category: ${resource.category}`);
  if (Object.hasOwn(categoryCounts, resource.category)) categoryCounts[resource.category] += 1;
  if (resourceTitles.has(resource.title)) failures.push(`Duplicate resource title: ${resource.title}`);
  if (resourceUrls.has(resource.url)) failures.push(`Duplicate resource URL: ${resource.url}`);
  resourceTitles.add(resource.title);
  resourceUrls.add(resource.url);
});

for (const [category, expected] of Object.entries(expectedCategories)) {
  check(categoryCounts[category] === expected, `Expected ${expected} ${category} resources; found ${categoryCounts[category]}.`);
}
const mommyAndMe = resources.find((resource) => resource.title === "Mommy & Me Classes");
check(mommyAndMe?.dadTitle === "Dad & Me Classes", "Mommy & Me Classes must retain its Dad & Me alternate title.");

const expectedShowerIds = ["checklist", "registry", "cake", "decor", "photos", "bingo", "favors", "guests"];
check(showerItems.length === 8, `Expected eight Baby Shower items; found ${showerItems.length}.`);
const showerIds = showerItems.map((item) => item.id);
check(new Set(showerIds).size === showerIds.length, "Baby Shower item IDs must be unique.");
check(expectedShowerIds.every((id) => showerIds.includes(id)), `Baby Shower IDs must include: ${expectedShowerIds.join(", ")}.`);
showerItems.forEach((item, index) => {
  check(typeof item.emoji === "string" && item.emoji.length > 0, `Shower item ${index + 1} is missing an emoji.`);
  check(typeof item.title === "string" && item.title.trim().length > 0, `Shower item ${index + 1} is missing a title.`);
  check(typeof item.description === "string" && item.description.trim().length > 0, `Shower item ${index + 1} is missing a description.`);
});

check(/for\s*\(var\s+i\s*=\s*0;\s*i\s*<\s*22\s*;/.test(applicationScript), "The floating-world initializer must create exactly 22 emojis.");
for (const animation of ["fadeSlideUp", "pulseHeart", "cardFade", "toastIn", "toastOut"]) {
  check(new RegExp(`@keyframes\\s+${animation}\\b`).test(html), `Missing required animation: ${animation}.`);
}
for (const breakpoint of [1160, 768, 480]) {
  check(new RegExp(`@media\\s*\\(max-width:\\s*${breakpoint}px\\)`).test(html), `Missing ${breakpoint}px responsive breakpoint.`);
}
check(/prefers-reduced-motion:\s*reduce/.test(html), "Missing reduced-motion support.");
check(/history\.scrollRestoration\s*=\s*["']manual["']/.test(applicationScript), "Missing manual browser scroll-restoration ownership.");

for (const key of ["mommyslist_users_v2", "mommyslist_session_v2", "mommyslist_dad_mode", "mommyslist_shower_plan"]) {
  check(applicationScript.includes(key), `Missing browser storage key: ${key}`);
}

const externalLinks = [...html.matchAll(/<link[^>]+href=["'](https?:\/\/[^"']+)["']/gi)]
  .filter((match) => !/\brel=["']canonical["']/i.test(match[0]))
  .map((match) => match[1]);
const allowedExternalLink = /^(?:https:\/\/fonts\.googleapis\.com|https:\/\/fonts\.gstatic\.com|https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/font-awesome\/6\.5\.0\/css\/all\.min\.css)/;
for (const url of externalLinks) {
  check(allowedExternalLink.test(url), `Unexpected external presentation dependency: ${url}`);
}

const embeddedJpegs = [...html.matchAll(/data:image\/jpeg;base64,([A-Za-z0-9+/=]+)/g)];
check(embeddedJpegs.length === 1, `Expected one embedded JPEG source; found ${embeddedJpegs.length}.`);
const logoPath = path.join(projectRoot, "assets", "branding", "mommys-list-logo-original.jpg");
if (fs.existsSync(logoPath) && embeddedJpegs.length === 1) {
  const sourceLogo = fs.readFileSync(logoPath);
  const embeddedLogo = Buffer.from(embeddedJpegs[0][1], "base64");
  check(sourceLogo[0] === 0xff && sourceLogo[1] === 0xd8, "Brand source is not a valid JPEG file.");
  check(sha256(sourceLogo) === sha256(embeddedLogo), "The source JPG and embedded website logo differ. Run scripts/embed-logo.ps1 after confirming the source image.");
}
const mainLogoTag = html.match(/<img\b[^>]*\bid=["']mainLogo["'][^>]*>/i)?.[0] ?? "";
check(/\balt=(?:"[^"]{12,}"|'[^']{12,}')/i.test(mainLogoTag), "The main logo needs meaningful alternative text.");
check(/\bwidth=["']\d+["']/i.test(mainLogoTag) && /\bheight=["']\d+["']/i.test(mainLogoTag), "The main logo needs explicit width and height attributes.");
check(!html.includes("assets/branding/mommys-list-logo-original.jpg"), "index.html must not depend on the loose branding source at runtime.");

const gitignore = read(".gitignore");
check(/^\.netlify\/$/m.test(gitignore), ".gitignore must exclude the local .netlify folder.");

const catalog = fs.existsSync(path.join(projectRoot, "docs", "RESOURCE_CATALOG.md")) ? read("docs/RESOURCE_CATALOG.md") : "";
for (const resource of resources) {
  check(catalog.includes(resource.title), `Resource catalog is missing title: ${resource.title}`);
  check(catalog.includes(resource.url), `Resource catalog is missing URL for: ${resource.title}`);
}

for (const markdownPath of markdownFiles(projectRoot)) {
  const markdown = fs.readFileSync(markdownPath, "utf8");
  const relativeName = path.relative(projectRoot, markdownPath).replaceAll(path.sep, "/");
  check(!/[A-Za-z]:\\Users\\/i.test(markdown), `${relativeName} contains a machine-specific user path.`);
  check(!/file:\/\//i.test(markdown), `${relativeName} contains a file:// link.`);
  for (const match of markdown.matchAll(/!?\[[^\]]*\]\(([^)]+)\)/g)) {
    let target = match[1].trim();
    if (!target || /^(?:https?:|mailto:|tel:|#)/i.test(target)) continue;
    if (target.startsWith("<") && target.endsWith(">")) target = target.slice(1, -1);
    target = target.split("#", 1)[0];
    if (!target) continue;
    const targetPath = path.resolve(path.dirname(markdownPath), decodeURIComponent(target));
    check(fs.existsSync(targetPath), `${relativeName} links to missing file: ${target}`);
  }
}

const startHere = read("START_HERE.txt");
for (const guide of ["OWNER_GUIDE.md", "EDITING_GUIDE.md", "RELEASE_GUIDE.md", "TROUBLESHOOTING.md", "TECHNICAL_REFERENCE.md", "RESOURCE_CATALOG.md", "PROJECT_HISTORY.md"]) {
  check(startHere.includes(guide), `START_HERE.txt does not direct the owner to ${guide}.`);
}

if (warnings.length > 0) {
  console.warn("\nWarnings:");
  warnings.forEach((message) => console.warn(`  - ${message}`));
}

if (failures.length > 0) {
  console.error("\nMommy's List verification FAILED:\n");
  failures.forEach((message, index) => console.error(`  ${index + 1}. ${message}`));
  console.error(`\n${failures.length} failure(s). Nothing should be published until they are fixed.`);
  process.exitCode = 1;
} else {
  const embeddedHash = embeddedJpegs.length === 1 ? sha256(Buffer.from(embeddedJpegs[0][1], "base64")) : "unavailable";
  console.log("Mommy's List project verification PASSED.\n");
  console.log(`  HTML bytes:              ${Buffer.byteLength(html)}`);
  console.log(`  Inline scripts:          ${inlineScripts.length}`);
  console.log(`  Unique DOM IDs:          ${new Set(ids).size}`);
  console.log(`  Missing ID references:   ${missingIdReferences.length}`);
  console.log(`  Resources:               ${resources.length}`);
  console.log(`  Category counts:         ${Object.entries(categoryCounts).map(([key, value]) => `${key}=${value}`).join(", ")}`);
  console.log(`  Unique resource URLs:    ${resourceUrls.size}`);
  console.log(`  Baby Shower items:       ${showerItems.length}`);
  console.log("  Floating emojis:         22");
  console.log(`  Documentation files:     ${markdownFiles(projectRoot).length}`);
  console.log(`  Embedded/source logo:    ${embeddedHash}`);
  console.log("\nThe repository structure and static website contract are healthy.");
}
