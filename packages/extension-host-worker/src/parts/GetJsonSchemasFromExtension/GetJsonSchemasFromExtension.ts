import * as GetUrlPrefix from '../GetUrlPrefix/GetUrlPrefix.ts'

const isAbsoluteUrl = (url: string): boolean => {
  return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:') || url.startsWith('/')
}

const resolveSchemaUrl = (platform: string, extensionPath: string, url: string): string => {
  if (isAbsoluteUrl(url)) {
    return url
  }
  const urlPrefix = GetUrlPrefix.getUrlPrefix(platform, extensionPath).replace(/\/$/, '')
  const relativeUrl = url.replace(/^\.\//, '')
  return `${urlPrefix}/${relativeUrl}`
}

export const getJsonSchemasFromExtension = (extension: any, platform: string): readonly any[] => {
  if (!extension || !Array.isArray(extension.jsonValidation) || typeof extension.path !== 'string') {
    return []
  }
  return extension.jsonValidation.flatMap((schema: any) => {
    if (!schema || typeof schema.url !== 'string' || (!Array.isArray(schema.fileMatch) && typeof schema.fileMatch !== 'string')) {
      return []
    }
    return [
      {
        fileMatch: schema.fileMatch,
        url: resolveSchemaUrl(platform, extension.path, schema.url),
      },
    ]
  })
}
