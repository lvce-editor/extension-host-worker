import pluginTypeScript from '@babel/preset-typescript'
import { babel } from '@rollup/plugin-babel'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { join } from 'node:path'
import { rollup } from 'rollup'
import type { OutputOptions, RollupOptions } from 'rollup'
import { root } from './root.ts'

interface BundleJsOptions {
  readonly inFile: string
  readonly outFile: string
}

export const bundleJs = async ({ inFile, outFile }: BundleJsOptions): Promise<void> => {
  const outputOptions: OutputOptions = {
    file: join(root, outFile),
    format: 'es',
    freeze: false,
    generatedCode: {
      constBindings: true,
      objectShorthand: true,
    },
  }
  const options: RollupOptions = {
    input: join(root, inFile),
    preserveEntrySignatures: 'strict',
    treeshake: {
      propertyReadSideEffects: false,
    },
    output: outputOptions,
    external: ['electron', 'ws'],
    plugins: [
      babel({
        babelHelpers: 'bundled',
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        presets: [pluginTypeScript],
      }),
      nodeResolve(),
    ],
  }
  const input = await rollup(options)
  await input.write(outputOptions)
}
