import * as GetRemoteSrc from '../GetRemoteSrc/GetRemoteSrc.ts'
import * as IconThemeState from '../IconThemeState/IconThemeState.ts'
import * as PathSeparator from '../PathSeparator/PathSeparator.ts'

export const getAbsoluteIconPath = (iconTheme: any, icon: any): any => {
  if (!iconTheme) {
    return ''
  }
  const result = iconTheme.iconDefinitions[icon]
  const extensionPath = IconThemeState.getExtensionPath()
  if (result) {
    if (extensionPath.startsWith('http://') || extensionPath.startsWith('https://')) {
      return `${extensionPath}${result}`
    }
    if (extensionPath.includes(PathSeparator.BackSlash)) {
      const extensionUri = extensionPath.replaceAll(PathSeparator.BackSlash, PathSeparator.Slash)
      return `/remote/${extensionUri}${result}`
    }
    return GetRemoteSrc.getRemoteSrc(`${extensionPath}${result}`)
  }
  return ''
}
