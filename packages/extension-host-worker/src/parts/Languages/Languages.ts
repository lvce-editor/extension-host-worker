import * as GetExtensions from '../GetExtensions/GetExtensions.js'
import * as GetLanguagesFromExtension from '../GetLanguagesFromExtension/GetLanguagesFromExtension.js'
import { VError } from '../VError/VError.js'

export const getLanguages = async () => {
  try {
    const extensions = await GetExtensions.getExtensions()
    const languages = extensions.flatMap(GetLanguagesFromExtension.getLanguagesFromExtension)
    console.log({ languages })
    return languages
  } catch (error) {
    throw new VError(error, 'Failed to load languages')
  }
}
