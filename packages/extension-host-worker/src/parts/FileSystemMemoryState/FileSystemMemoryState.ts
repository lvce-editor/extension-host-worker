import type { InMemoryFile } from '../InMemoryFile/InMemoryFile.ts'

// TODO move this to an extension?

const files: Record<string, InMemoryFile> = Object.create(null)

export const getDirent = (uri: string): InMemoryFile => {
  return files[uri]
}

export const setDirent = (uri: string, dirent: InMemoryFile): void => {
  files[uri] = dirent
}

export const getAll = () => {
  return files
}

export const remove = (uri: string): void => {
  delete files[uri]
}

export const reset = (): void => {
  for (const key of Object.keys(files)) {
    remove(key)
  }
}
