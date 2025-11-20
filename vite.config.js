/*global process*/
import { defineConfig } from 'vite';
import { execSync } from 'node:child_process';
import { copyFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

function resolveCommitHash() {
  if (process.env.VITE_APP_COMMIT) return process.env.VITE_APP_COMMIT;
  try {
    return execSync('git rev-parse --short HEAD').toString().trim();
  } catch (error) {
    console.warn('Unable to read git commit hash, falling back to dev');
    return 'dev';
  }
}

const commitHash = resolveCommitHash();
process.env.VITE_APP_COMMIT = commitHash;

function copyLogoPlugin() {
  return {
    name: 'copy-logo-to-dist',
    apply: 'build',
    closeBundle() {
      const src = resolve(process.cwd(), 'images/logo.svg');
      const destDir = resolve(process.cwd(), 'dist/images');
      const dest = resolve(destDir, 'logo.svg');
      try {
        mkdirSync(destDir, { recursive: true });
        copyFileSync(src, dest);
        console.log('Copied logo.svg to dist/images/logo.svg');
      } catch (error) {
        console.error('Failed to copy logo.svg:', error);
      }
    }
  };
}

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: 'index.html'
    }
  },
  server: {
    port: 3000,
    open: true
  },
  define: {
    __APP_COMMIT__: JSON.stringify(commitHash)
  },
  plugins: [copyLogoPlugin()]
});