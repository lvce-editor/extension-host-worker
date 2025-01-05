import * as GlobalEventListeners from '../GlobalEventListeners/GlobalEventListeners.ts'
import * as Listen from '../Listen/Listen.ts'

export const main = async () => {
  const start = performance.timeOrigin
  const a = performance.now()
  GlobalEventListeners.setup({
    errorConstructor: Error,
    global: globalThis,
  })
  await Listen.listen()
  const e = performance.now()

  console.log({
    times: {
      start,
      a,
      e,
    },
  })
}
