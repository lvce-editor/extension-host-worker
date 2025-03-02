// TODO high memory usage in idb because of transactionDoneMap

import type { IDBPDatabase } from 'idb'
import { openDB } from '../Idb/Idb.ts'
import { state } from '../IndexedDbState/IndexedDbState.ts'
const getHandleDb = async (): Promise<IDBPDatabase> => {
  const db = await openDB('handle', state.dbVersion, {
    async upgrade(db, oldVersion) {
      if (!db.objectStoreNames.contains('file-handles-store')) {
        // @ts-ignore
        const objectStore = await db.createObjectStore('file-handles-store', {})
      }
    },
  })
  return db
}

export const addHandle = async (uri: string, handle: any): Promise<void> => {
  const handleDb = await getHandleDb()
  await handleDb.put('file-handles-store', handle, uri)
}

export const getHandle = async (uri: string): Promise<any> => {
  const handleDb = await getHandleDb()
  const handle = await handleDb.get('file-handles-store', uri)
  return handle
}
