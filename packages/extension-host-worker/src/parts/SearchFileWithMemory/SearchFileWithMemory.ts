import * as DirentType from '../DirentType/DirentType.ts'
import * as FileSystemMemory from '../FileSystemMemory/FileSystemMemory.ts'

export const searchFile = async (scheme: string, root: string, query: string, options: any, assetDir: string): Promise<readonly string[]> => {
  const files = FileSystemMemory.getFiles()
  const allResults: string[] = []
  for (const [key, value] of Object.entries(files)) {
    if (value.type === DirentType.File) {
      allResults.push(key)
    }
  }
  return allResults
}
