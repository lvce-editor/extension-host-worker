import {
  activate as activateExtensionApi,
  registerCommand,
  registerSourceControlProvider,
  sourceControlAcceptInput,
  sourceControlAdd,
  sourceControlDiscard,
  sourceControlGenerateCommitMessage,
  sourceControlGetChangedFiles,
  sourceControlGetEnabledProviderIds,
  sourceControlGetFeatures,
  sourceControlGetFileBefore,
  sourceControlGetFileDecorations,
  sourceControlGetGroups,
} from '@lvce-editor/api'

let inputValue = ''
let addedPath = ''
let discardedPath = ''

const activate = async (): Promise<void> => {
  await activateExtensionApi()
  registerSourceControlProvider({
    acceptInput(value) {
      inputValue = value
    },
    add(path) {
      addedPath = path
    },
    discard(path) {
      discardedPath = path
    },
    generateCommitMessage() {
      return 'feat: isolated source control'
    },
    getChangedFiles() {
      return [
        {
          file: '/workspace/changed.txt',
          status: 1,
        },
        {
          file: addedPath,
          status: 2,
        },
        {
          file: discardedPath,
          status: 3,
        },
      ].filter((item) => item.file)
    },
    getFeatures() {
      return {
        lastInput: inputValue,
        showGenerateCommitMessageButton: true,
      }
    },
    getFileBefore(uri) {
      return `before:${uri}`
    },
    getFileDecorations(uris) {
      return uris.map((uri) => ({
        color: 'modified',
        letter: 'M',
        uri,
      }))
    },
    getGroups(cwd) {
      return [
        {
          id: 'changes',
          items: [
            {
              file: `${cwd}/changed.txt`,
              status: 1,
            },
          ],
          label: 'Changes',
        },
      ]
    },
    id: 'isolatedSourceControl',
    isActive(scheme, root) {
      return scheme === 'file' && root === '/workspace'
    },
  })
  registerCommand({
    id: 'isolatedSourceControl.run',
    async execute() {
      const changedFiles = await sourceControlGetChangedFiles('isolatedSourceControl')
      const groups = await sourceControlGetGroups('isolatedSourceControl', '/workspace')
      const fileBefore = await sourceControlGetFileBefore('isolatedSourceControl', '/workspace/changed.txt')
      const commitMessage = await sourceControlGenerateCommitMessage('isolatedSourceControl')
      await sourceControlAcceptInput('isolatedSourceControl', 'feat: accepted input')
      const features = await sourceControlGetFeatures('isolatedSourceControl')
      const decorations = await sourceControlGetFileDecorations('isolatedSourceControl', ['/workspace/changed.txt'])
      const enabledProviderIds = await sourceControlGetEnabledProviderIds('file', '/workspace')
      await sourceControlAdd('/workspace/added.txt')
      await sourceControlDiscard('/workspace/discarded.txt')
      const changedFilesAfterActions = await sourceControlGetChangedFiles('isolatedSourceControl')
      return {
        changedFiles,
        changedFilesAfterActions,
        commitMessage,
        decorations,
        enabledProviderIds,
        features,
        fileBefore,
        groups,
      }
    },
  })
}

await activate()
