import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'

export const writeClipboardText = async (text: string): Promise<void> => {
  await ExtensionManagementWorker.invoke('Extensions.writeClipboardText', text)
}
