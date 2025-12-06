import * as Assert from '../Assert/Assert.ts'
import * as IpcParent from '../IpcParent/IpcParent.ts'
import * as IpcParentType from '../IpcParentType/IpcParentType.ts'
import { VError } from '../VError/VError.ts'

const defaultExecute = () => {
  throw new Error('not implemented')
}

export const createNodeRpc = async ({ execute = defaultExecute, name = '', path }) => {
  try {
    Assert.string(path)
    Assert.fn(execute)
    const rpc = await IpcParent.create({
      commandMap: {},
      method: IpcParentType.ElectronMessagePort,
      name,
      type: 'extension-host-helper-process',
    })

    await rpc.invoke('LoadFile.loadFile', path)
    return rpc
  } catch (error) {
    throw new VError(error, `Failed to create node rpc`)
  }
}
