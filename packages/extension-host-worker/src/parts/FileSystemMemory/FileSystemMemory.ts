import type { Dirent } from '../Dirent/Dirent.ts'
import * as DirentType from '../DirentType/DirentType.ts'
import { FileNotFoundError } from '../FileNotFoundError/FileNotFoundError.ts'
import * as FileSystemMemoryState from '../FileSystemMemoryState/FileSystemMemoryState.ts'
import * as GetContentType from '../GetContentType/GetContentType.ts'
import * as PathSeparatorType from '../PathSeparatorType/PathSeparatorType.ts'

// TODO move this to an extension?

export const readFile = (uri: string): string => {
  const dirent = FileSystemMemoryState.getDirent(uri)
  if (!dirent) {
    throw new FileNotFoundError(uri)
  }
  if (dirent.type !== DirentType.File) {
    throw new Error('file is a directory')
  }
  return dirent.content
}

export const exists = (uri: string): boolean => {
  const dirent = FileSystemMemoryState.getDirent(uri) || FileSystemMemoryState.getDirent(`${uri}/`)
  if (!dirent) {
    return false
  }
  return true
}

const ensureParentDir = (uri: string): void => {
  const startIndex = 0
  let endIndex = uri.indexOf(PathSeparatorType.Slash)
  while (endIndex >= 0) {
    const part = uri.slice(startIndex, endIndex + 1)
    FileSystemMemoryState.setDirent(part, {
      type: DirentType.Directory,
      content: '',
    })
    endIndex = uri.indexOf(PathSeparatorType.Slash, endIndex + 1)
  }
}

export const writeFile = (uri: string, content: string): void => {
  const dirent = FileSystemMemoryState.getDirent(uri)
  if (dirent) {
    // TODO create new dirent
    // @ts-ignore
    dirent.content = content
  } else {
    ensureParentDir(uri)
    FileSystemMemoryState.setDirent(uri, {
      type: DirentType.File,
      content,
    })
  }
}

export const mkdir = (uri: string): void => {
  if (!uri.endsWith(PathSeparatorType.Slash)) {
    uri += PathSeparatorType.Slash
  }
  ensureParentDir(uri)
  FileSystemMemoryState.setDirent(uri, {
    type: DirentType.Directory,
    content: '',
  })
}

export const getPathSeparator = (): string => {
  return PathSeparatorType.Slash
}

export const remove = (uri: string): void => {
  const toDelete: string[] = []
  for (const key of Object.keys(FileSystemMemoryState.getAll())) {
    if (key.startsWith(uri)) {
      toDelete.push(key)
    }
  }
  for (const key of toDelete) {
    FileSystemMemoryState.remove(key)
  }
}

const renameFile = (oldUri: string, newUri: string): void => {
  const content = readFile(oldUri)
  writeFile(newUri, content)
  remove(oldUri)
}

export const copy = (oldUri: string, newUri: string): void => {
  const content = readFile(oldUri)
  writeFile(newUri, content)
}

const renameDirectory = (oldUri: string, newUri: string): void => {
  if (!oldUri.endsWith(PathSeparatorType.Slash)) {
    oldUri += PathSeparatorType.Slash
  }
  if (!newUri.endsWith(PathSeparatorType.Slash)) {
    newUri += PathSeparatorType.Slash
  }
  ensureParentDir(newUri)
  FileSystemMemoryState.setDirent(newUri, {
    type: DirentType.Directory,
    content: '',
  })
  const allFiles = FileSystemMemoryState.getAll()
  for (const [key, value] of Object.entries(allFiles)) {
    if (key.startsWith(oldUri)) {
      const newPath = key.replace(oldUri, newUri)
      FileSystemMemoryState.setDirent(newPath, value)
    }
  }
  remove(oldUri)
}

export const rename = (oldUri: string, newUri: string): void => {
  const item = FileSystemMemoryState.getDirent(oldUri) || FileSystemMemoryState.getDirent(`${oldUri}/`)
  if (!item) {
    throw new FileNotFoundError(oldUri)
  }
  if (item.type === DirentType.Directory) {
    renameDirectory(oldUri, newUri)
    return
  }
  renameFile(oldUri, newUri)
}

export const readDirWithFileTypes = (uri: string): readonly Dirent[] => {
  if (!uri.endsWith(PathSeparatorType.Slash)) {
    uri += PathSeparatorType.Slash
  }
  const dirents: Dirent[] = []
  for (const [key, value] of Object.entries(FileSystemMemoryState.getAll())) {
    if (key.startsWith(uri)) {
      // @ts-ignore
      switch (value.type) {
        case DirentType.Directory:
          if (!key.slice(0, -1).includes(PathSeparatorType.Slash, uri.length) && key !== `${uri}/` && key !== uri) {
            dirents.push({
              // @ts-ignore
              type: value.type,
              name: key.slice(uri.length, -1),
            })
          }
          break
        case DirentType.File:
          if (!key.includes(PathSeparatorType.Slash, uri.length + 1)) {
            dirents.push({
              // @ts-ignore
              type: value.type,
              name: key.slice(uri.length),
            })
          }
          break
        default:
          break
      }
    }
  }
  return dirents
}

export const getBlob = (uri: string, type?: string): Blob => {
  const content = readFile(uri)
  const contentType = type || GetContentType.getContentType(uri)
  const blob = new Blob([content], {
    type: contentType,
  })
  return blob
}

export const getBlobUrl = (uri: string, type?: string): string => {
  const blob = getBlob(uri, type)
  const url = URL.createObjectURL(blob)
  return url
}

export const chmod = (): void => {
  throw new Error('[memfs] chmod not implemented')
}

export const getFiles = (): FileSystemMemoryState.Files => {
  return FileSystemMemoryState.getAll()
}
