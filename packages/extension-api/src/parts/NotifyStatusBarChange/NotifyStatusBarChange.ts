import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'

export const notifyStatusBarChange = async (id: string): Promise<void> => {
  await ExtensionManagementWorker.invoke('StatusBar.handleChange', id)
}
