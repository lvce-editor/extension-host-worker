import * as RendererWorkerCommandType from '../RendererWorkerCommandType/RendererWorkerCommandType.ts'
import * as Rpc from '../Rpc/Rpc.ts'

export const showQuickPick = async ({ getPicks, toPick }) => {
  const rawPicks = await getPicks()
  const picks = rawPicks.map(toPick)
  return Rpc.invoke(RendererWorkerCommandType.ExtensionHostQuickPickShow, picks)
}
