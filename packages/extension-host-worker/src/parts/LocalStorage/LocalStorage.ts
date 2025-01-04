import * as Rpc from '../Rpc/Rpc.ts'

export const getText = (key) => {
  return Rpc.invoke('LocalStorage.getText', key)
}

export const setText = (key, value) => {
  return Rpc.invoke('LocalStorage.setText', key, value)
}
