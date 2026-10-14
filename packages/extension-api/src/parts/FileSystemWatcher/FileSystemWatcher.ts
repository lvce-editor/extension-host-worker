import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'
import * as ExtensionApiCommandRegistry from '../ExtensionApiCommandRegistry/ExtensionApiCommandRegistry.ts'

export interface FileSystemWatchOptions {
  /** Limit immediate children to these names. Requires recursive=false; missing children are observed when created. */
  readonly childNames?: readonly string[]
  readonly exclude?: readonly string[]
  /** Defaults to true. Set false to observe only immediate children of the roots. */
  readonly recursive?: boolean
  readonly roots: readonly string[]
}

export interface FileSystemWatchEvent {
  readonly error?: { readonly code?: string; readonly message: string; readonly name: string }
  readonly eventName: string
  readonly uri: string
}

export interface FileSystemWatcher {
  dispose(): Promise<void>
}

export type FileSystemWatchHandler = (event: FileSystemWatchEvent) => unknown | Promise<unknown>

const handlers = new Map<number, FileSystemWatchHandler>()
let nextId = 0

export const handleFileWatcherEvent = async (id: number, event: FileSystemWatchEvent): Promise<void> => {
  await handlers.get(id)?.(event)
}

// Resolves only after the backend is ready; failures reject without leaving a registration.
// Runtime failures arrive as error events. Consumers must restore conservative validation.
export const createFileSystemWatcher = async (options: FileSystemWatchOptions, handler: FileSystemWatchHandler): Promise<FileSystemWatcher> => {
  if (typeof handler !== 'function') throw new TypeError('File watcher handler must be a function')
  const id = ++nextId
  handlers.set(id, handler)
  ExtensionApiCommandRegistry.registerCommandMap({ 'ExtensionApi.handleFileWatcherEvent': handleFileWatcherEvent })
  let disposed = false
  const dispose = async (): Promise<void> => {
    if (disposed) return
    handlers.delete(id)
    await ExtensionManagementWorker.invoke('Extensions.disposeFileSystemWatcher', id)
    disposed = true
  }
  try {
    await ExtensionManagementWorker.invoke('Extensions.createFileSystemWatcher', id, options)
    return { dispose }
  } catch (error) {
    try {
      await dispose()
    } catch {
      // Backend registration also owns rollback; retain the setup failure.
    }
    throw error
  }
}
