import {
  activate,
  executeFileSystemProviderReadFile,
  getFileSystemProviderRegistrySnapshot,
  getLanguageServerRegistrySnapshot,
  getPlatform,
  getWorkspaceFolder,
  getWorkspaceUri,
  registerBraceCompletionProvider,
  registerClosingTagProvider,
  registerCodeActionsProvider,
  registerCommand,
  registerCommentProvider,
  registerDefinitionProvider,
  registerFileSystemProvider,
  registerImplementationProvider,
  registerLanguageServer,
  registerReferenceProvider,
  registerRenameProvider,
  registerSelectionProvider,
  registerTabCompletionProvider,
  registerTypeDefinitionProvider,
  resetFileSystemProviderRegistry,
  resetLanguageProviderRegistry,
  resetLanguageServerRegistry,
} from '@lvce-editor/api'
import type { Disposable, FileSystemProvider, LanguageProvider, LanguageServerOptions, Platform } from '@lvce-editor/api'

type CoverageCase = () => unknown | Promise<unknown>
type RegisterLanguageProvider = (provider: LanguageProvider) => Disposable

const getErrorMessage = async (run: CoverageCase): Promise<string> => {
  try {
    await run()
  } catch (error) {
    return error instanceof Error ? error.message : String(error)
  }
  return 'Expected an error'
}

const createLanguageServer = (argv: readonly string[] = ['--stdio']): LanguageServerOptions => {
  return {
    argv,
    id: 'sample-language-server',
    languageId: 'sample-language',
    uri: 'file:///sample-language-server.js',
  }
}

const createFileSystemProvider = (readFile: FileSystemProvider['readFile'] = (uri) => `content:${uri}`): FileSystemProvider => {
  return {
    id: 'sample-file-system',
    readFile,
  }
}

const verifyLanguageProviderRegistration = (registerProvider: RegisterLanguageProvider, methodName: string): boolean => {
  resetLanguageProviderRegistry()
  const provider: LanguageProvider = {
    id: `sample-${methodName}`,
    languageId: 'sample-language',
    [methodName]() {
      return methodName
    },
  }
  const disposable = registerProvider(provider)
  disposable.dispose()
  registerProvider(provider).dispose()
  return true
}

