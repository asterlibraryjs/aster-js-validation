import { IExpectation } from "../expectation/iexpectation";
import { ExpectationBuilder } from "../validator-builder/expectation-builder";
import { ValidatorBuilder } from "../validator-builder/validator-builder";

import { IIterableValidator, IValidator } from "./ivalidator";
import { SucceedValidationResult, ValidationResult } from "./validation-result";
import { ValidatorGroup } from "./validator-group";
import { IterableValidator } from "./iterable-validator";

export class Validator<T> implements IValidator<T> {
    private readonly _expectations: readonly IExpectation<T>[];

    constructor(
        expectations: Iterable<IExpectation<T>>
    ) {
        this._expectations = [...expectations];
    }

    async validate(target: T): Promise<ValidationResult> {
        const errors: Record<string, string>[] = [];
        for (const validator of this._expectations) {
            const result = await validator.run(target);
            if (result.type === "failed") {
                errors.push(result.errors);
            }
        }

        if (errors.length) {
            return { type: "failed", errors: Object.assign({}, ...errors) };
        }
        return SucceedValidationResult;
    }

    groupWith(validator: IValidator<T>): IValidator<T> {
        return new ValidatorGroup([validator, this])
    }

    asIterableValidator(): IIterableValidator<T> {
        return new IterableValidator<T>(this);
    }

    static create<T>(configure: (expect: <K extends keyof T & string>(property?: K) => ExpectationBuilder<T>) => void): Validator<T> {
        const builder = new ValidatorBuilder<T>();
        configure(<K extends keyof T & string>(key?: K) => builder.expect(key));

        const expectations = builder.build();
        return new Validator(expectations);
    }

    static createCallback<T>(configure: (expect: <K extends keyof T & string>(property?: K) => ExpectationBuilder<T>) => void): (target: T) => Promise<ValidationResult> {
        const builder = new ValidatorBuilder<T>();
        configure(<K extends keyof T & string>(key?: K) => builder.expect(key));

        const expectations = builder.build();
        const validator = new Validator(expectations);
        return (target: T) => validator.validate(target)
    }
}
