import type { SearchResult } from '../SearchResult/SearchResult.ts'
import * as FileHandleType from '../FileHandleType/FileHandleType.ts'
import * as FileSystemHtml from '../FileSystemHtml/FileSystemHtml.ts'
import * as TextSearchInFile from '../TextSearchInFile/TextSearchInFile.ts'

export const textSearchRecursively = async (all: SearchResult[], parent: string, handle: FileSystemHandle, query: string): Promise<void> => {
  const childHandles: readonly FileSystemHandle[] = await FileSystemHtml.getChildHandles(handle)
  const promises: Promise<void>[] = []
  for (const childHandle of childHandles) {
    const absolutePath = parent + '/' + childHandle.name
    switch (childHandle.kind) {
      case FileHandleType.Directory:
        promises.push(textSearchRecursively(all, absolutePath, childHandle, query))
        break
      case FileHandleType.File:
        // @ts-ignore
        promises.push(TextSearchInFile.textSearchInFile(all, childHandle, absolutePath, query))
        break
      default:
        break
    }
  }
  await Promise.all(promises)
}
