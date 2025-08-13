import type { Rpc } from '@lvce-editor/rpc'
import { launchFileSystemProcess } from '../LaunchFileSystemProcess/LaunchFileSystemProcess.ts'

let fileSystemWorkerPromise: Promise<Rpc> | undefined

const getOrCreateRpc = async (): Promise<Rpc> => {
  if (!fileSystemWorkerPromise) {
    fileSystemWorkerPromise = launchFileSystemProcess()
  }
  return fileSystemWorkerPromise
}

export const append = async (uri: string, content: string): Promise<void> => {
  const rpc = await getOrCreateRpc()
  await rpc.invoke('FileSystem.appendFile', uri, content)
}
