import * as Rpc from '../Rpc/Rpc.ts'

export const setThemeColor = async (themeColor) => {
  await Rpc.invoke(/* Meta.setThemeColor */ 'Meta.setThemeColor', /* color */ themeColor)
}
