import * as FileSystemProviderState from '../FileSystemProviderState/FileSystemProviderState.ts'
import * as Rpc from '../Rpc/Rpc.ts'
import { VError } from '../VError/VError.ts'

export const registerFileSystemProvider = (fileSystemProvider) => {
  if (!fileSystemProvider.id) {
    throw new Error('Failed to register file system provider: missing id')
  }
  FileSystemProviderState.set(fileSystemProvider.id, fileSystemProvider)
}

export const readDirWithFileTypes = async (protocol, path) => {
  try {
    const provider = FileSystemProviderState.get(protocol)
    return await provider.readDirWithFileTypes(path)
  } catch (error) {
    throw new VError(error, 'Failed to execute file system provider')
  }
}

export const readFile = async (protocol, path) => {
  try {
    const provider = FileSystemProviderState.get(protocol)
    return await provider.readFile(path)
  } catch (error) {
    throw new VError(error, 'Failed to execute file system provider')
  }
}

export const readFileExternal = async (path) => {
  // TODO when file is local,
  // don't ask renderer worker
  // instead read file directly from shared process
  // this avoid parsing the potentially large message
  // and improve performance by not blocking the renderer worker
  // when reading / writing large files
  const content = await Rpc.invoke('FileSystem.readFile', path)
  return content
}

export const remove = async (protocol, path) => {
  try {
    const provider = FileSystemProviderState.get(protocol)
    return await provider.remove(path)
  } catch (error) {
    throw new VError(error, 'Failed to execute file system provider')
  }
}

export const rename = async (protocol, oldUri, newUri) => {
  try {
    const provider = FileSystemProviderState.get(protocol)
    return await provider.rename(oldUri, newUri)
  } catch (error) {
    throw new VError(error, 'Failed to execute file system provider')
  }
}

export const writeFile = async (protocol, uri, content) => {
  try {
    const provider = FileSystemProviderState.get(protocol)
    return await provider.writeFile(uri, content)
  } catch (error) {
    throw new VError(error, 'Failed to execute file system provider')
  }
}

export const getPathSeparator = (protocol) => {
  try {
    const provider = FileSystemProviderState.get(protocol)
    return provider.pathSeparator
  } catch (error) {
    throw new VError(error, 'Failed to execute file system provider')
  }
}
