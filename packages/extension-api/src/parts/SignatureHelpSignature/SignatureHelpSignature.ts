import type { SignatureHelpParameter } from '../SignatureHelpParameter/SignatureHelpParameter.ts'

export interface SignatureHelpSignature {
  readonly documentation?: string
  readonly label: string
  readonly parameters: readonly SignatureHelpParameter[]
}
