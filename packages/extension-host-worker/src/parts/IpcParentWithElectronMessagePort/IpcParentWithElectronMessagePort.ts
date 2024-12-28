import { IpcParentWithModuleWorkerAndWorkaroundForChromeDevtoolsBug } from '@lvce-editor/ipc'
import * as SendMessagePortToElectron from '../SendMessagePortToElectron/SendMessagePortToElectron.ts'

const sendPort = async ({ port }: { port: MessagePort }) => {
  await SendMessagePortToElectron.sendMessagePortToElectron(
    port,
    'HandleMessagePortForExtensionHostHelperProcess.handleMessagePortForExtensionHostHelperProcess'
  )
}

export const create = async ({ type }) => {
  const port = await IpcParentWithModuleWorkerAndWorkaroundForChromeDevtoolsBug.create({
    url: '',
    name: '',
    sendPort,
  })
  return port
}

export const wrap = (port) => {
  return IpcParentWithModuleWorkerAndWorkaroundForChromeDevtoolsBug.wrap(port)
}
