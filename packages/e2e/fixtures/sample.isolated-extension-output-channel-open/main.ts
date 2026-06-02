import { activate } from '@lvce-editor/api'
import * as api from '@lvce-editor/api'

const { createOutputChannel } = api as any

const output = createOutputChannel('sample.output.open')

const main = async (): Promise<void> => {
  await activate()
  await output.appendLine('extension started')
  await output.append('ready')
}

main()
