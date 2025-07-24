export interface RuntimeStatus {
  readonly status: number
  readonly id: string
  readonly activationEvent: string
  readonly activationStartTime: number
  readonly activationEndTime: number
  readonly activationTime: number
}
