export interface RegisteredFileSystemProvider {
  readonly id: string
  readonly readFile: (uri: string) => string | Promise<string>
}
