import { DialogWorker } from '@lvce-editor/rpc-registry'
import * as Assert from '../Assert/Assert.ts'

export const confirm = (message) => {
  Assert.string(message)
  const result = DialogWorker.invoke('ConfirmPrompt.prompt', message)
  return result
}
