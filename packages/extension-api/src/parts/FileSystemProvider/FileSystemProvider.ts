export interface FileSystemProvider {
  readonly id: string
  readonly readFile: (uri: string) => string | Promise<string>
}
