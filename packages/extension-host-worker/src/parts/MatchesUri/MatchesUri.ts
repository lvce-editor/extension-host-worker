export const matchesUri = (uri: string, relativeRoot: string, include: string, exclude: string): boolean => {
  if (!uri.startsWith(relativeRoot)) {
    return false
  }
  if (include && typeof include === 'string' && !uri.includes(include)) {
    return false
  }
  if (exclude && typeof exclude === 'string' && uri.includes(exclude)) {
    return false
  }
  return true
}
