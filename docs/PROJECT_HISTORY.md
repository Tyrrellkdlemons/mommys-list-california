# Project history and handoff

This is the readable record of what was built, verified, published, and later organized. It records both successful work and problems encountered so another maintainer does not have to rediscover them.

## Current status

- Website: complete and operational
- Production: <https://mommys-list-california.netlify.app>
- Repository: <https://github.com/Tyrrellkdlemons/mommys-list-california>
- Branch: `main`
- Runtime format: one self-contained `index.html`
- Build system: none
- Backend: none
- Account model: browser-local demonstration accounts
- Original logo source: `assets/branding/mommys-list-logo-original.jpg`
- Netlify project: `mommys-list-california`

The organization pass adds owner documentation and maintenance helpers without changing the website source. Production therefore remains the same verified HTML until a later site edit is intentionally deployed.

## 2026-08-01 — Initial design and implementation

The starting workspace contained the supplied square Mommy's List logo and a pasted reference document. The new page was built as a fresh, logo-led experience rather than copying a generic template.

Completed implementation:

- Built the complete landing page, resource desk, profile, authentication modal, and Baby Shower planner in one HTML document.
- Embedded the supplied JPEG in the HTML so the production site has no loose logo dependency.
- Created an editorial “California care desk” visual language based on the logo's pink, black, cream, gold, planning, and fashion-illustration character.
- Added a full Dad-mode palette, avatar, greeting, content tone, and Relationship badges.
- Added exactly 22 animated family-themed background emojis.
- Added 24 California-focused program and support cards across five filters.
- Added eight persistent Baby Shower planning cards.
- Added browser-local signup, login, session, profile update, and logout behavior.
- Added toast feedback, focus handling, active navigation, sticky offset measurement, and direct-section linking.
- Added 768 px and 480 px responsive breakpoints plus wider layout adjustments.
- Added reduced-motion support and keyboard-accessible modal behavior.

## Resource work

The resource collection was expanded beyond the requested minimum of 16 to 24 destinations. It includes nutrition, healthcare, food benefits, paid leave, family support, child-abuse reporting, diapers, early learning, early intervention, parent education, childcare referral, licensed-care search, caregiver checks, co-parenting, child support, mental health, autism, child-health information, developmental navigation, and maternal wellness.

The California Head Start destination was corrected during review because an older state education URL no longer represented the best current route. The final card uses the Head Start center locator.

Automated link requests were not treated as absolute truth. Several government/support sites can return 403 or TLS errors to scripted clients while loading normally for people. Those cases were manually reviewed rather than automatically removed.

## Local verification completed

Structural checks confirmed:

- One parseable inline script.
- 54 unique element IDs.
- No missing literal `getElementById()` references.
- 24 resources with 24 unique URLs.
- Category counts of 7 Government, 5 Education, 3 Child Care, 4 Relationship, and 5 Health & Wellness.
- Eight shower items.
- Exactly 22 generated floating emojis.
- Exactly one embedded JPEG logo source.
- No external JavaScript dependencies.
- Only the allowed Quicksand and Font Awesome presentation links.

Browser flows verified locally:

- Signup and personalized profile display.
- Session persistence after refresh.
- Kids-count update and persistence.
- Logout.
- Invalid-login rejection.
- Correct-login restoration.
- Account-specific Dad-mode restoration.
- Mom/Dad toggle synchronization between navigation and profile.
- Four Relationship badges in Dad mode.
- All resource-filter counts.
- Modal close button, Escape key, overlay click, focus trapping, and focus restoration.
- Shower selection, undo, and reload persistence.
- Direct `#profile` and `#baby-shower` navigation.
- Active-section highlighting.
- Layouts at 320, 390, 480, 768, and 1024 px.

## Problems found and repaired

### Horizontal overflow from full-bleed artwork

**Symptom:** Decorative ribbons and minimum widths could create sideways scrolling at narrow viewports.

**Resolution:** Shrink constraints were corrected, full-bleed presentation was clipped deliberately, and the page was checked at multiple narrow widths.

### Sticky navigation stopped sticking

**Symptom:** An earlier horizontal-overflow treatment on `body` interfered with sticky positioning.

**Resolution:** The page uses `overflow-x: clip` instead of a scroll-container-producing hidden overflow, and sticky ownership remains on the header.

### Mobile signed-in navigation stacking

**Symptom:** The added user chip could force an awkward third action row on small screens.

**Resolution:** Mobile grid placement was made explicit so account and mode actions occupy predictable rows.

### Direct hash position raced dynamic content

**Symptom:** A direct section URL could align before dynamically rendered cards and navigation sizing finished.

