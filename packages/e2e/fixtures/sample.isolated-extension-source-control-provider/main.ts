import {
  activate as activateExtensionApi,
  executeSourceControlAcceptInput,
  executeSourceControlAdd,
  executeSourceControlDiscard,
  executeSourceControlGenerateCommitMessage,
  executeSourceControlGetChangedFiles,
  executeSourceControlGetFeatures,
  executeSourceControlGetFileBefore,
  executeSourceControlGetFileDecorations,
  executeSourceControlGetGroups,
  executeSourceControlIsActive,
  registerCommand,
  registerSourceControlProvider,
} from '@lvce-editor/api'

const providerId = 'isolatedSourceControl'

const activate = async (): Promise<void> => {
  await activateExtensionApi()
  registerSourceControlProvider({
    acceptInput(value) {
      return `accepted:${value}`
    },
    add(path) {
      return `added:${path}`
    },
    discard(path) {
      return `discarded:${path}`
    },
    generateCommitMessage() {
      return 'feat: isolated source control'
    },
    getChangedFiles() {
      return [
        {
          file: '/workspace/isolated-added.txt',
          status: 1,
        },
      ]
    },
    getFeatures() {
      return {
        showGenerateCommitMessageButton: true,
      }
    },
    getFileBefore(uri) {
      return `before:${uri}`
    },
    getFileDecorations(uris) {
      return uris.map((uri) => ({
        badge: 'M',
        uri,
      }))
    },
    getGroups(cwd) {
      return [
        {
          id: 'isolated-changes',
          items: [
            {
              file: `${cwd}/isolated-added.txt`,
              status: 1,
            },
          ],
          label: 'Isolated Changes',
        },
      ]
    },
    id: providerId,
    isActive(scheme, root) {
      return scheme === 'file' && root === '/workspace'
    },
  })
  registerCommand({
    execute() {
      return executeSourceControlGetChangedFiles(providerId)
    },
    id: 'isolatedSourceControl.getChangedFiles',
  })
  registerCommand({
    execute(cwd: string) {
      return executeSourceControlGetGroups(providerId, cwd)
    },
    id: 'isolatedSourceControl.getGroups',
  })
  registerCommand({
    async execute(scheme: string, root: string) {
      return (await executeSourceControlIsActive(providerId, scheme, root)) ? [providerId] : []
    },
    id: 'isolatedSourceControl.getEnabledProviderIds',
  })
  registerCommand({
    execute() {
      return executeSourceControlGetFeatures(providerId)
    },
    id: 'isolatedSourceControl.getFeatures',
  })
  registerCommand({
    execute(uri: string) {
      return executeSourceControlGetFileBefore(providerId, uri)
    },
    id: 'isolatedSourceControl.getFileBefore',
  })
  registerCommand({
    execute() {
      return executeSourceControlGenerateCommitMessage(providerId)
    },
    id: 'isolatedSourceControl.generateCommitMessage',
  })
  registerCommand({
    execute(uris: readonly string[]) {
      return executeSourceControlGetFileDecorations(providerId, uris)
    },
    id: 'isolatedSourceControl.getFileDecorations',
  })
  registerCommand({
    execute(value: string) {
      return executeSourceControlAcceptInput(providerId, value)
    },
    id: 'isolatedSourceControl.acceptInput',
  })
  registerCommand({
    execute(path: string) {
      return executeSourceControlAdd(providerId, path)
    },
    id: 'isolatedSourceControl.add',
  })
  registerCommand({
    execute(path: string) {
      return executeSourceControlDiscard(providerId, path)
    },
    id: 'isolatedSourceControl.discard',
  })
}

await activate()
