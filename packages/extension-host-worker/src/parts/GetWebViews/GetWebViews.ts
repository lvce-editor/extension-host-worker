import * as GetExtensions from '../GetExtensions/GetExtensions.ts'
import * as GetWebViewsFromExtensions from '../GetWebViewsFromExtensions/GetWebViewsFromExtensions.ts'

export const getWebViews = async () => {
  const extensions = await GetExtensions.getExtensions()
  const webViews = GetWebViewsFromExtensions.getWebViewsFromExtensions(extensions)
  return webViews
}
