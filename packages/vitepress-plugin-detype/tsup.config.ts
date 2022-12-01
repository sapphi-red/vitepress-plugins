import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/node/index.ts'],
  format: 'esm',
  dts: true
})
