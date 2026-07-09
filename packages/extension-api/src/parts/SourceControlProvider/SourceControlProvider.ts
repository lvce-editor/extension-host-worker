export interface SourceControlProvider {
  readonly acceptInput?: (value: string) => unknown | Promise<unknown>
  readonly add?: (path: string) => unknown | Promise<unknown>
  readonly discard?: (path: string) => unknown | Promise<unknown>
  readonly generateCommitMessage?: () => unknown | Promise<unknown>
  readonly getBadgeCount?: () => number | Promise<number>
  readonly getChangedFiles: () => readonly unknown[] | Promise<readonly unknown[]>
  readonly getFeatures?: () => unknown | Promise<unknown>
  readonly getFileBefore?: (uri: string) => unknown | Promise<unknown>
  readonly getFileDecorations?: (uris: readonly string[]) => unknown | Promise<unknown>
  readonly getGroups?: (cwd: string) => unknown | Promise<unknown>
  readonly id: string
  readonly isActive?: (scheme: string, root: string) => boolean | Promise<boolean>
}
