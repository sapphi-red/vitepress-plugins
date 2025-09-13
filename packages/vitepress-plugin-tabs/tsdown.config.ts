import { defineConfig } from 'tsdown'
import vue from 'unplugin-vue/rolldown'

export default defineConfig([
  {
    entry: ['src/node/index.ts'],
    format: 'esm',
    dts: true,
    target: 'node18',
    outDir: 'dist/node'
  },
  {
    entry: ['src/client/index.ts'],
    format: 'esm',
    dts: { vue: true },
    plugins: [vue({ isProduction: true })],
    outDir: 'dist/client',
    outputOptions: {
      banner: 'import "./index.css"'
    }
  }
])
