import type { IDBPDatabase } from 'idb'

interface State {
  cachedDb: IDBPDatabase | undefined
  databases: any
  dbVersion: number
  eventId: 0
}

export const state: State = {
  /**
   * @type {any}
   */
  cachedDb: undefined,
  databases: Object.create(null),
  dbVersion: 1,
  eventId: 0,
}
