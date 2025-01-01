export const getTextSearchRegex = (query: string, matchCase: number): RegExp => {
  const flags = matchCase ? 'u' : 'iu'
  const regex = new RegExp(query, flags)
  return regex
}
