import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'sample.webview-dynamic'

export const skip = true

export const test: Test = async ({ Extension, Main }) => {
  // TODO open sample webview
  // TODO verify that expected content is displayed
  await Extension.addWebExtension(new URL(`../fixtures/${name}`, import.meta.url).toString())
  await Main.openUri('webview://xyz')
}
