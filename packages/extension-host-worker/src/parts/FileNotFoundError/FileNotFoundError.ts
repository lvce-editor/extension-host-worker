export class FileNotFoundError extends Error {
  code: string

  constructor(uri: string) {
    super(`File not found: ${uri}`)
    this.code = 'ENOENT'
  }
}
