import type { RuntimeStatus } from '../RuntimeStatus/RuntimeStatus.ts'

export const getRuntimeStatus = (extensionId: string): RuntimeStatus => {
  return {
    status: 'not-running',
    id: extensionId,
    activationEvent: '',
    activationTime: 0,
  }
}
