import type { Disposable } from '../Disposable/Disposable.ts'

export interface ActivationContext {
  readonly subscriptions: Disposable[]
}

export type ActivationResult = void | Disposable | readonly Disposable[] | Promise<void | Disposable | readonly Disposable[]>

export type ActivationFunction<TContext extends ActivationContext = ActivationContext> = (context: TContext) => ActivationResult

const createActivationContext = (): ActivationContext => {
  return {
    subscriptions: [],
  }
}

export function activate<TContext extends ActivationContext = ActivationContext>(
  activation: ActivationFunction<TContext>,
): ActivationFunction<TContext>
export function activate(): Promise<ActivationContext>
export function activate<TContext extends ActivationContext = ActivationContext>(
  activation?: ActivationFunction<TContext>,
): ActivationFunction<TContext> | Promise<ActivationContext> {
  if (activation) {
    return activation
  }
  return Promise.resolve(createActivationContext())
}
