import * as Assert from '../Assert/Assert.ts'
import * as DirentType from '../DirentType/DirentType.ts'
import * as FileSystemMemory from '../FileSystemMemory/FileSystemMemory.ts'
import * as MatchesUri from '../MatchesUri/MatchesUri.ts'
import * as TextSearchInText from '../TextSearchInText/TextSearchInText.ts'

export const textSearch = async (scheme: string, root: string, query: string, options: any, assetDir: string): Promise<any> => {
  Assert.string(scheme)
  Assert.string(root)
  Assert.string(query)
  const { results } = await textSearch2(scheme, root, query, options, assetDir)
  return results
}

export const textSearch2 = async (scheme: string, root: string, query: string, options: any, assetDir: string): Promise<any> => {
  Assert.string(scheme)
  Assert.string(root)
  Assert.string(query)
  const files = FileSystemMemory.getFiles()
  const relativeRoot = root.slice('memfs://'.length)
  const allResults: any[] = []
  const flags = options.flags || 0
  for (const [key, value] of Object.entries(files)) {
    if (!MatchesUri.matchesUri(key, relativeRoot, options.include, options.exclude)) {
      continue
    }
    if (value.type === DirentType.File) {
      const relativeUri = key.slice(relativeRoot.length + 1)
      const results = TextSearchInText.textSearchInText(relativeUri, value.content, query, flags)
      allResults.push(...results)
    }
  }
  return {
    results: options.limit ? allResults.slice(0, options.limit) : allResults,
    limitHit: allResults.length > options.limit,
  }
}
