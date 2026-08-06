import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'

export interface StartWebRpcAudioStreamOptions {
  readonly elementLocator: string
  readonly ephemeralKey: string
  readonly onData: (data: string) => void
  readonly uid: number
}

export const startWebRtcAudioStream = async (options: StartWebRpcAudioStreamOptions): Promise<string> => {
  const { onData, ...rest } = options
  const { port1, port2 } = new MessageChannel()
  port2.onmessage = (event: MessageEvent) => {
    onData(event.data)
  }
  return await ExtensionManagementWorker.invokeAndTransfer('WebRtc.startWebRtcAudioStream', {
    ...rest,
    port: port1,
  })
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
  // TODO close port2 maybe?
  return await ExtensionManagementWorker.invoke('WebRtc.stopWebRtcAudioStream', uid)
}
