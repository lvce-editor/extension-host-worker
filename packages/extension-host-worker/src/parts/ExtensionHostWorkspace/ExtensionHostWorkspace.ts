import { RendererWorker } from '@lvce-editor/rpc-registry'

export const state = {
  workspacePath: '',
}

export const setWorkspacePath = (path) => {
  state.workspacePath = path
}

export const getWorkspaceFolder = (path) => {
  return state.workspacePath
}

export const handleWorkspaceRefresh = async () => {
  // @ts-ignore
  await RendererWorker.invoke('Layout.handleWorkspaceRefresh')
}
