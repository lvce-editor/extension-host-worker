export class ContentSecurityPolicyError extends Error {
  constructor(violatedDirective, sourceFile, lineNumber, columnNumber) {
    super(`Content Security Policy Violation: ${violatedDirective}`)
    this.name = 'ContentSecurityPolicyError'
    this.stack = sourceFile
      ? `Content Security Policy Violation
    at ${sourceFile}:${lineNumber}:${columnNumber}`
      : `Content Security Policy Violation
    at <unknown>`
  }
}
