import * as Rpc from '../Rpc/Rpc.ts'

export const readJson = (url: string): Promise<any> => {
  return Rpc.invoke('FileSystem.readJson', url)
}
