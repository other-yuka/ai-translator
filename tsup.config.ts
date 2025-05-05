import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  cjsInterop: true,
  splitting: true,
  bundle: true,
  sourcemap: true,
});
