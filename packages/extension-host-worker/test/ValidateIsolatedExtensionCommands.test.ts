import { beforeEach, expect, test } from '@jest/globals'
import * as ExtensionHostCommand from '../src/parts/ExtensionHostCommand/ExtensionHostCommand.ts'
import * as ExtensionHostCompletion from '../src/parts/ExtensionHostCompletion/ExtensionHostCompletion.ts'
import * as ExtensionHostFormatting from '../src/parts/ExtensionHostFormatting/ExtensionHostFormatting.ts'
import * as ValidateIsolatedExtensionCommands from '../src/parts/ValidateIsolatedExtensionCommands/ValidateIsolatedExtensionCommands.ts'

beforeEach(() => {
  ExtensionHostCommand.reset()
  ExtensionHostCompletion.reset()
  ExtensionHostFormatting.reset()
})

test('validateIsolatedExtensionCommands - duplicate command contribution', () => {
  ExtensionHostCommand.registerCommand({
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
  ExtensionHostCommand.registerCommand({
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

test('validateIsolatedExtensionFormattingProviders - duplicate formatting provider contribution', () => {
  ExtensionHostFormatting.registerFormattingProvider({
    format() {
      return []
    },
    id: 'sample.duplicateFormatter',
    languageId: 'javascript',
  })
  expect(() => {
    ValidateIsolatedExtensionCommands.validateIsolatedExtensionFormattingProviders(
      {
        formattingProviders: [{ id: 'sample.duplicateFormatter' }, { id: 'sample.duplicateFormatter' }],
        isolated: true,
      },
      [],
    )
  }).toThrow(new Error('formatting provider sample.duplicateFormatter is contributed multiple times'))
})

test('validateIsolatedExtensionFormattingProviders - registered formatting provider missing from extension json', () => {
  const beforeFormattingProviderIds = ValidateIsolatedExtensionCommands.getRegisteredFormattingProviderIds()
  ExtensionHostFormatting.registerFormattingProvider({
    format() {
      return []
    },
    id: 'sample.missingFormatterContribution',
    languageId: 'javascript',
  })
  expect(() => {
    ValidateIsolatedExtensionCommands.validateIsolatedExtensionFormattingProviders(
      {
        formattingProviders: [],
        isolated: true,
      },
      beforeFormattingProviderIds,
    )
  }).toThrow(new Error('formatting provider sample.missingFormatterContribution is registered but not contributed in extension.json'))
})

test('validateIsolatedExtensionFormattingProviders - contributed formatting provider not registered', () => {
  expect(() => {
    ValidateIsolatedExtensionCommands.validateIsolatedExtensionFormattingProviders(
      {
        formattingProviders: [{ id: 'sample.missingFormatterRegistration' }],
        isolated: true,
      },
      [],
    )
  }).toThrow(new Error('formatting provider sample.missingFormatterRegistration is contributed in extension.json but not registered'))
})

test('validateIsolatedExtensionCompletionProviders - duplicate completion provider contribution', () => {
  ExtensionHostCompletion.registerCompletionProvider({
    id: 'sample.duplicateCompletion',
    languageId: 'javascript',
    provideCompletions() {
      return []
    },
  })
  expect(() => {
    ValidateIsolatedExtensionCommands.validateIsolatedExtensionCompletionProviders(
      {
        completionProviders: [{ id: 'sample.duplicateCompletion' }, { id: 'sample.duplicateCompletion' }],
        isolated: true,
      },
      [],
    )
  }).toThrow(new Error('completion provider sample.duplicateCompletion is contributed multiple times'))
})

test('validateIsolatedExtensionCompletionProviders - registered completion provider missing from extension json', () => {
  const beforeCompletionProviderIds = ValidateIsolatedExtensionCommands.getRegisteredCompletionProviderIds()
  ExtensionHostCompletion.registerCompletionProvider({
    id: 'sample.missingCompletionContribution',
    languageId: 'javascript',
    provideCompletions() {
      return []
    },
  })
  expect(() => {
    ValidateIsolatedExtensionCommands.validateIsolatedExtensionCompletionProviders(
      {
        completionProviders: [],
        isolated: true,
      },
      beforeCompletionProviderIds,
    )
  }).toThrow(new Error('completion provider sample.missingCompletionContribution is registered but not contributed in extension.json'))
})

test('validateIsolatedExtensionCompletionProviders - contributed completion provider not registered', () => {
  expect(() => {
    ValidateIsolatedExtensionCommands.validateIsolatedExtensionCompletionProviders(
      {
        completionProviders: [{ id: 'sample.missingCompletionRegistration' }],
        isolated: true,
      },
      [],
    )
  }).toThrow(new Error('completion provider sample.missingCompletionRegistration is contributed in extension.json but not registered'))
})
