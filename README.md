# Mommy's List

## Start here

Mommy's List is a self-contained California family-resource website for moms and single dads. The entire working website lives in one file: [`index.html`](index.html).

- **Open the live site:** [mommys-list-california.netlify.app](https://mommys-list-california.netlify.app)
- **Open the GitHub repository:** [Tyrrellkdlemons/mommys-list-california](https://github.com/Tyrrellkdlemons/mommys-list-california)
- **Open the site locally:** double-click `index.html`
- **Check the project before publishing:** run `node scripts/verify-project.mjs`

If you prefer Notepad, open [`START_HERE.txt`](START_HERE.txt). It contains the same first-step directions in plain text.

## Where should I go?

| What you want to do | Open this |
| --- | --- |
| Use or demonstrate the website | [`index.html`](index.html) or the [live site](https://mommys-list-california.netlify.app) |
| Understand accounts, Dad mode, resources, or Baby Shower tools | [`docs/OWNER_GUIDE.md`](docs/OWNER_GUIDE.md) |
| Change wording, colors, resources, cards, or the logo | [`docs/EDITING_GUIDE.md`](docs/EDITING_GUIDE.md) |
| Preview and check a change | [`docs/RELEASE_GUIDE.md`](docs/RELEASE_GUIDE.md) and [`scripts/verify-project.mjs`](scripts/verify-project.mjs) |
| Publish to GitHub or Netlify | [`docs/RELEASE_GUIDE.md`](docs/RELEASE_GUIDE.md) |
| Fix a common problem | [`docs/TROUBLESHOOTING.md`](docs/TROUBLESHOOTING.md) |
| See storage keys and implementation details | [`docs/TECHNICAL_REFERENCE.md`](docs/TECHNICAL_REFERENCE.md) |
| Review the resource list | [`docs/RESOURCE_CATALOG.md`](docs/RESOURCE_CATALOG.md) |
| See what was built, tested, and repaired | [`docs/PROJECT_HISTORY.md`](docs/PROJECT_HISTORY.md) |

## Directory map

```text
Mommys List/
|-- README.md                         You are here; project map and quick links
|-- START_HERE.txt                    Plain-text first steps for Notepad
|-- index.html                        The complete website and deploy entry point
|-- .gitignore                        Keeps local/generated files out of Git
|-- assets/
|   `-- branding/
|       |-- mommys-list-logo-original.jpg   Original editable logo source
|       `-- README.md                       Logo replacement notes
|-- docs/
|   |-- README.md                     Documentation index
|   |-- OWNER_GUIDE.md                Everyday site and account guide
|   |-- EDITING_GUIDE.md              Safe content and design changes
|   |-- RELEASE_GUIDE.md              Preview, GitHub, and Netlify steps
|   |-- TROUBLESHOOTING.md            Common problems and recovery
|   |-- TECHNICAL_REFERENCE.md        Architecture, storage, and data reference
|   |-- RESOURCE_CATALOG.md           All 24 resource destinations
|   `-- PROJECT_HISTORY.md            Completed work and verification record
`-- scripts/
    |-- verify-project.mjs             No-dependency project integrity check
    |-- preview-local.ps1              Optional local web-server preview
    |-- embed-logo.ps1                 Re-embeds the source logo in index.html
    `-- deploy-netlify.ps1             Verified one-file Netlify deployment
```

Two hidden folders may also appear:

- `.git/` contains version history. Do not move, rename, or edit it manually.
- `.netlify/` links this folder to the existing Netlify project. It is local-only and intentionally ignored by Git.

## Important project rules

1. Keep `index.html` at the repository root. It is the one authoritative website file.
2. Do not create copies named `index-final.html`, `index-new.html`, or similar. Git already preserves earlier versions.
3. The JPG in `assets/branding/` is the source logo. The displayed logo is embedded inside `index.html`; use `scripts/embed-logo.ps1` after replacing the JPG.
4. Run `node scripts/verify-project.mjs` after every meaningful edit.
5. Preview before publishing. Publish to Netlify only after the verification script passes.
6. Never commit passwords, Netlify tokens, private family information, or browser-local account records.

## Architecture in one sentence

Mommy's List uses plain HTML, CSS, and JavaScript in a single browser-ready file, with no build step and no application dependencies. Google Fonts and Font Awesome are the only external presentation resources.

Accounts, family details, mode selection, and Baby Shower progress are intentionally stored only in the current browser. They do not sync between devices and should not be used for sensitive information.

## Current published locations

- Production: <https://mommys-list-california.netlify.app>
- Repository: <https://github.com/Tyrrellkdlemons/mommys-list-california>
- Netlify project name: `mommys-list-california`
- Live website baseline commit: `c362beb`

For the full operating sequence, continue with [`docs/README.md`](docs/README.md).
