import * as Path from '../Path/Path.ts'
import * as PersistentFileHandle from '../PersistentFileHandle/PersistentFileHandle.ts'

export const getDirectoryHandle = async (uri: string): Promise<FileSystemHandle | undefined> => {
  const handle = await PersistentFileHandle.getHandle(uri)
  if (handle) {
    return handle
  }
  const dirname = Path.dirname('/', uri)
  if (uri === dirname) {
    return undefined
  }
  return getDirectoryHandle(dirname)
}
