# Minimal SPA Example

Reference SPA showing `@phcdevworks/spectre-shell` wired to the wider Spectre
ecosystem (`spectre-shell-router`, `spectre-shell-signals`, `spectre-tokens`,
`spectre-ui`) through the published package exports — not source imports.

It demonstrates:

- `bootstrapApp()` with two routes resolved via lazy `loader()` functions
- The `bootReady` signal, observed with `effect()` to update the document title
- Token and UI CSS imported from each package's published `index.css` export

## Running

From the repo root (npm workspaces wires this example to the local
`@phcdevworks/spectre-shell` build):

```bash
npm install
npm run build
npm run dev --workspace=@phcdevworks/spectre-shell-example-minimal-spa
```

Then open the printed local URL and navigate between `/` and `/about`.

## Building

```bash
npm run build --workspace=@phcdevworks/spectre-shell-example-minimal-spa
```
