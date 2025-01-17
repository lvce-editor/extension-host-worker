import * as LaunchIframeWorker from '../LaunchIframeWorker/LaunchIframeWorker.ts'

let workerPromise: any

const ensureWorker = () => {
  if (!workerPromise) {
    workerPromise = LaunchIframeWorker.launchIframeWorker()
  }
  return workerPromise
}

export const isActive = (): boolean => {
  return Boolean(workerPromise)
}

export const invoke = async (method, ...params) => {
  const rpc = await ensureWorker()
  return rpc.invoke(method, ...params)
}
