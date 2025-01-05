import * as GetWebExtensions from '../GetWebExtensions/GetWebExtensions.ts'
import * as Platform from '../Platform/Platform.ts'
import * as PlatformType from '../PlatformType/PlatformType.ts'
import * as Rpc from '../Rpc/Rpc.ts'

const getSharedProcessExtensions = () => {
  return Rpc.invoke(/* ExtensionManagement.getExtensions */ 'ExtensionManagement.getExtensions')
}

export const doGetExtensions = async () => {
  if (Platform.platform === PlatformType.Web) {
    const webExtensions = await GetWebExtensions.getWebExtensions()
    return webExtensions
  }
  if (Platform.platform === PlatformType.Remote) {
    const webExtensions = await GetWebExtensions.getWebExtensions()
    const sharedProcessExtensions = await getSharedProcessExtensions()
    return [...sharedProcessExtensions, ...webExtensions]
  }
  const extensions = await getSharedProcessExtensions()
  return extensions
}
