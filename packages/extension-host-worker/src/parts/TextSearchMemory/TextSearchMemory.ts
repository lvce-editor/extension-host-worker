import * as Assert from '../Assert/Assert.ts'
import * as FileSystemMemory from '../FileSystemMemory/FileSystemMemory.ts'

export const textSearch = async (scheme: string, root: string, query: string, options: any, assetDir: string): Promise<any> => {
  Assert.string(scheme)
  Assert.string(root)
  Assert.string(query)
  const files = FileSystemMemory.getFiles()
  console.log({ files })
  throw new Error('not implemented')
}
