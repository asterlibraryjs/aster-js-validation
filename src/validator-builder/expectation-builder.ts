import { asserts } from "@aster-js/core";

import { Expectation } from "../expectation/expectation";
import { ExpectationConditionDelegate, IExpectation, Validation, ValidationFailedDelegate } from "../expectation/iexpectation";
import { ValidationDelegate } from "../expectation/validation-delegate";
import { IValidationGetter } from "../expectation/validation-getter";

import { IValidator } from "../validator/ivalidator";

export class ExpectationBuilder<T> {
    private readonly _validations: Validation<T>[] = [];
    private _validator?: ValidationDelegate | IValidator<any>;
    private _condition?: ExpectationConditionDelegate<T>;
    private _onFail?: ValidationFailedDelegate<T>;

    get and(): this { return this.flushPendingValidator(); }

    get valueAccessor(): IValidationGetter<T> { return this._valueAccessor; }

    constructor(
        private readonly _valueAccessor: IValidationGetter<T>
    ) { }

    use(validation: IValidator<any>): this {
        this.setValidation(validation);
        return this;
    }

    must(validation: ValidationDelegate | IValidator<any>): this {
        this.setValidation(validation);
        return this;
    }

    protected setValidation(validation: ValidationDelegate | IValidator<any>): void {
        asserts.notDefined(this._validator, "A validator is already defined, you must explicitly add `.and` instruction before the next validation");
        this._validator = validation;
    }

    when(condition: (target: T) => boolean): this {
        asserts.defined(this._validator, "Define a validation using `.must()` before adding a condition");

        this._condition = condition;
        return this;
    }

    orFail(message: string): this;
    orFail(callback: ValidationFailedDelegate<T>): this;
    orFail(callbackOrMessage: string | ValidationFailedDelegate<T>): this {
        asserts.defined(this._validator, "Define a validation using `.must()` before adding a message");
        this._onFail = typeof callbackOrMessage === "string" ? () => callbackOrMessage : callbackOrMessage;
        return this;
    }

    build(): IExpectation<T> {
        this.flushPendingValidator();
        return new Expectation<T>(this._valueAccessor, this._validations);
    }

    protected flushPendingValidator(): this {
        const validator = this._validator;
        if (validator) {
            const condition = this._condition ?? (() => true);

            if (typeof validator === "function") {
                const onFail = this._onFail ?? ((_, path, value) => `Invalid value for "${path}": ${JSON.stringify(value)}`);
                this._validations.push({ type: "delegate", validator, condition, onFail });
            }
            else {
                this._validations.push({ type: "validator", validator, condition });
            }
        }
        delete this._validator;
        delete this._condition;
        delete this._onFail;

        return this;
    }
}
