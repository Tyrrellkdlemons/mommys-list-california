# Release guide

This is the owner-approved sequence for checking, versioning, and publishing Mommy's List. The website has no build step. The deployment helper publishes only `index.html`, keeping guides and maintenance scripts on GitHub rather than exposing them as site paths.

## Current release destinations

- Git branch: `main`
- Git remote: `origin`
- GitHub: <https://github.com/Tyrrellkdlemons/mommys-list-california>
- Netlify project: `mommys-list-california`
- Production: <https://mommys-list-california.netlify.app>
- Local Netlify connection: `.netlify/state.json`

The hidden `.netlify/` folder is intentionally ignored by Git. Do not move or edit it manually.

## When is a Netlify deployment needed?

Deploy when `index.html` changed.

A documentation-only change, folder organization change, or rename of the unreferenced source logo does not change the live website. Push those changes to GitHub, but do not create an unnecessary Netlify deploy.

If the logo was re-embedded, `index.html` changed and must be deployed.

## Prerequisites

The normal Windows release path expects:

- Git
- Node.js
- Python for the optional local preview
- Netlify CLI, available as `netlify.cmd`
- An authenticated Netlify CLI session
- This folder linked to the existing Netlify project

PowerShell execution policy can block command shims ending in `.ps1`. The guides intentionally use `netlify.cmd`, and PowerShell helper scripts can be launched with `-ExecutionPolicy Bypass`.

## Step 1: Inspect the worktree

From the repository root:

```powershell
git status --short --branch
git diff --check
git diff
```

Confirm that every change belongs to the release. Never stage `.netlify/`, private account information, browser-storage exports, access tokens, temporary servers, or unrelated workspace files.

## Step 2: Run deterministic verification

```powershell
node .\scripts\verify-project.mjs
```

Do not continue if it reports an error. Fix the named file or invariant and rerun it.

The verifier checks the HTML and JavaScript structure, DOM IDs, resource records and counts, shower items, 22-emoji generator, allowed dependencies, embedded/source logo equality, required documentation, and relative documentation links.

## Step 3: Preview locally

The simplest preview is to double-click `index.html`.

For browser behavior closer to production, run:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\preview-local.ps1
```

The helper verifies the project, opens `http://127.0.0.1:4173/`, and runs a local Python web server. Return to the PowerShell window and press `Ctrl+C` to stop it.

During preview, check:

- Home, Resources, My Profile, and Baby Shower navigation.
- All resource filters and counters.
- Mom and Single Dad modes.
- Signup, reload, kids update, logout, invalid login, and valid login.
- Modal close button, Escape key, overlay click, and focus restoration.
- Baby Shower selection and reload persistence.
- Direct section URLs and refresh positioning.
- No horizontal scrolling on a phone-sized viewport.
- No browser console errors or warnings.

## Step 4: Commit and push to GitHub

Stage only the intended files. For example:

```powershell
git add -- index.html README.md START_HERE.txt docs assets scripts .gitignore
git status --short
git diff --cached --check
git diff --cached --stat
git commit -m "Describe the completed change"
git push origin main
```

After pushing:

```powershell
git status --short --branch
git log -1 --oneline --decorate
```

The worktree should be clean, and `HEAD`, `main`, and `origin/main` should identify the same commit.

## Step 5: Create a Netlify preview

Skip this step when `index.html` did not change.

To test release preparation without creating any Netlify deploy:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\deploy-netlify.ps1 -ValidateOnly
```

This verifies the project, confirms the local Netlify link, stages only `index.html`, compares the staged hash, and cleans up without contacting the deployment command.

For a site change, run the helper without `-Production`:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\deploy-netlify.ps1 -Message "Describe the preview"
```

The helper:

1. Runs project verification.
2. Confirms the local Netlify link exists.
3. Creates a unique temporary release folder.
4. Copies only `index.html` into it.
5. Runs `netlify.cmd deploy --no-build`.
6. Removes the temporary release artifact.

Open the draft URL printed by Netlify and repeat the affected browser tests there.

## Step 6: Publish production

Only after the preview passes:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\deploy-netlify.ps1 -Production -Message "Describe the production release"
```

The production form also downloads the public homepage after deployment and compares its SHA-256 hash with local `index.html`. The script fails if the public bytes do not match.

## Step 7: Final release check

Confirm:

- <https://mommys-list-california.netlify.app> returns the updated site over HTTPS.
- The production hash matched local `index.html`.
- A fresh browser origin starts as a logged-out Mom-mode guest.
- Signup and browser persistence work.
- Dad mode produces four Relationship badges.
- All filters show 24/7/5/3/4/5 as expected.
- All eight Baby Shower cards render.
- Desktop and mobile layouts have no horizontal overflow.
- Browser console output is clean.
- Git is clean and synchronized.

## Roll back safely

### Netlify-only rollback

Use the Netlify project dashboard to select a previously verified deploy and publish it again. This is the fastest recovery when production is broken but Git history is correct.

### Git rollback

Prefer a new revert commit so history stays understandable:

```powershell
git log --oneline -10
git revert <bad-commit-hash>
git push origin main
```

Then preview and deploy the reverted `index.html` through the normal process.

Do not use `git reset --hard` or force-push shared history as a routine rollback method.

## Release record

When behavior or production content changes, add a dated note to [`PROJECT_HISTORY.md`](PROJECT_HISTORY.md) describing:

- What changed.
- What was verified.
- Any problem encountered.
- How the problem was resolved.
- Whether Netlify production changed.
