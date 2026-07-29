import type { SignatureHelpSignature } from '../SignatureHelpSignature/SignatureHelpSignature.ts'

export interface SignatureHelpResult {
  readonly activeParameter: number
  readonly activeSignature: number
  readonly signatures: readonly SignatureHelpSignature[]
}
