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

Electron extensions can create a web contents view, hide it from the editor window, and continue using its web contents. Disposing the handle destroys its web contents.

```ts
import { createElectronWebContentsView } from '@lvce-editor/api'

const view = await createElectronWebContentsView({ url: 'https://example.com' })
await view.hide()
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

## Workspace ports

Declare `"onPorts:codespaces"` in the extension's `activation` array and register a provider after activating the API:

```ts
import { registerPortProvider } from '@lvce-editor/api'

const registration = registerPortProvider({
  scheme: 'codespaces',
  async providePorts(workspaceUri) {
    return [{ port: 3000, forwardedAddress: 'https://my-codespace-3000.app.github.dev/', origin: 'devcontainer.json' }]
  },
})
```

Ports queries matching extensions with the current workspace URI. Each extension may register one provider per scheme. Return an empty array when no ports are available, and dispose the registration when deactivating. The provider supplies addresses; the API does not create tunnels or change their visibility. Results from disposed registrations are discarded.

## Authentication providers

Extensions can contribute a functional authentication provider with session callbacks. The provider's stable `id` and display `label` identify it; requested scopes are passed to the callbacks, and session results include an account, access token, and granted scopes.

```ts
import { activate, registerAuthenticationProvider } from '@lvce-editor/api'

await activate()
const registration = registerAuthenticationProvider({
  id: 'example',
  label: 'Example Account',
  async getSessions(scopes) {
    return []
  },
  async createSession(scopes) {
    return {
      id: 'account-session',
      accessToken: 'token',
      account: { id: 'account', label: 'Example Account' },
      scopes,
    }
  },
  async removeSession(sessionId) {},
})

// Dispose the contribution when the extension deactivates.
registration.dispose()
```

The editor can call `executeAuthenticationProviderGetSessions`, `executeAuthenticationProviderCreateSession`, and `executeAuthenticationProviderRemoveSession` by provider id. Session callbacks are responsible for account selection, consent, token storage, and revocation.

## Synchronous file caches

`getCacheFileHandle(name)` returns a cloneable OPFS `FileSystemFileHandle` in a
namespace assigned to the calling extension. Names contain 1–80 lowercase ASCII
letters, digits or hyphens and start with a letter or digit. Reopening the same
name preserves data across extension-worker restarts.

A dedicated worker may open the handle with `createSyncAccessHandle()` and read
cached bytes synchronously. Use its default exclusive lock, close it on disposal,
and fall back to uncached reads when storage or locking is unavailable. The
extension controls its cache format, size limits, integrity checks and source
invalidation. A cache file must never be treated as authoritative source data.
This API requires a runtime with `Extensions.getCacheFileHandle` support.

## Extension cache storage

`getCacheStorageItem`, `setCacheStorageItem` and `removeCacheStorageItem` use a
cache namespace bound to the calling extension. Cache keys may be shared by
different extensions without colliding. Reads return `null` for a missing item
and otherwise include its Blob, response headers and status. Writes accept a
Blob and optional response headers; check the returned `success` field because
cache storage may be unavailable or full. Keep source data authoritative and
fall back to uncached behavior when a cache operation fails.

```ts
import { getCacheStorageItem, setCacheStorageItem } from '@lvce-editor/api'

await setCacheStorageItem('image/preview.webp', previewBlob, { 'Content-Type': previewBlob.type })
const cachedPreview = await getCacheStorageItem('image/preview.webp')
```

The API requires a runtime with `Extensions.sendMessagePortToCacheWorker`
support.

## Inline text decorations

`registerEditorTextDecorationProvider({ id, provideEditorTextDecorations })` registers an independently owned underline provider. Add `onEditorTextDecoration` to the extension activation events. The provider receives `{ uri, languageId, text, selections }` and returns an array of `{ startRowIndex, startColumnIndex, endRowIndex, endColumnIndex, color, thickness? }`. Coordinates are zero-based UTF-16 positions with an exclusive end. Selections are normalized in document order. Empty ranges draw nothing; out-of-document ranges are ignored. Colors are six-digit hex strings and thickness is an integer from 1 to 4 pixels (default 2). Arbitrary CSS is not accepted.

Call `await refreshEditorTextDecorations()` to replace the active editor's provider results after changing extension state. Returning `[]` clears that provider's underlines. Dispose the registration and refresh to remove its output; disposal is idempotent. Results from disposed providers are discarded, including in-flight requests. Providers are queried again after document edits, and own their range tracking policy; they must calculate ranges against the supplied text. Underlines are independent of built-in links, diagnostic squiggles, line decorations and gutter decorations. Restarting an extension requires a refresh (for example, refresh the preview after reloading its extension).

### Integrated terminal execution

Declare `"permissions": ["terminal.execute"]` in `extension.json`, then call
`runInTerminal({ command: 'node', args: ['/workspace/example.js'], cwd: '/workspace' })`.
Arguments are passed separately to the process; do not build a shell command string.
The host binds permission checks to the calling extension. Missing or malformed
permissions, disabled extensions and disposed runtimes are rejected.

### Explorer context menus

Activate on `onExplorerContextMenu` and call `registerExplorerContextMenuProvider`.
Its `provideMenuEntries({ uri, isDirectory })` callback returns `{ id, label, command }`
items for the clicked resource. Register the command with `registerCommand` and
list it in the manifest's `commands`; it receives the clicked URI as its argument.
Dispose the provider to remove its contributions.
