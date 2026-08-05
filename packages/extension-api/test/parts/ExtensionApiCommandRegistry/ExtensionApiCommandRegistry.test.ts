import { execute as executeRegisteredCommand } from '@lvce-editor/command'
import { deepStrictEqual, strictEqual, throws } from 'node:assert/strict'
import { test } from 'node:test'
import * as CommandMap from '../../../src/parts/CommandMap/CommandMap.ts'
import { registerCompletionProvider } from '../../../src/parts/CompletionProviderRegistry/CompletionProviderRegistry.ts'
import { registerDebugProvider } from '../../../src/parts/Debug/Debug.ts'

test('extension api commands are registered by capability', async () => {
  const initialCommandMap = CommandMap.getCommandMap()
  strictEqual(typeof initialCommandMap['ExtensionApi.getStatusBarItems'], 'function')
  deepStrictEqual(initialCommandMap['ExtensionApi.getStatusBarItems'](), [])
  strictEqual(initialCommandMap['ExtensionApi.executeCompletionProvider'], undefined)
  strictEqual(initialCommandMap['ExtensionHostDebug.evaluate'], undefined)

  throws(() => {
    registerCompletionProvider({
      id: 'invalid.completion',
      languageId: 'sample',
      // @ts-expect-error testing invalid provider shape
      provideCompletions: undefined,
    })
  }, /completion provider invalid\.completion is missing provideCompletions function/)
  strictEqual(CommandMap.getCommandMap()['ExtensionApi.executeCompletionProvider'], undefined)

  registerCompletionProvider({
    id: 'sample.completion',
    languageId: 'sample',
    provideCompletions() {
      return []
    },
  })

  const completionCommandMap = CommandMap.getCommandMap()
  strictEqual(typeof completionCommandMap['ExtensionApi.executeCompletionProvider'], 'function')
  strictEqual(typeof completionCommandMap['ExtensionApi.executeResolveCompletionItemProvider'], 'function')
  strictEqual(typeof completionCommandMap['ExtensionApi.getCompletionProviderRegistrySnapshot'], 'function')
  strictEqual(completionCommandMap['ExtensionHostDebug.evaluate'], undefined)
  deepStrictEqual(await executeRegisteredCommand('ExtensionApi.getCompletionProviderRegistrySnapshot'), {
    providers: [
      {
        id: 'sample.completion',
        languageId: 'sample',
      },
    ],
  })

  registerDebugProvider({
    evaluate() {},
    getCallStack() {},
    getProperties() {},
    getScripts() {},
    getScriptSource() {},
    getStatus() {},
    id: 'sample.debug',
    listProcesses() {},
    pause() {},
    resume() {},
    setPauseOnExceptions() {},
    start() {},
    step() {},
    stepInto() {},
    stepOut() {},
    stepOver() {},
  })

  const debugCommandMap = CommandMap.getCommandMap()
  strictEqual(typeof debugCommandMap['ExtensionHostDebug.start'], 'function')
  strictEqual(typeof debugCommandMap['ExtensionHostDebug.pause'], 'function')
  strictEqual(typeof debugCommandMap['ExtensionHostDebug.resume'], 'function')
  strictEqual(typeof debugCommandMap['ExtensionHostDebug.evaluate'], 'function')
  strictEqual(typeof debugCommandMap['ExtensionHostDebug.getCallStack'], 'function')
  strictEqual(typeof debugCommandMap['ExtensionHostDebug.getPausedStatus'], 'function')
  strictEqual(typeof debugCommandMap['ExtensionHostDebug.getScripts'], 'function')
  strictEqual(typeof debugCommandMap['ExtensionHostDebug.getScriptSource'], 'function')
})
