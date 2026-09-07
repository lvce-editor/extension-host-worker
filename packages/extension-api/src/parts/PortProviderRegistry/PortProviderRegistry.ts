import type { Disposable } from '../Disposable/Disposable.ts'
import type { ForwardedPort } from '../ForwardedPort/ForwardedPort.ts'
import type { PortProvider } from '../PortProvider/PortProvider.ts'
import * as ExtensionApiCommandRegistry from '../ExtensionApiCommandRegistry/ExtensionApiCommandRegistry.ts'
import { ExtensionApiError } from '../ExtensionApiError/ExtensionApiError.ts'

const providers = new Map<string, PortProvider>()

export const providePorts = async (workspaceUri: string): Promise<readonly ForwardedPort[]> => {
  const scheme = /^([a-z][a-z0-9+.-]*):/i.exec(workspaceUri)?.[1].toLowerCase()
  const provider = scheme ? providers.get(scheme) : undefined
  if (!provider) {
    return []
  }
  const ports = await provider.providePorts(workspaceUri)
  if (
    !Array.isArray(ports) ||
    ports.some(
      (port) => !port || !Number.isSafeInteger(port.port) || port.port < 1 || port.port > 65_535 || typeof port.forwardedAddress !== 'string',
    )
  ) {
    throw new ExtensionApiError('port provider returned invalid ports')
  }
  return providers.get(scheme!) === provider ? ports : []
}

export const registerPortProvider = (provider: PortProvider): Disposable => {
  if (
    !provider ||
    typeof provider.scheme !== 'string' ||
    !/^[a-z][a-z0-9+.-]*$/.test(provider.scheme) ||
    typeof provider.providePorts !== 'function'
  ) {
    throw new ExtensionApiError('port provider requires a URI scheme and providePorts function')
  }
  const { scheme } = provider
  if (providers.has(scheme)) {
    throw new ExtensionApiError(`port provider for ${scheme} is already registered`)
  }
  providers.set(scheme, provider)
  ExtensionApiCommandRegistry.registerCommandMap({ 'ExtensionApi.providePorts': providePorts })
  return {
    dispose(): void {
      if (providers.get(scheme) === provider) {
        providers.delete(scheme)
      }
    },
  }
}
