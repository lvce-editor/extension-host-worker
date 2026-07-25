import type { FileSystemDirent } from '../FileSystemDirent/FileSystemDirent.ts'

export interface FileSystemProvider {
  readonly id: string
  readonly isReadonly?: () => boolean | Promise<boolean>
  readonly pathSeparator?: string
  readonly readDirWithFileTypes?: (uri: string) => readonly FileSystemDirent[] | Promise<readonly FileSystemDirent[]>
  readonly readFile: (uri: string) => string | Promise<string>
}
