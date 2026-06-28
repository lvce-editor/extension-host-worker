export interface RegisteredSourceControlProvider {
  readonly acceptInput?: (value: string) => unknown
  readonly add?: (path: string) => unknown
  readonly discard?: (path: string) => unknown
  readonly features?: Record<string, unknown>
  readonly generateCommitMessage?: () => unknown
  readonly getChangedFiles?: () => unknown
  readonly getFeatures?: () => unknown
  readonly getFileBefore?: (uri: string) => unknown
  readonly getFileDecorations?: (uris: readonly string[]) => unknown
  readonly getGroups?: (cwd: string) => unknown
  readonly id: string
  readonly isActive?: (scheme: string, root: string) => unknown
  readonly showGenerateCommitMessageButton?: boolean
}
