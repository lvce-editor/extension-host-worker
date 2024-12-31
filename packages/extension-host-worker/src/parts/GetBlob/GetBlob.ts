import { VError } from '@lvce-editor/verror'

export const getBlob = async (url: string): Promise<Blob> => {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(response.statusText)
    }
    const text = await response.blob()
    return text
  } catch (error) {
    throw new VError(error, `Failed to request blob for ${url}`)
  }
}
