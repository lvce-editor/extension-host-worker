import type { SearchResult } from '../SearchResult/SearchResult.ts'
import * as Assert from '../Assert/Assert.ts'
import { FileNotFoundError } from '../FileNotFoundError/FileNotFoundError.ts'
import * as GetDirectoryHandle from '../GetDirectoryHandle/GetDirectoryHandle.ts'
import * as TextSearchRecursively from '../TextSearchRecursively/TextSearchRecursively.ts'

export const textSearch = async (scheme: string, root: string, query: string): Promise<readonly SearchResult[]> => {
  Assert.string(scheme)
  Assert.string(root)
  Assert.string(query)
  const relativeRoot = root.slice('html://'.length)
  const handle = await GetDirectoryHandle.getDirectoryHandle(relativeRoot)
  if (!handle) {
    throw new FileNotFoundError(relativeRoot)
  }
  const all: SearchResult[] = []
  await TextSearchRecursively.textSearchRecursively(all, '', handle, query)
  return all
}
