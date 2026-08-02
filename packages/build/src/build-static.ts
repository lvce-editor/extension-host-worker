import { cp } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { root } from './root.ts'

const serverRequire = createRequire(new URL('../../server/package.json', import.meta.url))
const sharedProcessPath = serverRequire.resolve('@lvce-editor/shared-process')

const sharedProcessUrl = pathToFileURL(sharedProcessPath).toString()

const sharedProcess = await import(sharedProcessUrl)

process.env.PATH_PREFIX = '/extension-host-worker'
await sharedProcess.exportStatic({
  root,
  extensionPath: '',
})

await cp(join(root, 'dist'), join(root, '.tmp', 'static'), { recursive: true })
