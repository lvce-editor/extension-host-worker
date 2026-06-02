import {
  executeCommand as executeRegisteredCommand,
  getCommandRegistrySnapshot,
  registerCommand,
  resetCommandRegistry,
} from '../src/parts/CommandRegistry/CommandRegistry.ts'
import {
  executeCompletionProvider,
  getCompletionProviderRegistrySnapshot,
  registerCompletionProvider,
  resetCompletionProviderRegistry,
} from '../src/parts/Completion/Completion.ts'
import { getStatusBarItems } from '../src/parts/GetStatusBarItems/GetStatusBarItems.ts'
import { showQuickPick } from '../src/parts/QuickPick/QuickPick.ts'
import * as Rpc from '../src/parts/Rpc/Rpc.ts'
import {
  getStatusBarItemProviderRegistrySnapshot,
  registerStatusBarItemProvider,
  resetStatusBarItemProviderRegistry,
} from '../src/parts/StatusBar/StatusBar.ts'

const strictEqual = (actual: unknown, expected: unknown): void => {
  if (actual !== expected) {
    throw new Error(`Expected ${actual} to equal ${expected}`)
  }
}

const throws = (fn: () => void, expected: RegExp): void => {
  try {
    fn()
  } catch (error) {
    if (error instanceof Error && expected.test(error.message)) {
      return
    }
    throw error
  }
  throw new Error(`Expected function to throw ${expected}`)
}

resetCommandRegistry()
resetCompletionProviderRegistry()
resetStatusBarItemProviderRegistry()

const disposable = registerCommand({
  execute(value: string): string {
    return value.toUpperCase()
  },
  id: 'sample.run',
})

strictEqual(getCommandRegistrySnapshot().commands.length, 1)
strictEqual(await executeRegisteredCommand('sample.run', 'ready'), 'READY')

throws(() => {
  registerCommand({
    execute(): void {},
    id: 'sample.run',
  })
}, /command sample\.run is already registered/)

disposable.dispose()
strictEqual(getCommandRegistrySnapshot().commands.length, 0)

const completionHandle = registerCompletionProvider({
  id: 'sample.completion',
  languageId: 'sample',
  provideCompletions(textDocument, offset) {
    return [
      {
        label: `${textDocument.languageId}:${offset}`,
      },
    ]
  },
})

strictEqual(getCompletionProviderRegistrySnapshot().providers.length, 1)
const completions = await executeCompletionProvider({ languageId: 'sample', text: 'abc', uri: '/sample.txt' }, 2)
strictEqual(completions[0]?.label, 'sample:2')

throws(() => {
  registerCompletionProvider({
    id: 'sample.completion',
    languageId: 'sample',
    provideCompletions() {
      return []
    },
  })
}, /completion provider sample\.completion is already registered/)

completionHandle.dispose()
strictEqual(getCompletionProviderRegistrySnapshot().providers.length, 0)

const statusBarHandle = registerStatusBarItemProvider({
  getStatusBarItem() {
    return {
      name: 'sample.status',
      text: 'Ready',
    }
  },
  id: 'sample.status',
})

const statusBarSnapshot = getStatusBarItemProviderRegistrySnapshot()
strictEqual(statusBarSnapshot.providers.length, 1)
strictEqual(statusBarSnapshot.providers[0]?.id, 'sample.status')
strictEqual(statusBarSnapshot.providers[0]?.getStatusBarItem()?.text, 'Ready')
strictEqual(getStatusBarItems()[0]?.text, 'Ready')

throws(() => {
  registerStatusBarItemProvider({
    getStatusBarItem() {
      return undefined
    },
    id: 'sample.status',
  })
}, /status bar item provider sample\.status is already registered/)

throws(() => {
  registerStatusBarItemProvider({
    // @ts-expect-error testing invalid provider shape
    getStatusBarItem: undefined,
    id: 'sample.invalid',
  })
}, /status bar item provider sample\.invalid is missing getStatusBarItem function/)

await statusBarHandle.refresh()
statusBarHandle.dispose()
strictEqual(getStatusBarItemProviderRegistrySnapshot().providers.length, 0)

registerStatusBarItemProvider({
  getStatusBarItem() {
    return undefined
  },
  id: 'sample.reset',
})
resetStatusBarItemProviderRegistry()
strictEqual(getStatusBarItemProviderRegistrySnapshot().providers.length, 0)

let invokedMethod = ''
let invokedOptions: unknown

Rpc.set({
  async invoke(method: string, options: unknown): Promise<unknown> {
    invokedMethod = method
    invokedOptions = options
    return 'option-1'
  },
} as any)

const quickPickOptions = {
  items: [
    {
      description: 'First option',
      label: 'Option 1',
      value: 'option-1',
    },
  ],
  placeholder: 'Select option',
}

strictEqual(await showQuickPick(quickPickOptions), 'option-1')
strictEqual(invokedMethod, 'ExtensionHostQuickPick.showQuickPick')
strictEqual(invokedOptions, quickPickOptions)
