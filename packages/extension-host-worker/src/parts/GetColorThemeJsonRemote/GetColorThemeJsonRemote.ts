import * as Rpc from '../Rpc/Rpc.ts'

export const getColorThemeJson = (colorThemeId) => {
  return Rpc.invoke(/* ExtensionHost.getColorThemeJson */ 'ExtensionHost.getColorThemeJson', /* colorThemeId */ colorThemeId)
}
