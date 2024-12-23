import type { GetRemoteUrlOptions } from '../ExtensionHostRemoteUrlOptions/ExtensionHostRemoteUrlOptions.ts'
import * as GetProtocol from '../GetProtocol/GetProtocol.ts'
import * as GetRemoteUrlForWebView from '../GetRemoteUrlForWebView/GetRemoteUrlForWebView.ts'
import * as Platform from '../Platform/Platform.ts'
import * as PlatformType from '../PlatformType/PlatformType.ts'
import * as Rpc from '../Rpc/Rpc.ts'

export const getRemoteUrl = async (uri: string, options: GetRemoteUrlOptions = {}): Promise<string> => {
  // TODO uri should always have protocol
  // then ask file system provider for remote url, for example disk file system provider or html file system provider
  const protocol = GetProtocol.getProtocol(uri)
  if (Platform.platform === PlatformType.Remote && !protocol) {
    if (uri.startsWith('/')) {
      return `/remote${uri}`
    }
    return `/remote/${uri}`
  }
  if (Platform.platform === PlatformType.Electron && !protocol) {
    if (uri.startsWith('/')) {
      return `/remote${uri}`
    }
    return `/remote/${uri}`
  }
  if (options.webViewId) {
    return GetRemoteUrlForWebView.getRemoteUrlForWebView(uri, options)
  }
  if (uri.startsWith('html://')) {
    const url = await Rpc.invoke('Blob.getSrc', uri)
    return url
  }
  throw new Error(`unsupported platform for remote url`)
}
