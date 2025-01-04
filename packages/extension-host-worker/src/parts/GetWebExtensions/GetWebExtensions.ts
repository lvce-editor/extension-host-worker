import * as ExtensionMetaState from '../ExtensionMetaState/ExtensionMetaState.ts'
import * as Platform from '../Platform/Platform.ts'
import * as PlatformType from '../PlatformType/PlatformType.ts'
import * as Rpc from '../Rpc/Rpc.js'
import * as WebExtensionsUrl from '../WebExtensionsUrl/WebExtensionsUrl.ts'
import * as GetJson from '../GetJson/GetJson.ts'

const getSharedProcessExtensions = () => {
  return Rpc.invoke(/* ExtensionManagement.getExtensions */ 'ExtensionManagement.getExtensions')
}

const getStaticWebExtensions = () => {
  return GetJson.getJson(WebExtensionsUrl.webExtensionsUrl)
}

const getWebExtensionsWeb = async () => {
  const staticWebExtensions = await getStaticWebExtensions()
  return [...staticWebExtensions, ...ExtensionMetaState.state.webExtensions]
}

const isWebExtension = (extension) => {
  return extension && typeof extension.browser === 'string'
}

const getWebExtensionsDefault = async () => {
  const staticWebExtensions = await getStaticWebExtensions()
  const sharedProcessExtensions = await getSharedProcessExtensions()
  const sharedProcessWebExtensions = sharedProcessExtensions.filter(isWebExtension)
  return [...staticWebExtensions, sharedProcessWebExtensions, ...ExtensionMetaState.state.webExtensions]
}

export const getWebExtensions = async () => {
  try {
    switch (Platform.platform) {
      case PlatformType.Web:
        return getWebExtensionsWeb()
      default:
        return getWebExtensionsDefault()
    }
  } catch {
    return ExtensionMetaState.state.webExtensions
  }
}
