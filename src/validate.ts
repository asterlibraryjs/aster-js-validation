import { Constructor, TypeOfResult } from "@aster-js/core";
import { Iterables } from "@aster-js/iterators";
import { ValidationDelegate } from "./ivalidator-rule";
import { ValidationDelegateFactory } from "./ivalidator-rule-builder";

export namespace Validate {

    export function create<V, TArgs extends any[] = any[]>(factory: ValidationDelegateFactory<V, TArgs>, ...args: TArgs): ValidationDelegate<V> {
        const validator = factory(...args);

        if (Iterables.cast(validator)) {
            const validators = [...validator]
            switch (validators.length) {
                case 0:
                    return () => true;
                case 1:
                    return validators[0];
                default:
                    return (value: any) => {
                        for (const validator of validators) {
                            if (!validator(value)) return false;
                        }
                        return true;
                    }
            }
        }

        return validator;
    }

    export function toNotBeOk(): ValidationDelegate {
        return (value: unknown) => !value;
    }

    export function toBeOk(): ValidationDelegate {
        return (value: unknown) => !!value;
    }

    export function toBeDefined(): ValidationDelegate {
        return (value: unknown) => typeof value !== "undefined";
    }

    export function toBeUndefined(): ValidationDelegate {
        return (value: unknown) => typeof value === "undefined";
    }

    export function toBeNull(): ValidationDelegate {
        return (value: unknown) => value === null;
    }

    export function toNotBeNull(): ValidationDelegate {
        return (value: unknown) => value !== null;
    }

    export function toBeValidTypeOrNull(type: TypeOfResult): ValidationDelegate {
        return (value: unknown) => typeof value === type;
    }

    export function toBeValidInstanceOf(ctor: Constructor): ValidationDelegate {
        return (value: unknown) => value instanceof ctor;
    }

    export function toNot(validator: ValidationDelegate): ValidationDelegate {
        return (value, ...additionalValues) => !validator(value, ...additionalValues);
    }

    export function* toBeTypeOf(type: TypeOfResult): Iterable<ValidationDelegate> {
        yield toBeValidTypeOrNull(type);
        yield toNotBeNull();
    }

    export function* toBeNumber({ min, max }: { min?: number, max?: number } = {}): Iterable<ValidationDelegate> {
        yield* toBeTypeOf("number");
        yield (value: number) => !isNaN(value);

        if (typeof min !== "undefined") {
            yield (value: number) => value > min;
        }
        if (typeof max !== "undefined") {
            yield (value: number) => value < max;
        }
    }

    export function* toBeString({ minLength, maxLength }: { minLength?: number, maxLength?: number } = {}): Iterable<ValidationDelegate> {
        yield* toBeTypeOf("string");

        if (typeof minLength !== "undefined") {
            yield (value: any[]) => value.length >= minLength;
        }
        if (typeof maxLength !== "undefined") {
            yield (value: any[]) => value.length <= maxLength;
        }
    }

    function isArrayInternal(): ValidationDelegate {
        return (value: unknown) => Array.isArray(value);
    }

    export function* toBeAnArray({ minSize, maxSize }: { minSize?: number, maxSize?: number } = {}): Iterable<ValidationDelegate> {
        yield isArrayInternal();

        if (typeof minSize !== "undefined") {
            yield (value: any[]) => value.length >= minSize;
        }
        if (typeof maxSize !== "undefined") {
            yield (value: any[]) => value.length <= maxSize;
        }
    }

    export function* toBeAnItemsOf<T>(items: T[]): Iterable<ValidationDelegate> {
        yield isArrayInternal();
        yield (value: any[]) => value.every(item => items.includes(item));
    }

    export function* toNotBeAnItemsOf<T>(items: T[]): Iterable<ValidationDelegate> {
        yield isArrayInternal();
        yield (value: any[]) => value.every(item => !items.includes(item));
    }
}
