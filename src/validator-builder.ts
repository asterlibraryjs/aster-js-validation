import { IValidationRuleBuilder } from "./ivalidator-rule-builder";
import { ValidationPropertyGetter } from "./validation-getter";
import { Validator } from "./validator";
import { ValidationRuleBuilder } from "./validator-rule-builder";

const succeedResult = { type: "succeed" } as const;
Object.freeze(succeedResult);

export class ValidatorBuilder<T> {
    private readonly _builders: Map<string, ValidationRuleBuilder<T, any>> = new Map();

    for<K extends keyof T & string>(property: K): IValidationRuleBuilder<T, T[K]> {
        if (this._builders.has(property)) throw new Error(`A rule has already been defined for this property`);

        const accessor = new ValidationPropertyGetter<T, K>(property);
        const builder = new ValidationRuleBuilder(accessor);
        this._builders.set(property, builder);
        return builder;
    }

    build(): Validator<T> {
        const rules = [...this._builders.values()].map(b => b.build());
        return new Validator<T>(rules);
    }
}
