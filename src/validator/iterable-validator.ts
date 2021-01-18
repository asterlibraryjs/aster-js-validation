import { ValidatorGroup } from "./validator-group";
import { IIterableValidator, IValidator } from "./ivalidator";
import { FailedValidationResult, SucceedValidationResult, ValidationResult } from "./validation-result";

export class IterableValidator<T> implements IIterableValidator<T>{

    constructor(
        private readonly _itemValidator: IValidator<T>
    ) { }

    async validate(target: Iterable<T>): Promise<ValidationResult> {
        const errors = new Map<string, string>();

        let idx = 0;
        for (const item of target) {
            const result = await this._itemValidator.validate(item);
            if (result.type === "failed") {
                for (const [path, message] of Object.entries(result.errors)) {
                    errors.set(`${0}.${path}`, message);
                }
            }
            idx++;
        }

        if (errors.size) {
            return FailedValidationResult(errors);
        }

        return SucceedValidationResult;
    }

    groupWith(validator: IIterableValidator<T>): IIterableValidator<T> {
        return new ValidatorGroup<Iterable<T>>([validator, this]);
    }

    asIterableValidator(): IIterableValidator<Iterable<T>> {
        return new IterableValidator<Iterable<T>>(this);
    }
}
