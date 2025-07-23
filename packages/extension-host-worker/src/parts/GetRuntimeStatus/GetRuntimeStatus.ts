import type { RuntimeStatus } from '../RuntimeStatus/RuntimeStatus.ts'
import * as RuntimeStatusType from '../RuntimeStatusType/RuntimeStatusType.ts'

export const getRuntimeStatus = (extensionId: string): RuntimeStatus => {
  return {
    status: RuntimeStatusType.None,
    id: extensionId,
    activationEvent: '',
    activationTime: 0,
  }
}
