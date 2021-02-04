import { ValidationDelegate } from "../../expectation/validation-delegate";
import { ExpectationBuilder } from "../expectation-builder";

export type StringExpectations = { minLength?: number, maxLength?: number };

function* getValidations({ minLength, maxLength }: StringExpectations): Iterable<ValidationDelegate> {
    yield (value: unknown) => typeof value === "string";

    if (typeof minLength !== "undefined") {
        yield (value: string) => value.length >= minLength;
    }
    if (typeof maxLength !== "undefined") {
        yield (value: string) => value.length <= maxLength;
    }
}

export class ToBeStringExtensions<T> {

    toBeString(this: ExpectationBuilder<T>, options: StringExpectations = {}): ExpectationBuilder<T> {
        const validation = ValidationDelegate.create(() => getValidations(options));
        return this.must(validation);
    }

    toNotBeEmptyOrWhiteSpaces(this: ExpectationBuilder<T>, options: StringExpectations = {}): ExpectationBuilder<T> {
        const validation = ValidationDelegate.create(function* () {
            yield* getValidations(options);
            yield (value: string) => Boolean(value.trim());
        });
        return this.must(validation);
    }

    toBeAlphaNum(this: ExpectationBuilder<T>, options: StringExpectations = {}): ExpectationBuilder<T> {
        const validation = ValidationDelegate.create(function* () {
            yield* getValidations(options);
            yield (value: string) => /^[a-z0-9]+$/i.test(value)
        });
        return this.must(validation);
    }

    toBeAlpha(this: ExpectationBuilder<T>, options: StringExpectations = {}): ExpectationBuilder<T> {
        const validation = ValidationDelegate.create(function* () {
            yield* getValidations(options);
            yield (value: string) => /^[a-z]+$/i.test(value)
        });
        return this.must(validation);
    }

    toBeStringDate(this: ExpectationBuilder<T>): ExpectationBuilder<T> {
        const validation = ValidationDelegate.create(function* () {
            yield (value: unknown) => typeof value === "string";
            yield (value: string) => {
                const parsed = Date.parse(value);
                return !isNaN(parsed);
            }
        });
        return this.must(validation);
    }

    toBeStringNumber(this: ExpectationBuilder<T>): ExpectationBuilder<T> {
        const validation = ValidationDelegate.create(function* () {
            yield (value: unknown) => typeof value === "string";
            yield (value: string) => !isNaN(+value)
        });
        return this.must(validation);
    }

    toMatch(this: ExpectationBuilder<T>, regex: RegExp): ExpectationBuilder<T> {
        const validation = ValidationDelegate.create(function* () {
            yield (value: unknown) => typeof value === "string";
            yield (value: string) => regex.test(value)
        });
        return this.must(validation);
    }

    toBeIPV4(this: ExpectationBuilder<T>): ExpectationBuilder<T> {
        return this.toMatch(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/);
    }

    toBeMailAddress(this: ExpectationBuilder<T>): ExpectationBuilder<T> {
        return this.toMatch(/^([\w\-\.]){1,}\@([\w\-\.]){1,}\.([a-z]){2,4}$/i);
    }
}
