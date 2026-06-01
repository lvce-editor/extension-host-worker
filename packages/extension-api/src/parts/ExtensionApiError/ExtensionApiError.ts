export class ExtensionApiError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ExtensionApiError'
  }
}
