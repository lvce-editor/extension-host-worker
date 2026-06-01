import { listen } from '../ExtensionApiWorkerListen/ExtensionApiWorkerListen.ts'

export const activate = async (): Promise<void> => {
  await listen()
}
