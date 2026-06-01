import type { Disposable } from '../Disposable/Disposable.ts'

export interface ActivationContext {
  readonly subscriptions: Disposable[]
}

export type ActivationResult = void | Disposable | readonly Disposable[] | Promise<void | Disposable | readonly Disposable[]>

export type ActivationFunction<TContext extends ActivationContext = ActivationContext> = (context: TContext) => ActivationResult

export const activate = <TContext extends ActivationContext = ActivationContext>(activation: ActivationFunction<TContext>): ActivationFunction<TContext> => {
  return activation
}
