import { Lookup } from "@aster-js/collections";
import { IExpectation } from "../expectation/iexpectation";
import { IValidationGetter, ValidationPropertyGetter } from "../expectation/validation-getter";

import { ExpectationBuilder } from "./expectation-builder";
import "./extensions";

export class ValidatorBuilder<T> {
    private readonly _builders: Lookup<IValidationGetter, ExpectationBuilder<T>> = new Lookup(acc => acc.path);

    expect<K extends keyof T & string>(property?: K): ExpectationBuilder<T> {
        const accessor = property ? new ValidationPropertyGetter<T, K>(property) : IValidationGetter.self;
        const builder = new ExpectationBuilder(accessor);

        this._builders.add(accessor, builder);
        return builder;
    }

    *build(): Iterable<IExpectation<T>> {
        for (const buider of this._builders.values()) {
            yield buider.build();
        }
    }
}
