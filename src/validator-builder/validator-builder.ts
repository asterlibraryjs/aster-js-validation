import { IExpectation } from "../expectation/iexpectation";
import { ValidationPropertyGetter } from "../expectation/validation-getter";

import { ExpectationBuilder } from "./expectation-builder";

export class ValidatorBuilder<T> {
    private readonly _builders: Map<string, ExpectationBuilder<T>> = new Map();

    expect<K extends keyof T & string>(property: K): ExpectationBuilder<T> {
        if (this._builders.has(property)) throw new Error(`A rule has already been defined for this property`);

        const accessor = new ValidationPropertyGetter<T, K>(property);
        const builder = new ExpectationBuilder(accessor);

        this._builders.set(property, builder);
        return builder;
    }

    *build(): Iterable<IExpectation<T>> {
        for (const buider of this._builders.values()) {
            yield buider.build();
        }
    }
}
