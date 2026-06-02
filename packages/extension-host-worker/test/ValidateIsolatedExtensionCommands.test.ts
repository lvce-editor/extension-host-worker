import { beforeEach, expect, test } from '@jest/globals'
import { registerCommand, resetCommandRegistry } from '../../extension-api/src/parts/Command/Command.ts'
import * as ValidateIsolatedExtensionCommands from '../src/parts/ValidateIsolatedExtensionCommands/ValidateIsolatedExtensionCommands.ts'

beforeEach(() => {
  resetCommandRegistry()
})

test('validateIsolatedExtensionCommands - duplicate command contribution', () => {
  registerCommand({
    execute(): void {},
    id: 'sample.duplicate',
  })
  expect(() => {
    ValidateIsolatedExtensionCommands.validateIsolatedExtensionCommands(
      {
        commands: [{ id: 'sample.duplicate' }, { id: 'sample.duplicate' }],
        isolated: true,
      },
      [],
    )
  }).toThrow(new Error('command sample.duplicate is contributed multiple times'))
})

test('validateIsolatedExtensionCommands - registered command missing from extension json', () => {
  const beforeCommandIds = ValidateIsolatedExtensionCommands.getRegisteredCommandIds()
  registerCommand({
    execute(): void {},
    id: 'sample.missingContribution',
  })
  expect(() => {
    ValidateIsolatedExtensionCommands.validateIsolatedExtensionCommands(
      {
        commands: [],
        isolated: true,
      },
      beforeCommandIds,
    )
  }).toThrow(new Error('command sample.missingContribution is registered but not contributed in extension.json'))
})

test('validateIsolatedExtensionCommands - contributed command not registered', () => {
  expect(() => {
    ValidateIsolatedExtensionCommands.validateIsolatedExtensionCommands(
      {
        commands: [{ id: 'sample.missingRegistration' }],
        isolated: true,
      },
      [],
    )
  }).toThrow(new Error('command sample.missingRegistration is contributed in extension.json but not registered'))
})
