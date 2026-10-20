import { executeCommand } from '../ExecuteCommand/ExecuteCommand.ts'

export interface EditorKeyBinding {
  readonly args?: readonly unknown[]
  readonly command?: string
  readonly mode?: string
}

export interface EditorKeymapMode {
  /** Keys use KeyboardEvent.key spelling, including case (for example, h, $, Escape). */
  readonly bindings: Readonly<Record<string, EditorKeyBinding>>
  /** Suppress unbound text input, paste, Enter, Backspace and Delete in this mode. */
  readonly captureText?: boolean
}

export interface EditorKeymap {
  /** Override cursor appearance while registered; disposal restores the workbench preference. */
  readonly cursorStyle?: 'block' | 'line'
  readonly initialMode: string
  readonly modes: Readonly<Record<string, EditorKeymapMode>>
}

export interface EditorKeymapHandle {
  dispose(): Promise<void>
}

/** Install one modal keymap in this application's text editors. Other inputs and modified shortcuts retain their normal behavior. */
export const registerEditorKeymap = async (keymap: EditorKeymap): Promise<EditorKeymapHandle> => {
  const id = await executeCommand('EditorKeymap.register', keymap)
  let disposed = false
  return {
    async dispose(): Promise<void> {
      if (disposed) return
      await executeCommand('EditorKeymap.remove', id)
      disposed = true
    },
  }
}
