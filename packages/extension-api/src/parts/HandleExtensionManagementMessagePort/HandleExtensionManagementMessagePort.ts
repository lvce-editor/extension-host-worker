import { commandMap as extensionApiCommandMap } from '../CommandMap/CommandMap.ts'

export interface HandleExtensionManagementMessagePortOptions {
  readonly commandMap: Record<string, unknown>
  readonly createMessagePortRpcClient: (options: {
    readonly commandMap: Record<string, unknown>
    readonly messagePort: MessagePort
  }) => Promise<unknown>
  readonly port: MessagePort
}

export const handleExtensionManagementMessagePort = async ({
  commandMap,
  createMessagePortRpcClient,
  port,
}: HandleExtensionManagementMessagePortOptions): Promise<void> => {
  await createMessagePortRpcClient({
    commandMap: {
      ...extensionApiCommandMap,
      ...commandMap,
    },
    messagePort: port,
  })
}
