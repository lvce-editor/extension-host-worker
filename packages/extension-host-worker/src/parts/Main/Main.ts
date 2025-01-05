import * as GlobalEventListeners from '../GlobalEventListeners/GlobalEventListeners.ts'
import * as Listen from '../Listen/Listen.ts'

export const main = async () => {
  GlobalEventListeners.setup({
    errorConstructor: Error,
    global: globalThis,
  })
  await Listen.listen()
}
