import { activate, registerCommand } from '@lvce-editor/api'
import * as api from '@lvce-editor/api'

const { createOutputChannel } = api as any

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
