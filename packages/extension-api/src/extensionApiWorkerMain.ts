import * as ExtensionApiWorkerCommandMap from './parts/ExtensionApiWorkerCommandMap/ExtensionApiWorkerCommandMap.ts'
import { listen } from './parts/ExtensionApiWorkerListen/ExtensionApiWorkerListen.ts'
import { createJsonRpcServer } from './parts/JsonRpcServer/JsonRpcServer.ts'

const main = async (): Promise<void> => {
  const port = await listen()
  createJsonRpcServer({
    commandMap: ExtensionApiWorkerCommandMap.commandMap,
    messagePort: port,
  })
}

main()
