import type { FileSystemDirent } from '../FileSystemDirent/FileSystemDirent.ts'

export interface FileSystemProvider {
  readonly id: string
  readonly isReadonly?: () => boolean | Promise<boolean>
  readonly mkdir?: (uri: string) => void | Promise<void>
  readonly readDirWithFileTypes?: (uri: string) => readonly FileSystemDirent[] | Promise<readonly FileSystemDirent[]>
  readonly readFile: (uri: string) => Blob | Promise<Blob | string> | string
  readonly remove?: (uri: string) => void | Promise<void>
  readonly rename?: (oldUri: string, newUri: string) => void | Promise<void>
  readonly writeFile?: (uri: string, content: string) => void | Promise<void>
}
