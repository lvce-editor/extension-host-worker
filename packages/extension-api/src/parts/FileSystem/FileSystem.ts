import { ExtensionManagementWorker, FileSystemWorker } from '@lvce-editor/rpc-registry'
import type { FileSystemDirent } from '../FileSystemDirent/FileSystemDirent.ts'
import { executeCommand } from '../ExecuteCommand/ExecuteCommand.ts'
import { getPlatform } from '../Platform/Platform.ts'

const MemfsPrefix = 'memfs://'

export interface ReadAsObjectUrlResult {
  readonly error: string
  readonly objectUrl: string
  readonly wasFound: boolean
}

const isMemory = (uri: string): boolean => {
  return uri.startsWith(MemfsPrefix)
}

const isHttp = (uri: string): boolean => {
  return uri.startsWith('http://') || uri.startsWith('https://')
}

const getRemoteUrl = (uri: string): string => {
  const withoutPrefix = uri.startsWith('file://') ? uri.slice('file://'.length) : uri
  const normalized = withoutPrefix.replaceAll('\\', '/')
  return normalized.startsWith('/') ? `/remote${normalized}` : `/remote/${normalized}`
}

const getObjectUrl = async (uri: string): Promise<string> => {
  if (isHttp(uri)) {
    return uri
  }
  if (isMemory(uri)) {
    return (await executeCommand('Blob.getSrc', uri)) as string
  }
  const platform = await getPlatform()
  if (platform === 'web') {
    return (await executeCommand('Blob.getSrc', uri)) as string
  }
  return getRemoteUrl(uri)
}

const getErrorMessage = (error: unknown): string => {
  return error instanceof Error ? error.message : String(error)
}

export const exists = async (uri: string): Promise<boolean> => {
  return FileSystemWorker.exists(uri)
}

export const readDirWithFileTypes = async (uri: string): Promise<readonly FileSystemDirent[]> => {
  return FileSystemWorker.readDirWithFileTypes(uri)
}

export const getFileHash = async (uri: string): Promise<string> => {
  return FileSystemWorker.invoke('FileSystem.getFileHash', uri)
}

export const readFile = async (uri: string): Promise<string> => {
  if (isMemory(uri)) {
    return ExtensionManagementWorker.invoke('ExtensionApi.readFile', uri)
  }
  return FileSystemWorker.readFile(uri)
}

export const readAsObjectUrl = async (uri: string): Promise<ReadAsObjectUrlResult> => {
  try {
    const objectUrl = await getObjectUrl(uri)
    return {
      error: '',
      objectUrl,
      wasFound: true,
    }
  } catch (error) {
    return {
      error: getErrorMessage(error),
      objectUrl: '',
      wasFound: false,
    }
  }
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
