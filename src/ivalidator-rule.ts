import { IValidator } from "./ivalidator";
import { ValidationResult } from "./validation-result";

export type ValidationConditionDelegate<T> = (target: T) => boolean;

export type ValidationDelegate<V = any> = (value: V) => boolean | Promise<boolean>;

export type Validation<T, V> = DelegateValidation<T, V> | ValidatorValidation<T, V>;

export type DelegateValidation<T, V> = {
    readonly type: "delegate";
    readonly condition: ValidationConditionDelegate<T>;
    readonly validator: ValidationDelegate<V>;
    readonly message: string;
}

export type ValidatorValidation<T, V> = {
    readonly type: "validator";
    readonly condition: ValidationConditionDelegate<T>;
    readonly validator: IValidator<V>;
}

export interface IValidationRule<T> {

    run(target: T): Promise<ValidationResult>;
}
