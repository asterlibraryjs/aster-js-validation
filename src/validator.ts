import { IIterableValidator, IValidator } from "./ivalidator";
import { IValidationRule } from "./ivalidator-rule";
import { SucceedValidationResult, ValidationResult } from "./validation-result";
import { ValidatorBuilder } from "./validator-builder";
import { ValidatorGroup } from "./validator-group";
import { IterableValidator } from "./iterable-validator";

export class Validator<T> implements IValidator<T> {
    private readonly _rules: readonly IValidationRule<T>[];

    constructor(
        rules: Iterable<IValidationRule<T>>
    ) {
        this._rules = [...rules];
    }

    async validate(target: T): Promise<ValidationResult> {
        const errors: Record<string, string>[] = [];
        for (const validator of this._rules) {
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

    static create<T>(configure: (builder: ValidatorBuilder<T>) => void): Validator<T> {
        const builder = new ValidatorBuilder<T>();
        configure(builder);
        return builder.build();
    }
}
