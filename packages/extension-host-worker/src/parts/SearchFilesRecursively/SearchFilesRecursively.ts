import * as FileHandleType from '../FileHandleType/FileHandleType.ts'
import * as FileSystemDirectoryHandle from '../FileSystemDirectoryHandle/FileSystemDirectoryHandle.ts'

const toIgnore = ['.git', 'node_modules', 'dist', 'dist2']

export const searchFilesRecursively = async (all: any, parent: any, handle: any): Promise<void> => {
  const childHandles = await FileSystemDirectoryHandle.getChildHandles(handle)
  const promises: any[] = []
  for (const childHandle of childHandles) {
    if (toIgnore.includes(childHandle.name)) {
      continue
    }
    const absolutePath = parent + '/' + childHandle.name
    switch (childHandle.kind) {
      case FileHandleType.Directory:
        promises.push(searchFilesRecursively(all, absolutePath, childHandle))
        break
      case FileHandleType.File:
        all.push(absolutePath)
        break
      default:
        break
    }
  }
  await Promise.all(promises)
}
