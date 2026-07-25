import * as GetExtensions from '../GetExtensions/GetExtensions.ts'
import * as GetJsonSchemasFromExtension from '../GetJsonSchemasFromExtension/GetJsonSchemasFromExtension.ts'
import * as Platform from '../Platform/Platform.ts'

export const getJsonSchemas = async (): Promise<readonly any[]> => {
  const extensions = await GetExtensions.getExtensions()
  return extensions.flatMap((extension: any) => GetJsonSchemasFromExtension.getJsonSchemasFromExtension(extension, Platform.platform))
}
