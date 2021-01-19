import { Constructor, TypeOfResult } from "@aster-js/core";

import { ExpectationBuilder } from "../expectation-builder";

export class ToBeBasicsExtensions<T> {

    toBeOk(this: ExpectationBuilder<T>): ExpectationBuilder<T> {
        return this.must((value: unknown) => Boolean(value));
    }

    toNotBeOk(this: ExpectationBuilder<T>): ExpectationBuilder<T> {
        return this.must((value: unknown) => !Boolean(value));
    }

    toBeDefined(this: ExpectationBuilder<T>): ExpectationBuilder<T> {
        return this.must((value: unknown) => typeof value !== "undefined");
    }

    toBeUndefined(this: ExpectationBuilder<T>): ExpectationBuilder<T> {
        return this.must((value: unknown) => typeof value === "undefined");
    }

    toBeNull(this: ExpectationBuilder<T>): ExpectationBuilder<T> {
        return this.must((value: unknown) => value === null);
    }

    toNotBeNull(this: ExpectationBuilder<T>): ExpectationBuilder<T> {
        return this.must((value: unknown) => value !== null);
    }

    toBeValidTypeOrNull(this: ExpectationBuilder<T>, type: TypeOfResult): ExpectationBuilder<T> {
        return this.must((value: unknown) => typeof value === type);
    }

    toBeValidInstanceOf(this: ExpectationBuilder<T>, ctor: Constructor): ExpectationBuilder<T> {
        return this.must((value: unknown) => value instanceof ctor);
    }

    toBeTypeOf(this: ExpectationBuilder<T>, type: TypeOfResult): ExpectationBuilder<T> {
        return this.must((value: unknown) => typeof value === type && value !== null);
    }
}
