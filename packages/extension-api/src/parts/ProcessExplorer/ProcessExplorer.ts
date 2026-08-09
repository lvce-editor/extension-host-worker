import { openUri } from '../Host/Host.ts'

export const openProcessExplorer = async (): Promise<void> => {
  await openUri('process-explorer://')
}
