import type { RuntimeStatus } from '../RuntimeStatus/RuntimeStatus.ts'
import * as RuntimeStatusState from '../RuntimeStatusState/RuntimeStatusState.ts'
import * as RuntimeStatusType from '../RuntimeStatusType/RuntimeStatusType.ts'

const emptyStatus: RuntimeStatus = {
  status: RuntimeStatusType.None,
  id: '',
  activationEvent: '',
  activationStartTime: 0,
  activationEndTime: 0,
  activationTime: 0,
  importEndTime: 0,
  importStartTime: 0,
  importTime: 0,
}

export const getRuntimeStatus = (extensionId: string): RuntimeStatus => {
  return RuntimeStatusState.get(extensionId) || emptyStatus
}
