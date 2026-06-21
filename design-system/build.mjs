// Builds the importable ES module the design-sync converter consumes
// (dist/index.es.js), and copies the brand stylesheet next to it. React
// stays external: the converter re-bundles this entry into a window.<global>
// IIFE and provides React from its own _vendor, so we must not inline a
// second copy here.
import { build } from 'esbuild';
import { copyFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = dirname(fileURLToPath(import.meta.url));

await build({
  entryPoints: [join(root, 'src/index.ts')],
  outfile: join(root, 'dist/index.es.js'),
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: 'es2020',
  jsx: 'automatic',
  // React (and its jsx-runtime) are provided by the host at runtime.
  external: ['react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime'],
  logLevel: 'info',
});

// The components reference brand classes from this stylesheet; ship it
// alongside the bundle so cssEntry can point at dist/nellie.css.
copyFileSync(join(root, 'src/nellie.css'), join(root, 'dist/nellie.css'));

console.log('built dist/index.es.js + dist/nellie.css');
