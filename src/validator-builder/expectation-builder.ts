import { asserts } from "@aster-js/core";

import { Expectation } from "../expectation/expectation";
import { ExpectationConditionDelegate, IExpectation, Validation } from "../expectation/iexpectation";
import { ValidationDelegate } from "../expectation/validation-delegate";
import { IValidationGetter } from "../expectation/validation-getter";

import { IValidator } from "../validator/ivalidator";

import { ExpectationBuilderExtensions } from "./expectation-builder-extensions";

export class ExpectationBuilder<T> extends ExpectationBuilderExtensions<T> {
    private readonly _validations: Validation<T>[] = [];
    private _validator?: ValidationDelegate | IValidator<any>;
    private _condition?: ExpectationConditionDelegate<T>;
    private _message?: string;

    get and(): this { return this.flushPendingValidator(); }

    constructor(
        private readonly _valueAccessor: IValidationGetter<T>
    ) { super();}

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

    orFail(message: string): this {
        asserts.defined(this._validator, "Define a validation using `.must()` before adding a message");

        this._message = message;
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
                asserts.defined(this._message, "You must define a message for each expectations that doesn't use a custom validator");

                this._validations.push({ type: "delegate", validator, condition, message: this._message });
            }
            else {
                this._validations.push({ type: "validator", validator, condition });
            }
        }
        delete this._validator;
        delete this._condition;
        delete this._message;

        return this;
    }
}
