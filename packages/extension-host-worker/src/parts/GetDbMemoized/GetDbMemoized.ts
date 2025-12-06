// TODO high memory usage in idb because of transactionDoneMap

import type { IDBPDatabase } from 'idb'
import * as GetDb from '../GetDb/GetDb.ts'

interface State {
  cachedDb: IDBPDatabase | undefined
  databases: any
  dbVersion: number
}

const state: State = {
  cachedDb: undefined,
  databases: Object.create(null),
  dbVersion: 2,
}

export const getDbMemoized = async (): Promise<IDBPDatabase> => {
  state.cachedDb ||= await GetDb.getDb()
  return state.cachedDb
}
