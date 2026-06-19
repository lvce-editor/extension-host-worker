import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'
import { listen } from '../ExtensionApiWorkerListen/ExtensionApiWorkerListen.ts'
import { initializeFileSystemWorker } from '../FileSystemWorker/FileSystemWorker.ts'
import { activateOutputChannels } from '../OutputChannel/OutputChannel.ts'

let rpcPromise: Promise<Awaited<ReturnType<typeof listen>>> | undefined

export const activate = async (): Promise<void> => {
  if (!rpcPromise) {
    rpcPromise = listen()
  }
  const rpc = await rpcPromise
  ExtensionManagementWorker.set(rpc)
  await initializeFileSystemWorker()
  activateOutputChannels()
}
