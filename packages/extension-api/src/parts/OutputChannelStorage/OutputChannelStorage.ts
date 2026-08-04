const databasePrefix = 'lvce-editor-extension-output'
const databaseVersion = 1
const objectStoreName = 'chunks'
const channelIdIndexName = 'channelId'

interface OutputChunk {
  readonly channelId: string
  readonly text: string
}

let databasePromise: Promise<IDBDatabase> | undefined

const getDatabaseName = (): string => {
  const extensionPath = typeof location === 'undefined' ? 'test' : location.pathname
  return `${databasePrefix}:${extensionPath}`
}

const openDatabase = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(getDatabaseName(), databaseVersion)
    request.onerror = () => reject(request.error)
    request.onupgradeneeded = () => {
      const database = request.result
      const objectStore = database.createObjectStore(objectStoreName, {
        autoIncrement: true,
      })
      objectStore.createIndex(channelIdIndexName, 'channelId')
    }
    request.onsuccess = () => resolve(request.result)
  })
}

const getDatabase = (): Promise<IDBDatabase> => {
  databasePromise ||= openDatabase()
  return databasePromise
}

const waitForTransaction = (transaction: IDBTransaction): Promise<void> => {
  return new Promise((resolve, reject) => {
    transaction.onabort = () => reject(transaction.error)
    transaction.onerror = () => reject(transaction.error)
    transaction.oncomplete = () => resolve()
  })
}

const deleteChannelChunks = (objectStore: IDBObjectStore, channelId: string, onComplete: () => void = () => {}): void => {
  const index = objectStore.index(channelIdIndexName)
  const request = index.openKeyCursor(IDBKeyRange.only(channelId))
  request.onsuccess = () => {
    const cursor = request.result
    if (!cursor) {
      onComplete()
      return
    }
    objectStore.delete(cursor.primaryKey)
    cursor.continue()
  }
}

export const append = async (channelId: string, text: string): Promise<void> => {
  const database = await getDatabase()
  const transaction = database.transaction(objectStoreName, 'readwrite')
  transaction.objectStore(objectStoreName).add({ channelId, text } satisfies OutputChunk)
  await waitForTransaction(transaction)
}

export const clear = async (channelId: string): Promise<void> => {
  const database = await getDatabase()
  const transaction = database.transaction(objectStoreName, 'readwrite')
  deleteChannelChunks(transaction.objectStore(objectStoreName), channelId)
  await waitForTransaction(transaction)
}

export const getLogs = async (channelId: string): Promise<string> => {
  const database = await getDatabase()
  const transaction = database.transaction(objectStoreName, 'readonly')
  const request = transaction.objectStore(objectStoreName).index(channelIdIndexName).getAll(IDBKeyRange.only(channelId))
  const chunks = await new Promise<readonly OutputChunk[]>((resolve, reject) => {
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
  })
  await waitForTransaction(transaction)
  return chunks.map((chunk) => chunk.text).join('')
}

export const replace = async (channelId: string, text: string): Promise<void> => {
  const database = await getDatabase()
  const transaction = database.transaction(objectStoreName, 'readwrite')
  const objectStore = transaction.objectStore(objectStoreName)
  deleteChannelChunks(objectStore, channelId, () => {
    objectStore.add({ channelId, text } satisfies OutputChunk)
  })
  await waitForTransaction(transaction)
}
