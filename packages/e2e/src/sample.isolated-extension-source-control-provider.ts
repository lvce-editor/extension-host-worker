import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'sample.isolated-extension-source-control-provider'

const assertJsonEqual = (actual: unknown, expected: unknown): void => {
  const actualJson = JSON.stringify(actual)
  const expectedJson = JSON.stringify(expected)
  if (actualJson !== expectedJson) {
    throw new Error(`Expected ${expectedJson} but got ${actualJson}`)
  }
}

export const test: Test = async ({ Command, Extension }) => {
  const uri = import.meta.resolve(`../fixtures/${name}`)
  await Extension.addWebExtension(uri)

  const result = await Command.execute('ExtensionHost.executeCommand', 'isolatedSourceControl.run')

  assertJsonEqual(result, {
    changedFiles: [
      {
        file: '/workspace/changed.txt',
        status: 1,
      },
    ],
    changedFilesAfterActions: [
      {
        file: '/workspace/changed.txt',
        status: 1,
      },
      {
        file: '/workspace/added.txt',
        status: 2,
      },
      {
        file: '/workspace/discarded.txt',
        status: 3,
      },
    ],
    commitMessage: 'feat: isolated source control',
    decorations: [
      {
        color: 'modified',
        letter: 'M',
        uri: '/workspace/changed.txt',
      },
    ],
    enabledProviderIds: ['isolatedSourceControl'],
    features: {
      lastInput: 'feat: accepted input',
      showGenerateCommitMessageButton: true,
    },
    fileBefore: 'before:/workspace/changed.txt',
    groups: [
      {
        id: 'changes',
        items: [
          {
            file: '/workspace/changed.txt',
            status: 1,
          },
        ],
        label: 'Changes',
      },
    ],
  })
}
