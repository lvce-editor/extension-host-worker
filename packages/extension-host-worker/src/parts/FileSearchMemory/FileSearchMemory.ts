import * as Assert from '../Assert/Assert.ts'
import * as DirentType from '../DirentType/DirentType.ts'
import * as FileSystemMemory from '../FileSystemMemory/FileSystemMemory.ts'

export const fileSearch = async (scheme: string, root: string, query: string, options: any, assetDir: string): Promise<readonly string[]> => {
  Assert.string(scheme)
  Assert.string(root)
  Assert.string(query)
  const files = FileSystemMemory.getFiles()
  const allResults: string[] = []
  for (const [key, value] of Object.entries(files)) {
    if (value.type === DirentType.File) {
      allResults.push(key)
    }
  }
  return allResults
}
