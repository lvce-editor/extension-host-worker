import type { Dirent } from '../Dirent/Dirent.ts'
import * as AssetDir from '../AssetDir/AssetDir.ts'
import * as DirentType from '../DirentType/DirentType.ts'
import * as FileMapUrl from '../FileMapUrl/FileMapUrl.ts'
import * as GetBlob from '../GetBlob/GetBlob.ts'
import * as GetJson from '../GetJson/GetJson.ts'
import * as GetText from '../GetText/GetText.ts'
import * as PathSeparatorType from '../PathSeparatorType/PathSeparatorType.ts'

// TODO move all of this to an extension

export const readFile = async (uri: string): Promise<string> => {
  const fetchUri = `${AssetDir.assetDir}${uri}`
  const text = await GetText.getText(fetchUri)
  return text
}

export const exists = async (uri: string): Promise<boolean> => {
  const response = await fetch(uri)
  if (!response.ok) {
    throw new Error(response.statusText)
  }
  return response.ok
}

export const writeFile = (): void => {
  throw new Error('not implemented')
}

export const mkdir = (): void => {
  throw new Error('not implemented')
}

export const remove = (): void => {
  throw new Error('not implemented')
}

const normalizeUri = (uri: string): string => {
  if (uri.startsWith('fetch://')) {
    return uri.slice('fetch://'.length)
  }
  return uri
}

export const readDirWithFileTypes = async (uri: string): Promise<readonly Dirent[]> => {
  const normalizedUri = normalizeUri(uri)
  const directoryPrefix = normalizedUri.endsWith(PathSeparatorType.Slash) ? normalizedUri : `${normalizedUri}${PathSeparatorType.Slash}`
  const fileList = await GetJson.getJson(FileMapUrl.fileMapUrl)
  const dirents: Dirent[] = []
  for (const fileUri of fileList) {
    if (!fileUri.startsWith(directoryPrefix)) {
      continue
    }
    const rest = fileUri.slice(directoryPrefix.length)
    if (rest.includes(PathSeparatorType.Slash)) {
      const name = rest.slice(0, rest.indexOf(PathSeparatorType.Slash))
      if (dirents.some((dirent) => dirent.name === name)) {
        continue
      }
      dirents.push({
        name,
        type: DirentType.Directory,
      })
    } else {
      dirents.push({
        name: rest,
        type: DirentType.File,
      })
    }
  }
  return dirents
}

export const chmod = (): void => {
  throw new Error('[memfs] chmod not implemented')
}

export const getBlob = async (uri: string, type?: string): Promise<Blob> => {
  const fetchUri = `${AssetDir.assetDir}${uri}`
  const blob = GetBlob.getBlob(fetchUri)
  return blob
}
