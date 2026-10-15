const UriPattern = /^([A-Za-z][A-Za-z\d+.-]*:)(\/\/[^/?#]*)?([^?#]*)([?#].*)?$/

const join = (uri: string, ...segments: readonly string[]): string => {
  const match = UriPattern.exec(uri)
  if (!match) {
    throw new TypeError('Expected an absolute URI')
  }

  const [, scheme, authority = '', uriPath, suffix = ''] = match
  const isAbsolute = uriPath.startsWith('/') || authority.startsWith('//')
  const pathSegments = `${uriPath}/${segments.join('/')}`.split('/')
  const normalizedSegments: string[] = []

  for (const segment of pathSegments) {
    if (!segment || segment === '.') continue
    if (segment === '..') {
      if (normalizedSegments.length > 0) normalizedSegments.pop()
      continue
    }
    normalizedSegments.push(segment)
  }

  const path = `${isAbsolute ? '/' : ''}${normalizedSegments.join('/')}`
  return `${scheme}${authority}${path}${suffix}`
}

/** URI-aware path utilities for extension file URIs. */
export const path = {
  /**
   * Join slash-separated path segments to an absolute URI.
   *
   * The URI scheme and authority are preserved. Repeated separators and `.`
   * segments are removed, `..` removes a preceding path segment without
   * escaping the URI root, and a leading slash in a segment remains relative
   * to the URI path. URI-encoded text is preserved as written.
   */
  join,
}
