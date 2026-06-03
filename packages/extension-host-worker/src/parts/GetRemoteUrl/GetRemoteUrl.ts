export const getRemoteUrl = (uri: string): string => {
  const withoutPrefix = uri.startsWith('file://') ? uri.slice('file://'.length) : uri
  const normalized = withoutPrefix.replaceAll('\\', '/')
  if (normalized.startsWith('/')) {
    return `/remote${normalized}`
  }
  return `/remote/${normalized}`
}
