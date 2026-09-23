const databaseName = 'lvce-output-channels'
const databaseVersion = 1
const objectStoreName = 'chunks'
const extensionPathChannelIdIndexName = 'extensionPath-channelId'

interface OutputChunk {
  readonly channelId: string
  readonly extensionPath: string
  readonly text: string
}

let databasePromise: Promise<IDBDatabase> | undefined

const getExtensionPath = (): string => {
  return typeof location === 'undefined' ? 'test' : location.pathname
}

const openDatabase = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(databaseName, databaseVersion)
    request.onerror = () => reject(request.error)
    request.onupgradeneeded = () => {
      const database = request.result
      const objectStore = database.createObjectStore(objectStoreName, {
        autoIncrement: true,
      })
      objectStore.createIndex(extensionPathChannelIdIndexName, ['extensionPath', 'channelId'])
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

const deleteChannelChunks = (objectStore: IDBObjectStore, extensionPath: string, channelId: string, onComplete: () => void = () => {}): void => {
  const index = objectStore.index(extensionPathChannelIdIndexName)
  const request = index.openKeyCursor(IDBKeyRange.only([extensionPath, channelId]))
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
  const extensionPath = getExtensionPath()
  transaction.objectStore(objectStoreName).add({ channelId, extensionPath, text } satisfies OutputChunk)
  await waitForTransaction(transaction)
}

export const clear = async (channelId: string): Promise<void> => {
  const database = await getDatabase()
  const transaction = database.transaction(objectStoreName, 'readwrite')
  deleteChannelChunks(transaction.objectStore(objectStoreName), getExtensionPath(), channelId)
  await waitForTransaction(transaction)
}

export const getLogs = async (channelId: string): Promise<string> => {
  const database = await getDatabase()
  const transaction = database.transaction(objectStoreName, 'readonly')
  const extensionPath = getExtensionPath()
  const request = transaction
    .objectStore(objectStoreName)
    .index(extensionPathChannelIdIndexName)
    .getAll(IDBKeyRange.only([extensionPath, channelId]))
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
  const extensionPath = getExtensionPath()
  deleteChannelChunks(objectStore, extensionPath, channelId, () => {
    objectStore.add({ channelId, extensionPath, text } satisfies OutputChunk)
  })
  await waitForTransaction(transaction)
}
