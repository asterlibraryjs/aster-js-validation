import { asserts } from "@aster-js/core";
import { IValidator } from "./ivalidator";
import { IValidationRule, Validation, ValidationConditionDelegate, ValidationDelegate } from "./ivalidator-rule";
import { IValidationRuleBuilder, ValidationDelegateFactory } from "./ivalidator-rule-builder";
import { Validate } from "./validate";
import { IValidationGetter } from "./validation-getter";
import { ValidationRule } from "./validator-rule";

export class ValidationRuleBuilder<T, V> implements IValidationRuleBuilder<T, V>{
    private readonly _validations: Validation<T, V>[] = [];
    private _validator?: ValidationDelegate<V> | IValidator<V>;
    private _condition?: ValidationConditionDelegate<T>;
    private _message?: string;

    constructor(
        private readonly _valueAccessor: IValidationGetter<T, V>
    ) { }

    get and(): this {
        this.flushPendingValidator();
        return this;
    }

    must<TArgs extends any[] = any[]>(validator: IValidator<V>): this;
    must<TArgs extends any[] = any[]>(validator: ValidationDelegateFactory<V, TArgs>, ...args: TArgs): this;
    must<TArgs extends any[] = any[]>(validator: ValidationDelegateFactory<V, TArgs> | IValidator<V>, ...args: TArgs): this {
        if (typeof validator === "function") {
            this._validator = Validate.create(validator, ...args);
        }
        else {
            this._validator = validator;
        }
        return this;
    }

    when(condition: (target: T) => boolean): this {
        this._condition = condition;
        return this;
    }

    withMessage(message: string): this {
        this._message = message;
        return this;
    }

    build(): IValidationRule<T> {
        this.flushPendingValidator();
        return new ValidationRule<T, V>(this._valueAccessor, this._validations);
    }

    protected flushPendingValidator(): void {
        const validator = this._validator;
        if (validator) {
            const condition = this._condition ?? (() => true);

            if (typeof validator === "function") {
                asserts.defined(this._message, "You must define a message for each rules");

                this._validations.push({ type: "delegate", validator, condition, message: this._message });
            }
            else {
                this._validations.push({ type: "validator", validator, condition });
            }
        }
        delete this._validator;
        delete this._condition;
        delete this._message;
    }
}
