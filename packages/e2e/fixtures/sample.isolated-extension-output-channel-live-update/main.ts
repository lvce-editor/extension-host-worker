import { activate, createOutputChannel, registerCommand } from '@lvce-editor/api'

const output = createOutputChannel('sample.output.live')

const main = async (): Promise<void> => {
  await activate()
  await output.append('before command')

  registerCommand({
    id: 'sample.output.append',
    async execute() {
      await output.appendLine('')
      await output.append('after command')
    },
  })
}

main()
