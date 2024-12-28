import { VError } from '@lvce-editor/verror'

export const getText = async (url: string): Promise<string> => {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(response.statusText)
    }
    const text = await response.text()
    return text
  } catch (error) {
    throw new VError(error, `Failed to get text`)
  }
}
