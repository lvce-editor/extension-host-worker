# @lvce-editor/api

Extension API for Lvce Editor extensions.

```sh
npm install @lvce-editor/api
```

```ts
import { activate, registerCommand } from '@lvce-editor/api'

export const main = () => {
  activate()
  registerCommand({
    id: 'example.hello',
    execute() {
      console.log('Hello from an extension')
    },
  })
}
```

The package is published as unbundled ESM with TypeScript declaration files, so extensions can bundle it with their own build tooling.

Extensions running on Electron or a remote host can request the editor's user data directory as a `file:` URI. The call throws on the web platform.

```ts
import { getUserDataDir } from '@lvce-editor/api'

const userDataDir = await getUserDataDir()
```

Electron extensions can create an off-screen web contents view. It stays hidden for the lifetime of the handle, and disposing the handle destroys its web contents.

```ts
import { createElectronWebContentsView } from '@lvce-editor/api'

const view = await createElectronWebContentsView({ url: 'https://example.com' })
const title = await view.executeJavaScript<string>('document.title')
await view.dispose()
```

Extensions can persist sensitive strings without depending on the editor's browser cache. Values are scoped to the calling extension.

```ts
import { deleteSecret, getSecret, storeSecret } from '@lvce-editor/api'

await storeSecret('access-token', token)
const savedToken = await getSecret('access-token')
await deleteSecret('access-token')
```
