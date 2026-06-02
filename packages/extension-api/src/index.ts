export { activate } from './parts/Activation/Activation.ts'
export { executeCommand } from './parts/ExecuteCommand/ExecuteCommand.ts'
export { showQuickPick } from './parts/QuickPick/QuickPick.ts'
export { registerCommand } from './parts/Command/Command.ts'
export {
  executeFormattingProvider,
  getFormattingProviderRegistrySnapshot,
  registerFormattingProvider,
  resetFormattingProviderRegistry,
} from './parts/Formatting/Formatting.ts'
export {
  getStatusBarItemProviderRegistrySnapshot,
  registerStatusBarItemProvider,
  resetStatusBarItemProviderRegistry,
} from './parts/StatusBar/StatusBar.ts'
export { handleExtensionManagementMessagePort } from './parts/HandleExtensionManagementMessagePort/HandleExtensionManagementMessagePort.ts'
export type { Command, CommandCallback, CommandRegistrySnapshot } from './parts/Command/Command.ts'
export type { Disposable } from './parts/Disposable/Disposable.ts'
export type { FormattingEdit, FormattingProvider, FormattingProviderRegistrySnapshot, RegisteredFormattingProvider } from './parts/Formatting/Formatting.ts'
export type { HandleExtensionManagementMessagePortOptions } from './parts/HandleExtensionManagementMessagePort/HandleExtensionManagementMessagePort.ts'
export type { QuickPickItem, ShowQuickPickOptions } from './parts/QuickPick/QuickPick.ts'
export type {
  StatusBarItem,
  StatusBarItemProvider,
  StatusBarItemProviderHandle,
  StatusBarItemProviderRegistrySnapshot,
} from './parts/StatusBar/StatusBar.ts'
