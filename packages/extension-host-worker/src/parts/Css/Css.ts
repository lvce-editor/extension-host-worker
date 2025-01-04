import * as Rpc from '../Rpc/Rpc.ts'

export const addCssStyleSheet = (id, css) => {
  return Rpc.invoke('Css.addCssStyleSheet', id, css)
}
