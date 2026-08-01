# Editing guide

Mommy's List deliberately has one website source file: [`../index.html`](../index.html). Its HTML, CSS, data, and JavaScript are together so the page can be opened or deployed without a build system.

## Safe editing sequence

1. Confirm Git is clean with `git status --short`.
2. Make one focused change in `index.html` or the matching documentation.
3. Run `node .\scripts\verify-project.mjs` from the repository root.
4. Preview the page locally and test the affected behavior.
5. Inspect `git diff --check` and `git diff`.
6. Commit and push only after the checks pass.

Do not create parallel files such as `index-final.html` or `index-backup.html`. Git already stores earlier versions and keeps the root directory understandable.

## Find the major areas

Search `index.html` for these stable markers rather than relying on line numbers, which change as the file is edited.

| Area | Search for |
| --- | --- |
| Main color palette | `:root {` near the beginning of `<style>` |
| Dad-mode palette | `body[data-mode="dad"]` |
| Navigation | `<header class="site-header` |
| Home/hero section | `id="home"` |
| Resource section | `id="resources"` |
| Profile section | `id="profile"` |
| Baby Shower section | `id="baby-shower"` |
| Footer | `<footer` |
| Authentication modal | `id="authModal"` |
| Browser storage names | `var STORAGE =` |
| Resource-card data | `var RESOURCES =` |
| Shower-card data | `var SHOWER_ITEMS =` |
| Dynamic Mom/Dad copy | `function renderProfile()` |
| Startup sequence | `function init()` |

Visible static wording appears in the HTML sections. Mode-specific greetings and descriptions also appear inside `renderProfile()`. When changing a greeting, search for related Mom and Dad wording so both modes remain complete.

## Edit or add a resource

All resource data lives in the `RESOURCES` array. A card uses this shape:

```javascript
{
  title: "Visible title",
  dadTitle: "Optional Dad-mode title",
  description: "A short, useful explanation.",
  category: "government",
  tag: "Small topic label",
  url: "https://official.example/",
  icon: "fa-solid fa-icon-name",
  color: "#4a9b68"
}
```

Current category values are exactly:

- `government`
- `education`
- `childcare`
- `relationship`
- `health`

Editing rules:

1. Use the program or provider's direct HTTPS destination whenever possible.
2. Keep the description concise and explain the visitor benefit first.
3. Use an icon that exists in Font Awesome Free 6.5.0.
4. Keep the color as a six-digit hexadecimal value.
5. Separate array objects with commas and leave the final JavaScript syntactically valid.
6. Keep titles and URLs unique.
7. Array order controls card order.
8. Relationship entries automatically receive the Dad-friendly badge in Dad mode.
9. The card counter and existing filters update automatically.

After changing resources, run the verifier and manually select every category. Update [`RESOURCE_CATALOG.md`](RESOURCE_CATALOG.md) in the same commit.

Adding an entirely new category is a larger change. It also requires:

- A new filter button with the matching `data-filter` value.
- A label in the `categoryLabel()` function.
- New styling if the category needs a distinct presentation.
- New count expectations in `scripts/verify-project.mjs` and the guides.

## Edit Baby Shower items

The `SHOWER_ITEMS` array contains objects such as:

```javascript
{
  id: "checklist",
  emoji: "📋",
  title: "Checklist",
  description: "Turn the whole celebration into one calm, checkable plan."
}
```

Keep an existing `id` when only changing its title, emoji, or description. Planner progress is saved by ID. Renaming or removing an ID causes that saved selection to be discarded on the next load.

Every ID must be unique. Adding an item automatically changes the progress denominator, but this project's intended design and verification baseline currently expect exactly eight items.

## Edit the navigation or add a section

Navigation tracking uses matching values:

```html
<a href="#example" data-nav-link="example">Example</a>
<section id="example" data-nav-section="example">
```

The `href`, `data-nav-link`, `id`, and `data-nav-section` values must agree. The JavaScript calculates the sticky-navigation offset and restores direct hash links after refresh.

## Change colors and visual styling

Mom-mode variables are at the first `:root` block. The primary values are:

| Purpose | Value |
| --- | --- |
| Main pink | `#ee2f78` |
| Strong pink | `#bd174f` |
| Soft pink | `#fce4ec` |
| Second soft pink | `#f8bbd0` |
| Purple | `#9d6fc8` |
| Blue | `#8ea9c4` |
| Gold | `#d7a03d` |
| Paper | `#fffaf9` |
| Ink | `#181216` |

Dad-mode overrides begin at `body[data-mode="dad"]`:

| Purpose | Value |
| --- | --- |
| Main blue | `#2385c5` |
| Strong blue | `#0c568d` |
| Soft blue | `#e4f2fc` |
| Second soft blue | `#b9dcef` |
| Purple | `#6576bd` |
| Supporting blue | `#5ca8d6` |
| Gold | `#d5a33e` |
| Paper | `#f8fbfd` |
| Ink | `#111a24` |

Test both modes after changing a shared variable. Also check 320 px, 390 px, 768 px, and desktop widths because shadows, ribbons, and full-width decorations can reveal overflow only at particular sizes.

## Replace the logo

The editable source is [`../assets/branding/mommys-list-logo-original.jpg`](../assets/branding/mommys-list-logo-original.jpg). The displayed logo is embedded in `index.html` as one JPEG data URI so the live page remains self-contained.

Replacing the source JPG alone will not change the website. Use this sequence:

1. Replace the JPG while retaining the filename `mommys-list-logo-original.jpg`.
2. Make sure it is genuinely a JPEG and opens correctly.
3. Run:

   ```powershell
   powershell -ExecutionPolicy Bypass -File .\scripts\embed-logo.ps1
   ```

4. Run `node .\scripts\verify-project.mjs`.
5. Preview the hero, sticky-navigation logo, and account-modal logo.
6. Review the image's descriptive `alt` text in `index.html` and update it if the artwork meaningfully changed.
7. Commit the JPG and `index.html` together.

The JavaScript function `syncLogoCopies()` copies the embedded hero source into the smaller logo positions. Do not paste separate base64 copies throughout the file.

## External presentation resources

The only external presentation resources are:

- Google Fonts Quicksand, weights 400, 500, 600, and 700.
- Font Awesome Free 6.5.0 from cdnjs.

The content, behavior, CSS, and embedded logo remain in `index.html`. Without internet access, the web font and icon glyphs may not load, but the core page still opens.

## Accessibility rules to preserve

- Keep heading levels in a logical order.
- Keep form labels connected to their inputs.
- Keep unique element IDs.
- Preserve visible keyboard focus styles.
- Preserve the skip link and semantic sections.
- New external links should use `target="_blank"` with `rel="noopener noreferrer"`.
- Update `aria-label` text when a control's meaning changes.
- Keep modal focus trapping, Escape dismissal, and focus restoration intact.
- Do not communicate state by color alone.
- Respect the existing reduced-motion media query when adding animations.

## Final edit checklist

- [ ] The verifier passes.
- [ ] `index.html` opens without a console error.
- [ ] Mom and Dad modes both work.
- [ ] Resource counts are correct.
- [ ] Direct links and sticky navigation work.
- [ ] The profile and modal work with a keyboard.
- [ ] Mobile layouts have no horizontal scrolling.
- [ ] The matching guide or catalog is updated.
- [ ] `git diff --check` passes.
- [ ] Only intentional files are staged.
