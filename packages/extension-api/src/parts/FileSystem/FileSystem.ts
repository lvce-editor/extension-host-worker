import { FileSystemWorker } from '@lvce-editor/rpc-registry'
import type { FileSystemDirent } from '../FileSystemDirent/FileSystemDirent.ts'

export const exists = async (uri: string): Promise<boolean> => {
  return FileSystemWorker.exists(uri)
}

export const readDirWithFileTypes = async (uri: string): Promise<readonly FileSystemDirent[]> => {
  return FileSystemWorker.readDirWithFileTypes(uri)
}

export const readFile = async (uri: string): Promise<string> => {
  return FileSystemWorker.readFile(uri)
}

export type { FileSystemDirent } from '../FileSystemDirent/FileSystemDirent.ts'
