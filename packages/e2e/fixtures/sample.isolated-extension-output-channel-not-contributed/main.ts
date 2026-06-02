import { activate, createOutputChannel } from '@lvce-editor/api'

createOutputChannel('sample-output-missing-contribution')

const main = async (): Promise<void> => {
  await activate()
}

main()
