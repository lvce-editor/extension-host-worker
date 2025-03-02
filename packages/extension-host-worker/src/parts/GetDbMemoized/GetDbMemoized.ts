// TODO high memory usage in idb because of transactionDoneMap

import type { IDBPDatabase } from 'idb'
import * as GetDb from '../GetDb/GetDb.ts'

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

export const getDbMemoized = async (): Promise<IDBPDatabase> => {
  state.cachedDb ||= await GetDb.getDb()
  return state.cachedDb
}
