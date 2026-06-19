import { activate, createOutputChannel, registerCommand } from '@lvce-editor/api'

const output = createOutputChannel('sample-output-get-logs')
let didWriteInitialLogs = false

const writeInitialLogs = async (): Promise<void> => {
  if (didWriteInitialLogs) {
    return
  }
  didWriteInitialLogs = true
  await output.appendLine('extension started')
  await output.append('ready')
}

const main = async (): Promise<void> => {
  registerCommand({
    id: 'sample.output.getLogs',
    async execute() {
      await writeInitialLogs()
      return await output.getLogs()
    },
  })

  registerCommand({
    id: 'sample.output.replaceAndClear',
    async execute() {
      await output.replace('replacement')
      const replaced = await output.getLogs()
      await output.clear()
      const cleared = await output.getLogs()
      return {
        cleared,
        replaced,
      }
    },
  })

  await activate()
}

await main()
