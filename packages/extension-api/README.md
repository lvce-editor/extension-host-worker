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
