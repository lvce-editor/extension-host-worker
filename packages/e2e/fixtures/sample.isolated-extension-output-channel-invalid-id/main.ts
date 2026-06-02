import { activate, createOutputChannel } from '@lvce-editor/api'

createOutputChannel('sampleOutputInvalid')

const main = async (): Promise<void> => {
  await activate()
}

main()
