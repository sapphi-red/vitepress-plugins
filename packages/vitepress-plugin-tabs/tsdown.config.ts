import { defineConfig, type UserConfig } from 'tsdown'
import vue from 'unplugin-vue/rolldown'

export default defineConfig([
  {
    entry: ['src/node/index.ts'],
    format: 'esm',
    dts: true,
    target: 'node18',
    outDir: 'dist/node',
    fixedExtension: false,
  },
  ...(['browser', 'ssr'] as const).map(
    (name) =>
      ({
        entry: ['src/client/index.ts'],
        platform: name === 'browser' ? 'browser' : 'node',
        format: 'esm',
        dts: { vue: true },
        plugins: [vue({ isProduction: true, ssr: name === 'ssr' })],
        outDir: `dist/client/${name}`,
        fixedExtension: false,
        outputOptions: {
          banner: name === 'browser' ? 'import "./index.css"' : undefined,
        },
      }) satisfies UserConfig,
  ),
])
