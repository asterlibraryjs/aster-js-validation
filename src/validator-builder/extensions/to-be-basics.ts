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

    toBeEqual(this: ExpectationBuilder<T>, expected: any): ExpectationBuilder<T> {
        return this.must((value: unknown) => value === expected);
    }

    toNotBeEqual(this: ExpectationBuilder<T>, notExpected: any): ExpectationBuilder<T> {
        return this.must((value: unknown) => value !== notExpected);
    }

    toBeNull(this: ExpectationBuilder<T>): ExpectationBuilder<T> {
        return this.toBeEqual(null);
    }

    toNotBeNull(this: ExpectationBuilder<T>): ExpectationBuilder<T> {
        return this.toNotBeEqual(null);
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
