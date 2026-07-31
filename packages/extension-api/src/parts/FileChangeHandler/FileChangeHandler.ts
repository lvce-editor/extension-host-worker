import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'
import type { Disposable } from '../Disposable/Disposable.ts'
import * as ExtensionApiCommandRegistry from '../ExtensionApiCommandRegistry/ExtensionApiCommandRegistry.ts'
import { ExtensionApiError } from '../ExtensionApiError/ExtensionApiError.ts'

type UriRename = readonly [oldUri: string, newUri: string]

export interface FileChanges {
  readonly changed?: readonly string[]
  readonly deleted?: readonly string[]
  readonly renamed?: readonly UriRename[]
}

export type FileChangeHandler = (changes: Readonly<FileChanges>) => unknown | Promise<unknown>

const handlers = new Set<FileChangeHandler>()

const registerWithExtensionManagement = (): void => {
  void ExtensionManagementWorker.invoke('Extensions.registerFileChangeHandler')
}

const unregisterWithExtensionManagement = (): void => {
  void ExtensionManagementWorker.invoke('Extensions.unregisterFileChangeHandler')
}

export const registerFileChangeHandler = (handler: FileChangeHandler): Disposable => {
  if (typeof handler !== 'function') {
    throw new ExtensionApiError('file change handler must be a function')
  }
  if (handlers.has(handler)) {
    throw new ExtensionApiError('file change handler is already registered')
  }
  const wasEmpty = handlers.size === 0
  handlers.add(handler)
  ExtensionApiCommandRegistry.registerCommandMap(commandMap)
  if (wasEmpty) {
    registerWithExtensionManagement()
  }
  return {
    dispose(): void {
      if (!handlers.delete(handler)) {
        return
      }
      if (handlers.size === 0) {
        unregisterWithExtensionManagement()
      }
    },
  }
}

export const handleFileChanges = async (changes: Readonly<FileChanges> = {}): Promise<void> => {
  await Promise.all(Array.from(handlers, async (handler) => handler(changes)))
}

const commandMap = {
  'ExtensionApi.handleFileChanges': handleFileChanges,
}

export const resetFileChangeHandlers = (): void => {
  if (handlers.size === 0) {
    return
  }
  handlers.clear()
  unregisterWithExtensionManagement()
}
