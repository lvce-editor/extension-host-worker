import { activate as activateExtensionApi } from './index.ts'

const { searchParams } = new URL(import.meta.url)
const extensionUrl = searchParams.get('extensionUrl')

if (!extensionUrl) {
  throw new Error('extensionUrl is required')
}

await activateExtensionApi()

const extensionModule = await import(extensionUrl)
await extensionModule.activate?.()
