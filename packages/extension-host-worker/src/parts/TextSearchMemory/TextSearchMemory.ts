import * as Assert from '../Assert/Assert.ts'
import * as DirentType from '../DirentType/DirentType.ts'
import * as FileSystemMemory from '../FileSystemMemory/FileSystemMemory.ts'
import * as TextSearchInText from '../TextSearchInText/TextSearchInText.ts'

const matchesUri = (uri: string, relativeRoot: string, include: string, exclude: string): boolean => {
  if (!uri.startsWith(relativeRoot)) {
    return false
  }
  if (include && typeof include === 'string' && !uri.includes(include)) {
    return false
  }
  if (exclude && typeof exclude === 'string' && uri.includes(exclude)) {
    return false
  }
  return true
}

export const textSearch = async (scheme: string, root: string, query: string, options: any, assetDir: string): Promise<any> => {
  Assert.string(scheme)
  Assert.string(root)
  Assert.string(query)
  const files = FileSystemMemory.getFiles()
  const relativeRoot = root.slice('memfs://'.length)
  const allResults: any[] = []
  const flags = options.flags || 0
  for (const [key, value] of Object.entries(files)) {
    if (!matchesUri(key, relativeRoot, options.include, options.exclude)) {
      continue
    }
    if (value.type === DirentType.File) {
      const relativeUri = key.slice(relativeRoot.length + 1)
      const results = TextSearchInText.textSearchInText(relativeUri, value.content, query, flags)
      allResults.push(...results)
    }
  }
  return allResults
}
