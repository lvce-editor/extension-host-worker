import ky from 'ky'
import { VError } from '../VError/VError.ts'

export const getText = async (url, options = {}) => {
  try {
    return await ky(url, options).text()
  } catch (error) {
    if (error && error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new VError(error, `Failed to request text from "${url}". Make sure that the server is running and has CORS enabled`)
    }
    throw new VError(error, `Failed to request text from "${url}"`)
  }
}
