import { IValidator } from "./ivalidator";
import { ValidationDelegate } from "./ivalidator-rule";

export type ValidationDelegateFactory<V = any, TArgs extends any[] = any[]> = (...args: TArgs) => ValidationDelegate<V> | Iterable<ValidationDelegate<V>>;

export interface IValidationRuleBuilder<T, V> {
    must<TArgs extends any[] = any[]>(validator: IValidator<V>): IValidationRuleBuilderWhenAndMessage<T, V>;
    must<TArgs extends any[] = any[]>(validation: ValidationDelegateFactory<V, TArgs>, ...args: TArgs): IValidationRuleBuilderWhenAndMessage<T, V>;
}

export interface IValidationRuleBuilderWhenAndMessage<T, V> extends IValidationRuleBuilderMessage<T, V> {
    when(condition: (target: T) => boolean): IValidationRuleBuilderMessage<T, V>;
}

export interface IValidationRuleBuilderMessage<T, V> {
    withMessage(message: string): IValidationRuleBuilderEnd<T, V>;
}

export interface IValidationRuleBuilderEnd<T, V> {
    readonly and: IValidationRuleBuilder<T, V>;
}
