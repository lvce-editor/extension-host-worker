import * as GetExtensions from '../GetExtensions/GetExtensions.ts'
import * as GetLanguagesFromExtension from '../GetLanguagesFromExtension/GetLanguagesFromExtension.ts'
import { VError } from '../VError/VError.ts'

export const getLanguages = async () => {
  try {
    const extensions = await GetExtensions.getExtensions()
    const languages = extensions.flatMap(GetLanguagesFromExtension.getLanguagesFromExtension)
    return languages
  } catch (error) {
    throw new VError(error, 'Failed to load languages')
  }
}
