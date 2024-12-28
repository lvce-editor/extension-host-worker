// TODO high memory usage in idb because of transactionDoneMap

import * as GetDbMemoized from '../GetDbMemoized/GetDbMemoized.ts'
import { storeId } from '../StoreId/StoreId.ts'
import { VError } from '../VError/VError.ts'

export const set = async (key: string, value: any): Promise<void> => {
  try {
    const db = await GetDbMemoized.getDbMemoized()
    await db.put(storeId, value, key)
  } catch (error) {
    throw new VError(error, 'Failed to save value to indexed db')
  }
}

export const get = async (key: string): Promise<any> => {
  try {
    const db = await GetDbMemoized.getDbMemoized()
    const value = db.get(storeId, key)
    return value
  } catch (error) {
    throw new VError(error, 'Failed to get value from indexed db')
  }
}
