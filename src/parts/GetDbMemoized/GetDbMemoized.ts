// TODO high memory usage in idb because of transactionDoneMap

import { IDBPDatabase } from 'idb'
import { openDB } from '../Idb/Idb.ts'
import { storeId } from '../StoreId/StoreId.ts'

interface State {
  databases: any
  dbVersion: number
  cachedDb: IDBPDatabase | undefined
}

const state: State = {
  databases: Object.create(null),
  dbVersion: 2,
  cachedDb: undefined,
}

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

export const getDbMemoized = async (): Promise<IDBPDatabase> => {
  state.cachedDb ||= await getDb()
  return state.cachedDb
}
