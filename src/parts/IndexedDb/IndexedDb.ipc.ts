import * as IndexedDb from './IndexedDb.ts'

export const name = 'IndexedDb'

export const Commands = {
  addHandle: IndexedDb.addHandle,
  getHandle: IndexedDb.getHandle,
}
