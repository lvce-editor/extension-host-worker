import type { IDBPDatabase } from 'idb'

interface State {
  databases: any
  dbVersion: number
  cachedDb: IDBPDatabase | undefined
  eventId: 0
}

export const state: State = {
  databases: Object.create(null),
  eventId: 0,
  dbVersion: 1,
  /**
   * @type {any}
   */
  cachedDb: undefined,
}