**Resolution:** Initial section restoration waits across nested animation frames and uses the measured sticky-header offset.

### Scrollspy did not update consistently

**Symptom:** Intersection-based active-link behavior could lag behind the visual section under the sticky header.

**Resolution:** Active-section tracking was changed to a requestAnimationFrame-throttled scroll calculation using the actual header marker.

### Browser history restored an old deep position

**Symptom:** After visiting a deep section, refreshing `#home` could allow browser-native scroll restoration to compete with explicit hash alignment.

**Resolution:** The application sets `history.scrollRestoration = "manual"`. Home and Baby Shower refresh flows were rechecked after the patch.

### First Netlify preview command timed out

**Symptom:** The initial CLI wait expired without returning a deployment record.

**Resolution:** The existing site was preserved. Deployment was retried with the explicit site ID, debug output, and a longer timeout. The draft completed successfully, was checked independently, and only then was production published.

### GitHub command-line authentication was not configured

**Symptom:** GitHub CLI had no active account session.

**Resolution:** The authorized, already signed-in Chrome session created the public repository. The local Git credential flow then pushed `main` normally. No token was written into the project.

## 2026-08-01 — Production release

Release results:

- GitHub repository created as `Tyrrellkdlemons/mommys-list-california`.
- Initial website commit: `d721b65`.
- Netlify-ignore commit: `91aba29`.
- Hash-navigation hardening commit: `c362beb`.
- Netlify production URL: <https://mommys-list-california.netlify.app>.
- Production returned HTTPS 200 and `text/html; charset=UTF-8`.
- HSTS was present.
- Production HTML was 387,901 bytes.
- Production and local SHA-256 matched exactly:

  ```text
  A7D77A0D8609CF2C9EDEA7FB9DD52DD5850F3CD416A902DF981552FC704C25EB
  ```

Production browser verification repeated the important flows:

- 24 resources, 22 floaters, and eight shower tools.
- Resource filters and counters.
- Dad-mode persistence and four badges.
- Signup, two-child profile, refresh restoration, and logout.
- Shower progress persistence and undo.
- Desktop and 390 px mobile layout checks.
- Direct navigation and refresh positioning.
- No horizontal overflow.
- Empty browser error log.

## 2026-08-01 — Directory organization and owner handoff

The repository was reorganized for a nontechnical owner while preserving the one-file site architecture.

Changes:

- Kept `index.html` as the obvious root launch and deployment file.
- Moved `Logo.jpg` to `assets/branding/mommys-list-logo-original.jpg` through Git so history records a rename.
- Added a GitHub-facing `README.md` and Notepad-friendly `START_HERE.txt`.
- Added owner, editing, release, troubleshooting, technical, resource, and history guides.
- Added a deterministic, no-dependency Node verification script.
- Added optional PowerShell helpers for local preview, safe logo embedding, and one-file Netlify releases.
- Expanded `.gitignore` for Netlify state and routine local scratch files.
- Kept `.git/` and `.netlify/` in place and untouched.

The source-logo move is safe because production loads the embedded JPEG, not the external source path. Verification compares both byte-for-byte so future branding updates cannot silently diverge.

## Known limitations and ongoing responsibilities

### Browser-local accounts

The requested account system is not server authentication. It does not sync, recover passwords, verify email addresses, or protect confidential data. A future production account system should replace the storage layer with a real backend identity provider rather than expanding the localStorage schema.

### External resource drift

Program URLs, requirements, and availability can change. The owner should manually review the 24 resources on a regular schedule and before major releases.

### Remote fonts and icons

Quicksand and Font Awesome load from external CDNs. The core page and logo remain available offline, but typography and icon glyphs may fall back without internet access.

### No analytics or server data

The project intentionally has no analytics, database, admin portal, account export, or server-side activity history.

## Recommended maintenance rhythm

### Before every site edit

- Read [`EDITING_GUIDE.md`](EDITING_GUIDE.md).
- Make one focused change.
- Run the verifier.
- Preview the affected behavior.
- Commit documentation with the behavior it describes.

### Before every production release

- Complete [`RELEASE_GUIDE.md`](RELEASE_GUIDE.md).
- Use a Netlify draft first.
- Check the draft in a real browser.
- Publish production.
- Require a matching production/local SHA-256.

### Monthly or quarterly

- Review resource destinations and descriptions.
- Confirm emergency-support wording.
- Recheck mobile layouts in current browsers.
- Confirm GitHub and Netlify account access.
- Review this handoff for facts that have changed.

## Final handoff rule

There should always be one obvious website source, one obvious original logo, one documentation entrance, one verified release path, and a clean Git history. If a future change makes ownership less obvious, reorganize the documentation before adding more duplicated files or tooling.
