export interface OutputChannel {
  append(text: string): Promise<void>
  appendLine(text: string): Promise<void>
  clear(): Promise<void>
  getLogs(): Promise<string>
  replace(text: string): Promise<void>
}
