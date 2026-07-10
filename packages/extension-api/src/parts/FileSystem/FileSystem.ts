import { ExtensionManagementWorker, FileSystemWorker } from '@lvce-editor/rpc-registry'
import type { FileSystemDirent } from '../FileSystemDirent/FileSystemDirent.ts'

const MemfsPrefix = 'memfs://'

const isMemory = (uri: string): boolean => {
  return uri.startsWith(MemfsPrefix)
}

export const exists = async (uri: string): Promise<boolean> => {
  return FileSystemWorker.exists(uri)
}

export const readDirWithFileTypes = async (uri: string): Promise<readonly FileSystemDirent[]> => {
  return FileSystemWorker.readDirWithFileTypes(uri)
}

export const readFile = async (uri: string): Promise<string> => {
  if (isMemory(uri)) {
    return ExtensionManagementWorker.invoke('ExtensionApi.readFile', uri)
  }
  return FileSystemWorker.readFile(uri)
}

export const mkdir = async (uri: string): Promise<void> => {
  await FileSystemWorker.mkdir(uri)
}

export const remove = async (uri: string): Promise<void> => {
  await FileSystemWorker.remove(uri)
}

export const stat = async (uri: string): Promise<unknown> => {
  return FileSystemWorker.stat(uri)
}

export const writeFile = async (uri: string, content: string): Promise<void> => {
  await FileSystemWorker.writeFile(uri, content)
}

export type { FileSystemDirent } from '../FileSystemDirent/FileSystemDirent.ts'
