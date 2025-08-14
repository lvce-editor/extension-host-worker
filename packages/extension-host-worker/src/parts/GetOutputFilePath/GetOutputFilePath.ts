export const getOutputFilePath = (id: string): string => {
  const isWeb = false
  const outputFolderPath = isWeb ? `output://` : 'file:///tmp'
  const uri = `${outputFolderPath}/${id}.txt`
  return uri
}
