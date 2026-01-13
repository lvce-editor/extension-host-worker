import { FileSearchWorker } from '@lvce-editor/rpc-registry'
import type { QuickInputOptions } from '../QuickInputOptions/QuickInputOptions.ts'
import type { QuickInputResult } from '../QuickInputResult/QuickInputResult.ts'
import * as Id from '../Id/Id.ts'
import * as RendererWorkerCommandType from '../RendererWorkerCommandType/RendererWorkerCommandType.ts'
import * as Rpc from '../Rpc/Rpc.ts'

export const showQuickPick = async ({ getPicks, toPick }) => {
  const rawPicks = await getPicks()
  const picks = rawPicks.map(toPick)
  return Rpc.invoke(RendererWorkerCommandType.ExtensionHostQuickPickShow, picks)
}

const quickInputs = Object.create(null)

const callbacks = Object.create(null)

export const showQuickInput = async ({ ignoreFocusOut, initialValue, render }: QuickInputOptions): Promise<QuickInputResult> => {
  const id = Id.create()
  quickInputs[id] = render

  const id2 = Id.create()
  const visibleItem = Promise.withResolvers()
  callbacks[id2] = visibleItem.resolve
  // TODO create direct connection to file search worker

  const finishedPromise = FileSearchWorker.invoke('QuickPick.showQuickInput', {
    id,
    ignoreFocusOut,
    initialValue,
    visibleCallbackId: id2,
  })

  return {
    finishedPromise,
    visiblePromise: visibleItem.promise,
  }
}
