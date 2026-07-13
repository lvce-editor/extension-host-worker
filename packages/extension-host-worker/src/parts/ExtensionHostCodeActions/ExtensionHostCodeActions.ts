import * as ExecuteIsolatedLanguageProvider from '../ExecuteIsolatedLanguageProvider/ExecuteIsolatedLanguageProvider.ts'
import * as ExtensionHostTextDocument from '../ExtensionHostTextDocument/ExtensionHostTextDocument.ts'
import * as Registry from '../Registry/Registry.ts'
import * as Types from '../Types/Types.ts'

const {
  executeCodeActionProvider: executeRegisteredCodeActionProvider,
  getProvider,
  registerCodeActionProvider,
  reset,
} = Registry.create({
  name: 'CodeAction',
  resultShape: {
    items: {
      type: Types.Object,
    },
    type: Types.Array,
  },
})

export { registerCodeActionProvider, reset }

interface CodeAction {
  readonly kind: string
  readonly name: string
}

const executeCodeActionProvider = async (uid): Promise<readonly CodeAction[]> => {
  if (!ExecuteIsolatedLanguageProvider.hasLegacyProvider(getProvider, uid)) {
    const isolated = await ExecuteIsolatedLanguageProvider.execute('code action', 'provideCodeActions', uid)
    if (isolated.found) {
      return isolated.result as readonly CodeAction[]
    }
  }
  return (await executeRegisteredCodeActionProvider(uid)) as unknown as readonly CodeAction[]
}

const toSourceAction = (languageId: string, action: CodeAction) => {
  return {
    kind: action.kind,
    languageId,
    name: action.name,
  }
}

export const getSourceActions = async (uid) => {
  const textDocument = ExtensionHostTextDocument.get(uid)
  if (!textDocument) {
    return []
  }
  const actions = await executeCodeActionProvider(uid)
  return actions.map((action) => toSourceAction(textDocument.languageId, action))
}

const isOrganizeImports = (action) => {
  return action.kind === 'source.organizeImports'
}

// TODO handle case when multiple organize imports providers are registered
export const executeOrganizeImports = async (uid) => {
  if (!ExecuteIsolatedLanguageProvider.hasLegacyProvider(getProvider, uid)) {
    const isolated = await ExecuteIsolatedLanguageProvider.executeOrganizeImports(uid)
    if (isolated.found) {
      return isolated.result
    }
  }
  const actions = await executeRegisteredCodeActionProvider(uid)
  // @ts-ignore
  if (!actions || actions.length === 0) {
    return []
  }
  // @ts-ignore
  const organizeImportsAction = actions.find(isOrganizeImports)
  if (!organizeImportsAction) {
    return []
  }
  const textDocument = ExtensionHostTextDocument.get(uid)
  const edits = await organizeImportsAction.execute(textDocument)
  return edits
}
