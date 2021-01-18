import { Constructor, TypeOfResult } from "@aster-js/core";

import { ValidationDelegate } from "../expectation/validation-delegate";

import { IExpectationBuilder } from "./iexpectation-builder";

export interface ExpectationBuilderExtensions<T> extends IExpectationBuilder<T> { }

export class ExpectationBuilderExtensions<T> {

    toNotBeOk(): this {
        return this.must((value: unknown) => !value);
    }

    toBeOk(): this {
        return this.must((value: unknown) => !!value);
    }

    toBeDefined(): this {
        return this.must((value: unknown) => typeof value !== "undefined");
    }

    toBeUndefined(): this {
        return this.must((value: unknown) => typeof value === "undefined");
    }

    toBeNull(): this {
        return this.must((value: unknown) => value === null);
    }

    toNotBeNull(): this {
        return this.must((value: unknown) => value !== null);
    }

    toBeValidTypeOrNull(type: TypeOfResult): this {
        return this.must((value: unknown) => typeof value === type);
    }

    toBeValidInstanceOf(ctor: Constructor): this {
        return this.must((value: unknown) => value instanceof ctor);
    }

    toBeTypeOf(type: TypeOfResult): this {
        return this.must((value: unknown) => typeof value === type && value !== null);
    }

    toBeNumber({ min, max }: { min?: number, max?: number } = {}): this {
        const validation = ValidationDelegate.create(function* () {
            yield (value: number) => typeof value === "number" && !isNaN(value);

            if (typeof min !== "undefined") {
                yield (value: number) => value > min;
            }
            if (typeof max !== "undefined") {
                yield (value: number) => value < max;
            }
        });
        return this.must(validation);
    }

    toBeString({ minLength, maxLength }: { minLength?: number, maxLength?: number } = {}): this {
        const validation = ValidationDelegate.create(function* () {
            yield (value: any) => typeof value === "string";

            if (typeof minLength !== "undefined") {
                yield (value: any[]) => value.length >= minLength;
            }
            if (typeof maxLength !== "undefined") {
                yield (value: any[]) => value.length <= maxLength;
            }
        });
        return this.must(validation);
    }

    toBeAnArray({ minSize, maxSize }: { minSize?: number, maxSize?: number } = {}): this {
        const validation = ValidationDelegate.create(function* () {
            yield (value: unknown) => Array.isArray(value);

            if (typeof minSize !== "undefined") {
                yield (value: any[]) => value.length >= minSize;
            }
            if (typeof maxSize !== "undefined") {
                yield (value: any[]) => value.length <= maxSize;
            }
        });
        return this.must(validation);
    }

    toBeAnItemsOf(items: any[]): this {
        const validation = ValidationDelegate.create(function* () {
            yield (value: unknown) => Array.isArray(value);
            yield (value: any[]) => value.every(item => items.includes(item));
        });
        return this.must(validation);
    }

    toNotBeAnItemsOf(items: any[]): this {
        const validation = ValidationDelegate.create(function* () {
            yield (value: unknown) => Array.isArray(value);
            yield (value: any[]) => value.every(item => !items.includes(item));
        });
        return this.must(validation);
    }
}
