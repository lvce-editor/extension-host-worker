export const getFile = (handle: FileSystemFileHandle): Promise<File> => {
  return handle.getFile()
}
