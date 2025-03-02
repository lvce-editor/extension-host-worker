// TODO high memory usage in idb because of transactionDoneMap

import type { IDBPDatabase } from 'idb'
import { openDB } from '../Idb/Idb.ts'
import { storeId } from '../StoreId/StoreId.ts'
import { state } from '../IndexedDbState/IndexedDbState.ts'

export const getDb = async (): Promise<IDBPDatabase> => {
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
