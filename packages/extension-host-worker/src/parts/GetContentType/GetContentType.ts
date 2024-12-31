import * as GetMimeType from '../GetMimeType/GetMimeType.ts'
import * as Path from '../Path/Path.ts'

export const getContentType = (uri: string): string => {
  const extension = Path.extname(uri)
  const mime = GetMimeType.getMimeType(extension)
  return mime
}
