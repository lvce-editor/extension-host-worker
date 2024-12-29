import { Rpc } from '@lvce-editor/rpc'
import * as IpcParentModule from '../IpcParentModule/IpcParentModule.ts'
import { VError } from '../VError/VError.ts'

export const create = async ({ method, ...options }): Promise<Rpc> => {
  try {
    const module = IpcParentModule.getModule(method)
    // @ts-ignore
    const rpc = await module.create(options)
    return rpc
  } catch (error) {
    throw new VError(error, `Failed to create rpc`)
  }
}
