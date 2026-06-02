import { activate, createOutputChannel } from '@lvce-editor/api'

createOutputChannel('sample.output.duplicate')

const main = async (): Promise<void> => {
  await activate()
}

main()
