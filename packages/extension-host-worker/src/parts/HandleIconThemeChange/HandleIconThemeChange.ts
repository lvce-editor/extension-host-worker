import * as RendererWorker from '../Rpc/Rpc.ts'

export const handleIconThemeChange = async (): Promise<void> => {
  await RendererWorker.invoke('IconTheme.handleIconThemeChange')
}
