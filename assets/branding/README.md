# Branding source

`mommys-list-logo-original.jpg` is the original source artwork supplied for Mommy's List. Keep it here so future design work has one clearly named, high-resolution source.

The live site does **not** load this file by path. A JPEG copy is embedded as a base64 data URI inside [`../../index.html`](../../index.html), which keeps the deployed website self-contained.

To replace the displayed logo:

1. Replace `mommys-list-logo-original.jpg` with the new JPEG while keeping the same filename.
2. From the repository root, run:

   ```powershell
   powershell -ExecutionPolicy Bypass -File .\scripts\embed-logo.ps1
   ```

3. Run `node .\scripts\verify-project.mjs`.
4. Preview the page and inspect both the large hero logo and smaller copied logo treatments.
5. Commit the updated JPEG and `index.html` together.

See [`../../docs/EDITING_GUIDE.md`](../../docs/EDITING_GUIDE.md) for the complete change process.
