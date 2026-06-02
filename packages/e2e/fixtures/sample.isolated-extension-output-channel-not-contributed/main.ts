import { activate, createOutputChannel } from '@lvce-editor/api'

createOutputChannel('sample.output.missingContribution')

const main = async (): Promise<void> => {
  await activate()
}

main()
