import * as GetRemoteUrl from '../GetRemoteUrl/GetRemoteUrl.ts'
import * as Platform from '../Platform/Platform.ts'
import * as PlatformType from '../PlatformType/PlatformType.ts'

export const getLanguagesFromExtension = (extension: any): readonly any[] => {
  // TODO what if extension is null? should not crash process, handle error gracefully
  // TODO what if extension languages is not of type array?
  // TODO what if language is null?
  if (!extension) {
    return []
  }
  if (!extension.languages) {
    return []
  }
  const extensionPath = extension.path
  const getLanguageFromExtension = (language) => {
    if (language.tokenize) {
      if (typeof language.tokenize !== 'string') {
        console.warn(`[info] ${language.id}: language.tokenize must be of type string but was of type ${typeof language.tokenize}`)
        return {
          ...language,
          extensionPath,
          tokenize: '',
        }
      }
      const relativePath = `${extensionPath}/${language.tokenize}`
      const absolutePath = Platform.platform === PlatformType.Web ? relativePath : GetRemoteUrl.getRemoteUrl(relativePath)

      return {
        ...language,
        extensionPath,
        tokenize: absolutePath,
      }
    }
    return language
  }
  return extension.languages.map(getLanguageFromExtension)
}
