/*global process*/
import { defineConfig } from 'vite';
import { execSync } from 'node:child_process';
import { copyFileSync, cpSync, mkdirSync } from 'node:fs';
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
      const src = resolve(process.cwd(), 'images/logo.png');
      const destDir = resolve(process.cwd(), 'dist/assets');
      const dest = resolve(destDir, 'logo.png');
      try {
        mkdirSync(destDir, { recursive: true });
        copyFileSync(src, dest);
        console.log('Copied logo.png to dist/assets/logo.png');
      } catch (error) {
        console.error('Failed to copy logo.png:', error);
      }
    }
  };
}

function copyDocsPlugin() {
  return {
    name: 'copy-docs-to-dist',
    apply: 'build',
    closeBundle() {
      const src = resolve(process.cwd(), 'assets/docs');
      const dest = resolve(process.cwd(), 'dist/assets/docs');
      try {
        cpSync(src, dest, { recursive: true });
        console.log('Copied docs to dist/assets/docs');
      } catch (error) {
        console.error('Failed to copy docs:', error);
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
  plugins: [copyLogoPlugin(), copyDocsPlugin()]
});