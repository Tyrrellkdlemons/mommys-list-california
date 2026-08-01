# Technical reference

This document describes the checked-in architecture and data contract. It is intended for maintainers who need exact implementation details without reverse-engineering the whole page.

## Architecture

- Entry point: [`../index.html`](../index.html)
- Application model: static, client-only, single HTML document
- Languages: HTML, CSS, and browser JavaScript
- Build command: none
- Runtime server: none required
- Backend/database: none
- Authentication: browser-local demonstration flow
- Production host: Netlify
- Source host: GitHub

The CSS is inside one `<style>` element. Application code and data are inside one inline `<script>`. There are no external JavaScript files and no package-manager dependencies.

## External presentation dependencies

| Dependency | Purpose | Location |
| --- | --- | --- |
| Google Fonts Quicksand | Primary typography, weights 400/500/600/700 | `fonts.googleapis.com` and `fonts.gstatic.com` |
| Font Awesome Free 6.5.0 | Interface and resource icons | `cdnjs.cloudflare.com` |

The logo is not an external runtime dependency. It is embedded in `index.html` as a JPEG data URI.

## Main document sections

| Section | ID | Navigation value |
| --- | --- | --- |
| Home/hero | `home` | `home` |
| Resource desk | `resources` | `resources` |
| Profile | `profile` | `profile` |
| Baby Shower planner | `baby-shower` | `baby-shower` |

Navigation links use `data-nav-link`. Sections use `data-nav-section`. A requestAnimationFrame-throttled scroll handler determines the active section. The sticky header's measured height is stored in the CSS variable `--nav-offset` so direct links align correctly at different breakpoints and account states.

`history.scrollRestoration` is set to `manual` so browser history does not overwrite the page's explicit hash positioning after refresh.

## Dynamic data collections

### `RESOURCES`

The array contains 24 objects with these fields:

| Field | Required | Meaning |
| --- | --- | --- |
| `title` | Yes | Default visible card title |
| `dadTitle` | No | Dad-mode replacement title |
| `description` | Yes | Card explanation |
| `category` | Yes | One of the five internal filter values |
| `tag` | Yes | Small secondary topic label |
| `url` | Yes | HTTPS destination |
| `icon` | Yes | Font Awesome class string |
| `color` | Yes | Card icon/accent color |

Expected category distribution:

```text
government    7
education     5
childcare     3
relationship  4
health        5
total        24
```

`renderResources()` rebuilds the card grid from the current filter. Dad mode adds a generated `dad-resource-badge` to every Relationship card.

### `SHOWER_ITEMS`

The array contains eight objects with `id`, `emoji`, `title`, and `description`. Completed state is stored as an array of item IDs. During restoration, unknown IDs are discarded, which prevents removed planner items from creating phantom progress.

## Browser storage contract

All keys are declared in `var STORAGE`.

| localStorage key | Value |
| --- | --- |
| `mommyslist_users_v2` | Array of locally registered full user records |
| `mommyslist_session_v2` | Currently signed-in public user record |
| `mommyslist_dad_mode` | Standalone Mom/Dad Boolean |
| `mommyslist_shower_plan` | Array of completed shower-item IDs |

A full local user record contains:

```text
id
name
email
passwordHash
kids
dadMode
createdAt
```

The public session deliberately excludes the password hash and contains:

```text
id
email
name
kids
dadMode
createdAt
```

Emails are trimmed and normalized to lowercase. Kids counts are clamped to 0–20. A signed-in account's Dad-mode value takes precedence over the standalone browser setting.

Logout removes only `mommyslist_session_v2`. It does not remove the user record, Dad-mode setting, or Baby Shower progress.

## Password handling boundary

New passwords are prefixed with the fixed local salt string `mommys-list-local::`.

- When Web Crypto is available, the result is SHA-256 and stored with a `sha256:` prefix.
- The compatibility fallback uses reversed Base64 and a `local:` prefix. That fallback is obfuscation, not secure password storage.
- Login recognizes a legacy `user.password` field if an older browser record contains one, but new registrations store `passwordHash` only.

This remains a local demonstration account system. Fixed-salt hashing and localStorage do not provide production authentication security. There is no server-side validation, rate limiting, email verification, password reset, encrypted database, recovery flow, or cross-device synchronization.

Do not add health, financial, legal, government-case, child-identifying, or other sensitive data fields to this storage model.

## State behavior

The main in-memory state tracks:

- Current filter.
- Current public user or guest state.
- Dad mode.
- Completed Baby Shower IDs.
- Last focused element before the modal opened.

`restoreState()` reads browser storage, rejects malformed values through guarded JSON helpers, restores the public session, chooses the correct mode, and filters shower IDs against the current item list.

## Authentication modal behavior

- One modal provides Login and Sign up modes.
- Signup-only fields are shown or hidden rather than duplicated into separate forms.
- The form validates email, password length, name, duplicate email, and kids count.
- Tab key handling traps focus inside the open dialog.
- Escape and overlay mousedown close the modal.
- Closing restores focus to the element that opened it.
- Toasts use `status` for routine feedback and `alert` for errors.

## Responsive and motion behavior

The layout includes major responsive adjustments at 1160 px, 768 px, and 480 px. Verification also exercises narrow 320/390 px screens and standard desktop widths.

The page uses `overflow-x: clip` to preserve full-bleed artwork without creating horizontal scrolling. Sticky positioning remains on the site header. Navigation sizing is recalculated with `ResizeObserver` when available and on window resize as a fallback.

The `prefers-reduced-motion: reduce` query removes or shortens nonessential animation and scrolling behavior.

## Logo pipeline

- Editable source: [`../assets/branding/mommys-list-logo-original.jpg`](../assets/branding/mommys-list-logo-original.jpg)
- Embedded runtime source: the single `data:image/jpeg;base64,...` value on the main hero image
- Copy behavior: `syncLogoCopies()` assigns the embedded source to smaller elements carrying `data-logo-copy`

`scripts/embed-logo.ps1` replaces exactly one embedded JPEG data URI and then invokes project verification. `scripts/verify-project.mjs` confirms that the embedded bytes and source JPG are identical.

## Verification baseline

At the time of this organization pass, the website baseline is:

```text
Inline scripts:          1
Unique DOM IDs:         54
Missing ID references:  0
Resources:              24
Unique resource URLs:   24
Shower items:            8
Floating emojis:        22
Embedded JPEGs:          1
Browser console errors:  0 in the verified production flow
```

Run `node .\scripts\verify-project.mjs` instead of relying on this snapshot after edits.

## Release linkage

- Git remote: `https://github.com/Tyrrellkdlemons/mommys-list-california.git`
- Default branch: `main`
- Netlify project: `mommys-list-california`
- Production URL: `https://mommys-list-california.netlify.app`
- Local Netlify link: `.netlify/state.json` (ignored by Git)

The provided deployment helper stages only `index.html` in a unique temporary folder. This keeps owner documentation and scripts on GitHub without publishing them as public site paths.
