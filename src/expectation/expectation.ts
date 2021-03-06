import { FailedValidationResult, SucceedValidationResult, ValidationResult } from "../validator/validation-result";

import { IExpectation, Validation } from "./iexpectation";
import { IValidationGetter } from "./validation-getter";

export class Expectation<T> implements IExpectation<T>{

    constructor(
        private readonly _valueAccessor: IValidationGetter<T>,
        private readonly _validations: Validation<T>[]
    ) { }

    async run(target: T): Promise<ValidationResult> {
        const value = this._valueAccessor.getValue(target);

        for (const validation of this._validations) {
            if (!validation.condition(target)) continue;

            if (validation.type === "delegate") {
                if (!(await validation.validator(value))) {
                    const path = this._valueAccessor.path;
                    const message = validation.onFail(target, path, value);
                    return FailedValidationResult([[path, message]]);
                }
            }
            else {
                const result = await validation.validator.validate(value);
                if (result.type === "failed") {
                    const entries = Object.entries(result.errors)
                        .map(([relativePath, message]) => {
                            if (this._valueAccessor.path !== IValidationGetter.self.path) {
                                return [`${this._valueAccessor.path}.${relativePath}`, message] as const;
                            }
                            return [relativePath, message] as const;
                        });
                    return FailedValidationResult(entries);
                }
            }
        }
        return SucceedValidationResult;
    }
}