const cases: Readonly<Record<string, CoverageCase>> = {
  'filesystem-provider-async-read-file': async () => {
    resetFileSystemProviderRegistry()
    registerFileSystemProvider(createFileSystemProvider(async (uri) => `async:${uri}`))
    return executeFileSystemProviderReadFile('sample-file-system', 'memfs:///async.txt')
  },
  'filesystem-provider-dispose': () => {
    resetFileSystemProviderRegistry()
    const disposable = registerFileSystemProvider(createFileSystemProvider())
    disposable.dispose()
    return getFileSystemProviderRegistrySnapshot()
  },
  'filesystem-provider-duplicate': async () => {
    resetFileSystemProviderRegistry()
    registerFileSystemProvider(createFileSystemProvider())
    return getErrorMessage(() => registerFileSystemProvider(createFileSystemProvider()))
  },
  'filesystem-provider-forwards-uri': async () => {
    resetFileSystemProviderRegistry()
    let receivedUri = ''
    registerFileSystemProvider(
      createFileSystemProvider((uri) => {
        receivedUri = uri
        return ''
      }),
    )
    await executeFileSystemProviderReadFile('sample-file-system', 'memfs:///forwarded.txt')
    return receivedUri
  },
  'filesystem-provider-missing-id': () => {
    resetFileSystemProviderRegistry()
    return getErrorMessage(() =>
      registerFileSystemProvider({
        id: '',
        readFile() {
          return ''
        },
      }),
    )
  },
  'filesystem-provider-missing-read-file': () => {
    resetFileSystemProviderRegistry()
    return getErrorMessage(() => registerFileSystemProvider({ id: 'sample-file-system' } as FileSystemProvider))
  },
  'filesystem-provider-not-defined': () => {
    resetFileSystemProviderRegistry()
    return getErrorMessage(() => registerFileSystemProvider(undefined as never))
  },
  'filesystem-provider-read-file': async () => {
    resetFileSystemProviderRegistry()
    registerFileSystemProvider(createFileSystemProvider())
    return executeFileSystemProviderReadFile('sample-file-system', 'memfs:///sample.txt')
  },
  'filesystem-provider-reset': () => {
    resetFileSystemProviderRegistry()
    registerFileSystemProvider(createFileSystemProvider())
    resetFileSystemProviderRegistry()
    return getFileSystemProviderRegistrySnapshot()
  },
  'filesystem-provider-snapshot': () => {
    resetFileSystemProviderRegistry()
    registerFileSystemProvider(createFileSystemProvider())
    return getFileSystemProviderRegistrySnapshot()
  },
  'host-platform': async () => {
    const platform: Platform = await getPlatform()
    return ['electron', 'remote', 'test', 'web'].includes(platform)
  },
  'host-workspace-folder': async () => {
    return typeof (await getWorkspaceFolder()) === 'string'
  },
  'host-workspace-uri': async () => {
    await getWorkspaceUri()
    return true
  },
  'language-provider-brace-completion': () => {
    return verifyLanguageProviderRegistration(registerBraceCompletionProvider, 'provideBraceCompletion')
  },
  'language-provider-closing-tag': () => {
    return verifyLanguageProviderRegistration(registerClosingTagProvider, 'provideClosingTag')
  },
  'language-provider-code-actions': () => {
    return verifyLanguageProviderRegistration(registerCodeActionsProvider, 'provideCodeActions')
  },
  'language-provider-comment': () => {
    return verifyLanguageProviderRegistration(registerCommentProvider, 'provideComment')
  },
  'language-provider-definition': () => {
    return verifyLanguageProviderRegistration(registerDefinitionProvider, 'provideDefinition')
  },
  'language-provider-duplicate': () => {
    resetLanguageProviderRegistry()
    const provider: LanguageProvider = {
      id: 'sample-definition',
      languageId: 'sample-language',
      provideDefinition() {
        return []
      },
    }
    registerDefinitionProvider(provider)
    return getErrorMessage(() => registerDefinitionProvider(provider))
  },
  'language-provider-implementation': () => {
    return verifyLanguageProviderRegistration(registerImplementationProvider, 'provideImplementations')
  },
  'language-provider-missing-id': () => {
    resetLanguageProviderRegistry()
    return getErrorMessage(() =>
      registerDefinitionProvider({
        id: '',
        languageId: 'sample-language',
        provideDefinition() {
          return []
        },
      }),
    )
  },
  'language-provider-missing-language-id': () => {
    resetLanguageProviderRegistry()
    return getErrorMessage(() =>
      registerDefinitionProvider({
        id: 'sample-definition',
        languageId: '',
        provideDefinition() {
          return []
        },
      }),
    )
  },
  'language-provider-missing-method': () => {
    resetLanguageProviderRegistry()
    return getErrorMessage(() =>
      registerDefinitionProvider({
        id: 'sample-definition',
        languageId: 'sample-language',
      }),
    )
  },
  'language-provider-not-defined': () => {
    resetLanguageProviderRegistry()
    return getErrorMessage(() => registerDefinitionProvider(undefined as never))
  },
  'language-provider-reference': () => {
    return verifyLanguageProviderRegistration(registerReferenceProvider, 'provideReferences')
  },
  'language-provider-rename': () => {
    return verifyLanguageProviderRegistration(registerRenameProvider, 'provideRename')
  },
  'language-provider-reset': () => {
    resetLanguageProviderRegistry()
    const provider: LanguageProvider = {
      id: 'sample-definition',
      languageId: 'sample-language',
      provideDefinition() {
        return []
      },
    }
    registerDefinitionProvider(provider)
    resetLanguageProviderRegistry()
    registerDefinitionProvider(provider).dispose()
    return true
  },
  'language-provider-selection': () => {
    return verifyLanguageProviderRegistration(registerSelectionProvider, 'provideSelections')
  },
  'language-provider-tab-completion': () => {
    return verifyLanguageProviderRegistration(registerTabCompletionProvider, 'provideTabCompletion')
  },
  'language-provider-type-definition': () => {
    return verifyLanguageProviderRegistration(registerTypeDefinitionProvider, 'provideTypeDefinition')
  },
  'language-server-copies-argv': () => {
    resetLanguageServerRegistry()
    const argv = ['--stdio']
    registerLanguageServer(createLanguageServer(argv))
    argv.push('--mutated')
    return getLanguageServerRegistrySnapshot().languageServers[0]?.argv
  },
  'language-server-dispose': () => {
    resetLanguageServerRegistry()
    const disposable = registerLanguageServer(createLanguageServer())
    disposable.dispose()
    return getLanguageServerRegistrySnapshot()
  },
  'language-server-duplicate': () => {
    resetLanguageServerRegistry()
    registerLanguageServer(createLanguageServer())
    return getErrorMessage(() => registerLanguageServer(createLanguageServer()))
  },
  'language-server-invalid-argv': () => {
    resetLanguageServerRegistry()
    return getErrorMessage(() =>
      registerLanguageServer({
        ...createLanguageServer(),
        argv: [1],
      } as unknown as LanguageServerOptions),
    )
  },
  'language-server-missing-id': () => {
    resetLanguageServerRegistry()
    return getErrorMessage(() => registerLanguageServer({ ...createLanguageServer(), id: '' }))
  },
  'language-server-missing-language-id': () => {
    resetLanguageServerRegistry()
    return getErrorMessage(() => registerLanguageServer({ ...createLanguageServer(), languageId: '' }))
  },
  'language-server-missing-uri': () => {
    resetLanguageServerRegistry()
    return getErrorMessage(() => registerLanguageServer({ ...createLanguageServer(), uri: '' }))
  },
  'language-server-not-defined': () => {
    resetLanguageServerRegistry()
    return getErrorMessage(() => registerLanguageServer(undefined as never))
  },
  'language-server-reset': () => {
    resetLanguageServerRegistry()
    registerLanguageServer(createLanguageServer())
    resetLanguageServerRegistry()
    return getLanguageServerRegistrySnapshot()
  },
  'language-server-snapshot': () => {
    resetLanguageServerRegistry()
    registerLanguageServer(createLanguageServer())
    return getLanguageServerRegistrySnapshot()
  },
}

const main = async (): Promise<void> => {
  registerCommand({
    async execute(caseName: string): Promise<unknown> {
      const coverageCase = cases[caseName]
      if (!coverageCase) {
        throw new Error(`Unknown isolated API coverage case ${caseName}`)
      }
      return coverageCase()
    },
    id: 'isolatedApiCoverage.run',
  })
  await activate()
}

await main()
