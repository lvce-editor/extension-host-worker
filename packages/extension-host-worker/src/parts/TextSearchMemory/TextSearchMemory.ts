import * as Assert from '../Assert/Assert.ts'
import * as DirentType from '../DirentType/DirentType.ts'
import * as FileSystemMemory from '../FileSystemMemory/FileSystemMemory.ts'
import * as TextSearchInText from '../TextSearchInText/TextSearchInText.ts'

export const textSearch = async (scheme: string, root: string, query: string, options: any, assetDir: string): Promise<any> => {
  Assert.string(scheme)
  Assert.string(root)
  Assert.string(query)
  const files = FileSystemMemory.getFiles()
  const relativeRoot = root.slice('memfs://'.length)
  const allResults: any[] = []
  for (const [key, value] of Object.entries(files)) {
    if (!key.startsWith(relativeRoot)) {
      continue
    }
    if (options.include && typeof options.include === 'string' && !key.includes(options.include)) {
      continue
    }
    if (options.exclude && typeof options.exclude === 'string' && key.includes(options.exclude)) {
      continue
    }
    if (value.type === DirentType.File) {
      const relativeUri = key.slice(relativeRoot.length + 1)
      const results = TextSearchInText.textSearchInText(relativeUri, value.content, query)
      allResults.push(...results)
    }
  }
  return allResults
}
