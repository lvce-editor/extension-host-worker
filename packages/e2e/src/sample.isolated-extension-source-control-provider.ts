import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'sample.isolated-extension-source-control-provider'

export const test: Test = async ({ Command, Extension }) => {
  const uri = import.meta.resolve(`../fixtures/${name}`)
  await Extension.addWebExtension(uri)

  const changedFiles = await Command.execute('ExtensionHost.executeCommand', 'isolatedSourceControl.getChangedFiles')
  if (JSON.stringify(changedFiles) !== JSON.stringify([{ file: '/workspace/isolated-added.txt', status: 1 }])) {
    throw new Error(`Expected isolated changed files, got ${JSON.stringify(changedFiles)}`)
  }

  const groups = await Command.execute('ExtensionHost.executeCommand', 'isolatedSourceControl.getGroups', '/workspace')
  if (
    JSON.stringify(groups) !==
    JSON.stringify([
      {
        id: 'isolated-changes',
        items: [{ file: '/workspace/isolated-added.txt', status: 1 }],
        label: 'Isolated Changes',
      },
    ])
  ) {
    throw new Error(`Expected isolated source control groups, got ${JSON.stringify(groups)}`)
  }

  const enabledProviderIds = await Command.execute(
    'ExtensionHost.executeCommand',
    'isolatedSourceControl.getEnabledProviderIds',
    'file',
    '/workspace',
  )
  if (JSON.stringify(enabledProviderIds) !== JSON.stringify(['isolatedSourceControl'])) {
    throw new Error(`Expected isolated source control provider to be enabled, got ${JSON.stringify(enabledProviderIds)}`)
  }

  const features = await Command.execute('ExtensionHost.executeCommand', 'isolatedSourceControl.getFeatures')
  if (JSON.stringify(features) !== JSON.stringify({ showGenerateCommitMessageButton: true })) {
    throw new Error(`Expected isolated source control features, got ${JSON.stringify(features)}`)
  }

  const fileBefore = await Command.execute('ExtensionHost.executeCommand', 'isolatedSourceControl.getFileBefore', '/workspace/isolated-added.txt')
  if (fileBefore !== 'before:/workspace/isolated-added.txt') {
    throw new Error(`Expected isolated file before result, got ${JSON.stringify(fileBefore)}`)
  }

  const commitMessage = await Command.execute('ExtensionHost.executeCommand', 'isolatedSourceControl.generateCommitMessage')
  if (commitMessage !== 'feat: isolated source control') {
    throw new Error(`Expected isolated commit message, got ${JSON.stringify(commitMessage)}`)
  }

  const decorations = await Command.execute('ExtensionHost.executeCommand', 'isolatedSourceControl.getFileDecorations', [
    '/workspace/isolated-added.txt',
  ])
  if (JSON.stringify(decorations) !== JSON.stringify([{ badge: 'M', uri: '/workspace/isolated-added.txt' }])) {
    throw new Error(`Expected isolated file decorations, got ${JSON.stringify(decorations)}`)
  }

  await Command.execute('ExtensionHost.executeCommand', 'isolatedSourceControl.acceptInput', 'commit message')
  await Command.execute('ExtensionHost.executeCommand', 'isolatedSourceControl.add', '/workspace/isolated-added.txt')
  await Command.execute('ExtensionHost.executeCommand', 'isolatedSourceControl.discard', '/workspace/isolated-added.txt')
}
