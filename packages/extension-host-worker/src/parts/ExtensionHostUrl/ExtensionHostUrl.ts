import type { GetRemoteUrlOptions } from '../ExtensionHostRemoteUrlOptions/ExtensionHostRemoteUrlOptions.ts'
import * as GetProtocol from '../GetProtocol/GetProtocol.ts'
import * as GetRemoteUrlForWebView from '../GetRemoteUrlForWebView/GetRemoteUrlForWebView.ts'
import * as Platform from '../Platform/Platform.ts'
import * as PlatformType from '../PlatformType/PlatformType.ts'
import * as Rpc from '../Rpc/Rpc.ts'

const isFileProtocol = (protocol: string): boolean => {
  return !protocol || protocol === 'file'
}

export const getRemoteUrlSync = (uri: string): string => {
  const protocol = GetProtocol.getProtocol(uri)
  if (protocol === 'http://' || protocol === 'https://') {
    return uri
  }
  const withoutPrefix = uri.startsWith('file://') ? uri.slice('file://'.length) : uri
  if (Platform.platform === PlatformType.Remote && isFileProtocol(protocol)) {
    if (uri.startsWith('/')) {
      return `/remote${withoutPrefix}`
    }
    return `/remote/${withoutPrefix}`
  }
  if (Platform.platform === PlatformType.Electron && isFileProtocol(protocol)) {
    if (uri.startsWith('/')) {
      return `/remote${withoutPrefix}`
    }
    return `/remote/${withoutPrefix}`
  }
  return ''
}

export const getRemoteUrl = async (uri: string, options: GetRemoteUrlOptions = {}): Promise<string> => {
  // TODO uri should always have protocol
  // then ask file system provider for remote url, for example disk file system provider or html file system provider
  const syncUrl = getRemoteUrlSync(uri)
  if (syncUrl) {
    return syncUrl
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
