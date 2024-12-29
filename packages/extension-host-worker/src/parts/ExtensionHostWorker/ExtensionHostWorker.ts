import * as Assert from '../Assert/Assert.ts'
import * as IpcParent from '../IpcParent/IpcParent.ts'
import * as IpcParentType from '../IpcParentType/IpcParentType.ts'

export const createWorker = async ({ method, url, name }) => {
  Assert.string(method)
  Assert.string(url)
  Assert.string(name)
  const rpc = IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    url,
    name,
  })
  return rpc
}
