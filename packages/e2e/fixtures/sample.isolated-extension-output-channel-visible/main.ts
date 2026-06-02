import { activate, createOutputChannel } from '@lvce-editor/api'

createOutputChannel('sample-output-visible')

const main = async (): Promise<void> => {
  await activate()
}

main()
