import { IterableValidator } from "./iterable-validator";
import { IValidator } from "./ivalidator";
import { SucceedValidationResult, ValidationResult } from "./validation-result";

export class ValidatorGroup<T> implements IValidator<T>{
    private readonly _validators: IValidator<T>[];

    constructor(validators: Iterable<IValidator<T>>) {
        this._validators = [...validators];
    }

    async validate(target: T): Promise<ValidationResult> {
        const results = await Promise.all(
            this._validators.map(v => v.validate(target))
        );

        let errors: Record<string, string> | undefined;
        for (const result of results) {
            if (result.type === "failed") {
                errors = { ...result.errors, ...errors };
            }
        }

        if (errors) {
            return { type: "failed", errors };
        }
        return SucceedValidationResult;
    }

    groupWith(validator: IValidator<T>): IValidator<T> {
        return new ValidatorGroup<T>([validator, ...this._validators]);
    }

    asIterableValidator(): IValidator<Iterable<T>> {
        return new IterableValidator<T>(this);
    }
}
