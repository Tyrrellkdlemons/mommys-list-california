# Troubleshooting

Start with the symptom that matches what you see. Run `node .\scripts\verify-project.mjs` before publishing any attempted fix.

## The local page is blank or looks incomplete

1. Confirm the file is still named `index.html`.
2. Confirm it is at the repository root.
3. Open browser developer tools and inspect the Console for the first error.
4. Run the project verifier.
5. Try the local-server preview instead of opening the file directly:

   ```powershell
   powershell -ExecutionPolicy Bypass -File .\scripts\preview-local.ps1
   ```

If the text and logo appear but icons or typography look different, the internet connection may be blocking Google Fonts or Font Awesome. The core site and embedded logo do not require those remote files.

## I replaced the JPG, but the website still shows the old logo

That is expected until the source is re-embedded. The site does not load the loose JPG at runtime.

Run:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\embed-logo.ps1
```

Then preview and commit both `assets\branding\mommys-list-logo-original.jpg` and `index.html`.

## The logo verifier says the source and embedded image differ

One version was updated without the other. Decide which image is authoritative:

- If the source JPG is correct, run `scripts\embed-logo.ps1`.
- If the embedded image is correct, recover the matching source from Git history before continuing.

Do not disable the check. It prevents future owners from unknowingly editing the wrong logo copy.

## My account or planner progress disappeared

Browser data is scoped to the exact site origin. Check whether you changed among:

- The production Netlify URL.
- A Netlify draft URL.
- `http://127.0.0.1:4173`.
- Another localhost port.
- A directly opened `file:` page.
- A normal browser window and a private/incognito window.

Each location has separate localStorage. Clearing site data also deletes local accounts and planner selections. There is no remote account recovery.

## Login rejects credentials that worked elsewhere

The account may exist on a different browser or origin. Email is normalized to lowercase, but the password must match exactly.

If testing a new release, create a separate disposable local test account. Do not place its password or storage record in Git or documentation.

## Dad mode does not look synchronized

Check both the navigation button and profile switch. If signed in, the account's stored mode takes precedence after reload. Log out, select the desired guest mode, and verify again. Then log back in to check the account-specific setting.

Run the verifier if Relationship cards do not receive exactly four Dad-friendly badges; the resource category data may have changed.

## A filter count is wrong

Expected counts are:

```text
All                24
Government          7
Education           5
Child Care          3
Relationship        4
Health & Wellness   5
```

Inspect the `category` field of the recently edited resource object. Valid values are `government`, `education`, `childcare`, `relationship`, and `health`.

Update the verification baseline and catalog only when a product decision intentionally changes the collection—not to hide an accidental count change.

## A resource link reports 403 or blocks automation

Some government and support websites reject automated requests while still working in a normal browser. Open the resource manually and confirm the visible provider page. Treat a confirmed 404 or 410 as a broken destination. Treat 401/403 as manual-review conditions rather than automatically deleting the resource.

## The sticky navigation lands on the wrong section

Confirm the link and section values match:

```html
<a href="#profile" data-nav-link="profile">My Profile</a>
<section id="profile" data-nav-section="profile">
```

Do not remove the navigation-sizing initialization, `--nav-offset`, direct-hash restoration, or manual scroll-restoration assignment. Test a fresh direct link and a refresh after navigating from another section.

## There is horizontal scrolling on mobile

Test at 320 px and find the element extending beyond `document.documentElement.clientWidth`. Common causes include:

- A new fixed or minimum width.
- A full-bleed ribbon without a clipped ancestor.
- A grid child that cannot shrink.
- Long unbroken text.
- A new shadow or transform on an edge element.

Preserve `overflow-x: clip` and avoid changing it to `hidden` on `body`; that previously interfered with sticky positioning.

## PowerShell says a script cannot be loaded

Use the documented command form:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\preview-local.ps1
powershell -ExecutionPolicy Bypass -File .\scripts\embed-logo.ps1
powershell -ExecutionPolicy Bypass -File .\scripts\deploy-netlify.ps1 -ValidateOnly
```

Use `netlify.cmd` rather than `netlify` if PowerShell blocks the Netlify `.ps1` shim.

## The local preview says Python is missing

The website does not require Python. Double-click `index.html` for a basic preview.

For the server preview, install Python or run an equivalent static server. The helper recognizes `python` and the Windows `py` launcher.

## Netlify says the folder is not linked

Confirm `.netlify\state.json` exists. If it was deleted, reconnect to the existing project rather than creating a second site:

```powershell
netlify.cmd link --id ee9d2775-c966-4410-b280-e523b730e7d5
```

Then run `netlify.cmd status` and confirm the project is `mommys-list-california` before deploying.

## Netlify deployment is slow or times out

Retry with the linked site intact and a larger CLI timeout. The release helper stages only one file, so a persistent delay usually comes from the Netlify API or CDN rather than the project size.

Do not create a replacement site merely because one upload timed out. Check the Netlify deploy list first; the deploy may have completed after the local wait ended.

## The deploy succeeded, but the public page still looks old

1. Confirm you used `-Production`, not only the preview form.
2. Hard-refresh the production page.
3. Run the production helper again and read its local/live SHA-256 comparison.
4. Confirm the Netlify project name and URL.
5. Check that `index.html` was copied into the temporary release root, not into a nested folder.

## Git says there is nothing to push

Run:

```powershell
git status --short --branch
git log -1 --oneline --decorate
```

If the intended files are untracked, add them explicitly. If the worktree is clean and `HEAD` already matches `origin/main`, the change may already be published to GitHub.

## Git identity is missing

Configure identity for this repository only:

```powershell
git config user.name "Tyrrell Lemons"
git config user.email "86082009+Tyrrellkdlemons@users.noreply.github.com"
```

Then retry the commit. Do not overwrite global Git settings unless that is intentional.

## I need to undo a bad edit

If it is uncommitted, inspect `git diff` and use a focused manual correction. Do not discard unrelated work.

If it is committed and pushed, use `git revert <commit>` to create a clear recovery commit. For an urgent live-site problem, Netlify can republish a previously verified deploy while the Git correction is prepared.

## Still blocked

Record:

- The exact command.
- The complete first error.
- The current Git status.
- Whether the problem is local, GitHub, Netlify preview, or production.
- The affected browser and URL.
- What already worked immediately before the problem.

That evidence usually separates a source problem from a browser-storage, authentication, or deployment problem quickly.
