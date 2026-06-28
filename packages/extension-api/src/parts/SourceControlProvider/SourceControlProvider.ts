export interface SourceControlProvider {
  readonly id: string
  readonly getChangedFiles: (id: string) => Promise<readonly any[]>
  readonly getFileBefore: (id: string) => Promise<any>
  readonly getGroups: (id: string, cwd: string) => Promise<any>
  readonly acceptInput: (id: string, value: string) => Promise<any>
  readonly generateCommitMessage: (id: string) => Promise<any>
  readonly getFeatures: (id: string) => Promise<any>
}
