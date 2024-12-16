import * as FileSystemDirectoryHandle from '../FileSystemDirectoryHandle/FileSystemDirectoryHandle.ts'
import { VError } from '../VError/VError.ts'

export const getChildHandles = async (handle: FileSystemHandle): Promise<readonly FileSystemHandle[]> => {
  try {
    return await FileSystemDirectoryHandle.getChildHandles(handle)
  } catch (error) {
    throw new VError(error, 'failed to get child handles')
  }
}
