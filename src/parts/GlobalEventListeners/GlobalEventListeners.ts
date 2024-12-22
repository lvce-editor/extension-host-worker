import * as Api from '../Api/Api.ts'
import * as ErrorHandling from '../ErrorHandling/ErrorHandling.ts'
import * as HandleContentSecurityPolicyViolation from '../HandleContentSecurityPolicyViolation/HandleContentSecurityPolicyViolation.ts'
import * as SetStackTraceLimit from '../SetStackTraceLimit/SetStackTraceLimit.ts'

export const setup = ({ global, errorConstructor }: { global: typeof globalThis; errorConstructor: any }) => {
  SetStackTraceLimit.setStackTraceLimit(errorConstructor, 20)
  global.onerror ||= ErrorHandling.handleUnhandledError
  global.onunhandledrejection ||= ErrorHandling.handleUnhandledRejection
  if ('SecurityPolicyViolationEvent' in self) {
    global.addEventListener('securitypolicyviolation', HandleContentSecurityPolicyViolation.handleContentSecurityPolicyViolation)
  }
  // @ts-ignore
  global.vscode = Api.api
}
