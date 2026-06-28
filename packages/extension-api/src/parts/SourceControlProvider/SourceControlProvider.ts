export interface SourceControlProvider {
  readonly acceptInput: (id: string, value: string) => Promise<any>
  readonly generateCommitMessage: (id: string) => Promise<any>
  readonly getChangedFiles: (id: string) => Promise<readonly any[]>
  readonly getFeatures: (id: string) => Promise<any>
  readonly getFileBefore: (id: string) => Promise<any>
  readonly getGroups: (id: string, cwd: string) => Promise<any>
  readonly id: string
}
