import * as GetDirectoryHandle from '../GetDirectoryHandle/GetDirectoryHandle.ts'
import * as SearchFilesRecursively from '../SearchFilesRecursively/SearchFilesRecursively.ts'
import { VError } from '../VError/VError.ts'

export const searchFile = async (uri: string): Promise<readonly string[]> => {
  const path = uri.slice('html://'.length)
  const handle = await GetDirectoryHandle.getDirectoryHandle(path)
  if (!handle) {
    // @ts-ignore
    throw new VError(`Folder not found ${uri}`)
  }
  const all: any[] = []
  await SearchFilesRecursively.searchFilesRecursively(all, '', handle)
  return all
}
