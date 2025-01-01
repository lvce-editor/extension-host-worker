export const getTextSearchRegex = (query: string, matchCase: number): RegExp => {
  const flags = matchCase ? '' : 'i'
  const regex = new RegExp(query, flags)
  return regex
}
