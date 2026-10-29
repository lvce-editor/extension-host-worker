import type { FileSystemDirent } from '../FileSystemDirent/FileSystemDirent.ts'

export interface RegisteredFileSystemProvider {
  /** Opaque directory listing version scoped to the filesystem identity. Return null when unavailable.
   * Must change on entry creation, removal, rename or replacement. Never use a file type as a version.
   */
  readonly getDirectoryVersion?: (uri: string) => string | null | Promise<string | null>
  readonly getOpenExternalPath?: (uri: string) => string | Promise<string>
  readonly id: string
  readonly isReadonly?: () => boolean | Promise<boolean>
  readonly mkdir?: (uri: string) => void | Promise<void>
  readonly readDirWithFileTypes?: (uri: string) => readonly FileSystemDirent[] | Promise<readonly FileSystemDirent[]>
  readonly readFile: (uri: string, encoding?: string) => Blob | Promise<Blob | string> | string
  readonly remove?: (uri: string) => void | Promise<void>
  readonly rename?: (oldUri: string, newUri: string) => void | Promise<void>
  readonly stat?: (uri: string) => number | Promise<number>
  readonly writeFile?: (uri: string, content: string) => void | Promise<void>
}
