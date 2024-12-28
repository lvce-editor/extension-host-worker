import * as ParentRpc from '../Rpc/Rpc.ts'

export const get = (key: string): Promise<string> => {
  return ParentRpc.invoke('Preferences.get', key)
}
