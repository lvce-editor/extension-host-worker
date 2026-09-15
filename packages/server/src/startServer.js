import { fileURLToPath } from 'node:url'

process.env.LVCE_EDITOR_EXTENSION_API_PATH = fileURLToPath(new URL('../../../.tmp/dist/dist/extension-api/index.js', import.meta.url))

await import('@lvce-editor/server/bin/server.js')
