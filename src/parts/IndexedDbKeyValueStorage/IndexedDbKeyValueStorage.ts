// TODO high memory usage in idb because of transactionDoneMap

import { IDBPDatabase } from 'idb'
import { openDB } from '../Idb/Idb.ts'
import { VError } from '../VError/VError.ts'

interface State {
  databases: any
  dbVersion: number
  cachedDb: IDBPDatabase | undefined
}

export const state: State = {
  databases: Object.create(null),
  dbVersion: 2,
  cachedDb: undefined,
}

const storeId = 'lvce-keyvalue'

const getDb = async (): Promise<IDBPDatabase> => {
  const db = await openDB(storeId, state.dbVersion, {
    async upgrade(db, oldVersion) {
      if (!db.objectStoreNames.contains(storeId)) {
        await db.createObjectStore(storeId, {
          autoIncrement: true,
        })
      }
    },
  })
  return db
}

const getDbMemoized = async (): Promise<IDBPDatabase> => {
  state.cachedDb ||= await getDb()
  return state.cachedDb
}

export const set = async (key: string, value: any): Promise<void> => {
  try {
    const db = await getDbMemoized()
    await db.put(storeId, value, key)
  } catch (error) {
    throw new VError(error, 'Failed to save value to indexed db')
  }
}

export const get = async (key: string): Promise<any> => {
  try {
    const db = await getDbMemoized()
    const value = db.get(storeId, key)
    return value
  } catch (error) {
    throw new VError(error, 'Failed to get value from indexed db')
  }
}
