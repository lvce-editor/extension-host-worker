import * as ParentRpc from '../Rpc/Rpc.ts'

export const get = (key: string): Promise<string> => {
  return ParentRpc.invoke('Preferences.get', key)
}

export const set = (key: string, value: any): Promise<void> => {
  return ParentRpc.invoke('Preferences.set', key, value)
}
