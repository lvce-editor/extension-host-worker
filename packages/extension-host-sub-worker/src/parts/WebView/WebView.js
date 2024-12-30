import * as CommandState from '../CommandState/CommandState.js'

const ports = Object.create(null)

export const create = async (options) => {
  const port = ports[options.id]
  await CommandState.execute('WebView.create', {
    ...options,
    port,
  })
}

export const setPort = (id, port) => {
  ports[id] = port
}
