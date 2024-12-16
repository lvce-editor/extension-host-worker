import * as Assert from '../Assert/Assert.ts'
import * as GetJson from '../GetJson/GetJson.ts'
import * as GetText from '../GetText/GetText.ts'
import * as TextSearchInText from '../TextSearchInText/TextSearchInText.ts'

export const textSearch = async (scheme: string, root: string, query: string, options: any, assetDir: string): Promise<any> => {
  Assert.string(scheme)
  Assert.string(root)
  Assert.string(query)
  const fetchUri = `${assetDir}/config/fileMap.json`
  const fileList = await GetJson.getJson(fetchUri)
  const allResults: any[] = []
  const relativeRoot = root.slice('fetch://'.length)
  for (const uri of fileList) {
    const fetchUri = `${assetDir}${uri}`
    const content = await GetText.getText(fetchUri)
    const relativeUri = uri.slice(relativeRoot.length + 1)
    const results = TextSearchInText.textSearchInText(relativeUri, content, query)
    allResults.push(...results)
  }
  return allResults
}
