import type { ForwardedPort } from '../ForwardedPort/ForwardedPort.ts'

export interface PortProvider {
  readonly providePorts: (workspaceUri: string) => readonly ForwardedPort[] | Promise<readonly ForwardedPort[]>
  readonly scheme: string
}
