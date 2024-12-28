import * as FileMapUrl from '../FileMapUrl/FileMapUrl.ts'
import * as GetJson from '../GetJson/GetJson.ts'
import * as RemoveLeadingSlash from '../RemoveLeadingSlash/RemoveLeadingSlash.ts'

// TODO simplify code
// 1. don't have playground prefix in fileMap json
// 2. remove code here that removes the prefix
export const searchFile = async (path: string): Promise<readonly string[]> => {
  const fileList = await GetJson.getJson(FileMapUrl.fileMapUrl)
  const result = fileList.map(RemoveLeadingSlash.removeLeadingSlash)
  const prefixLength = path.length - 'file:///'.length
  const final: string[] = []
  for (const item of result) {
    final.push(item.slice(prefixLength))
  }
  return final
}
