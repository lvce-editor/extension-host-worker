import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'
import { deepStrictEqual, strictEqual } from 'node:assert/strict'
import { afterEach, test } from 'node:test'
import { getColorThemeNames } from '../../../src/parts/ColorTheme/ColorTheme.ts'

interface MockRpcDisposable {
  [Symbol.dispose](): void
}

let mockRpc: MockRpcDisposable | undefined

afterEach(() => {
  mockRpc?.[Symbol.dispose]()
  mockRpc = undefined
})

test('getColorThemeNames returns enabled extension theme ids', async () => {
  mockRpc = ExtensionManagementWorker.registerMockRpc({
    async 'Extensions.executeCommand'(id: string): Promise<unknown> {
      strictEqual(id, 'Layout.getPlatform')
      return 4
    },
    async 'Extensions.getAllExtensions'(assetDir: string, platform: number): Promise<readonly unknown[]> {
      deepStrictEqual([assetDir, platform], ['', 4])
      return [
        {
          colorThemes: [{ id: 'theme.one', label: 'Theme One' }],
        },
        {
          colorThemes: [{ id: 'theme.disabled', label: 'Disabled Theme' }],
          disabled: true,
        },
        {},
        {
          colorThemes: [{ id: 'theme.two', label: 'Different Display Name' }],
        },
      ]
    },
  })

  const result = await getColorThemeNames()

  deepStrictEqual(result, ['theme.one', 'theme.two'])
})

test('getColorThemeNames returns an empty array when no extensions contribute themes', async () => {
  mockRpc = ExtensionManagementWorker.registerMockRpc({
    async 'Extensions.executeCommand'(): Promise<unknown> {
      return 4
    },
    async 'Extensions.getAllExtensions'(): Promise<readonly unknown[]> {
      return [{}, { colorThemes: [] }]
    },
  })

  const result = await getColorThemeNames()

  deepStrictEqual(result, [])
})
