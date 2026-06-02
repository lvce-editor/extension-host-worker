import { activate, createOutputChannel } from '@lvce-editor/api'

const output = createOutputChannel('sample.output.open')

const main = async (): Promise<void> => {
  await activate()
  await output.appendLine('extension started')
  await output.append('ready')
}

main()
