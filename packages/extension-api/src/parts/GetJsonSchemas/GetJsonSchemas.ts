import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'
import type { JsonSchemaContribution } from '../JsonSchemaContribution/JsonSchemaContribution.ts'

export const getJsonSchemas = async (): Promise<readonly JsonSchemaContribution[]> => {
  return ExtensionManagementWorker.invoke('Extensions.getJsonSchemas') as Promise<readonly JsonSchemaContribution[]>
}
