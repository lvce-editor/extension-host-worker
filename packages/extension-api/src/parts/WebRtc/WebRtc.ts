import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'

export interface StartWebRpcAudioStreamOptions {
  readonly elementLocator: string
  readonly ephemeralKey: string
  readonly port: MessagePort
  readonly uid: number
}

export const startWebRtcAudioStream = async (options: StartWebRpcAudioStreamOptions): Promise<string> => {
  return await ExtensionManagementWorker.invokeAndTransfer('WebRtc.startWebRtcAudioStream', options)
}

export interface SetRemoteDescriptionOptions {
  readonly sdp: string
  readonly type: 'answer'
  readonly uid: number
}

export const setRemoteDescription = async (options: SetRemoteDescriptionOptions): Promise<void> => {
  await ExtensionManagementWorker.invoke('WebRtc.setRemoteDescription', options)
}

export const stopWebRtcAudioStream = async (uid: number): Promise<string> => {
  return await ExtensionManagementWorker.invoke('WebRtc.stopWebRtcAudioStream', uid)
}
