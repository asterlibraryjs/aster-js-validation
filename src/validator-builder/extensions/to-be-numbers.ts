import { ValidationDelegate } from "../../expectation/validation-delegate";
import { ExpectationBuilder } from "../expectation-builder";

export type NumberExpectations = { min?: number, max?: number, includeMin?: boolean, includeMax?: boolean };

function* getValidations({ min, max, includeMin, includeMax }: NumberExpectations): Iterable<ValidationDelegate> {
    yield (value: unknown) => typeof value === "number" && !isNaN(value);

    if (typeof min !== "undefined") {
        if (includeMin) {
            yield (value: number) => value >= min;
        }
        else {
            yield (value: number) => value > min;
        }
    }
    if (typeof max !== "undefined") {
        if (includeMax) {
            yield (value: number) => value <= max;
        }
        else {
            yield (value: number) => value < max;
        }
    }
}

export class ToBeNumbersExtensions<T> {

    toBeNumber(this: ExpectationBuilder<T>, options: NumberExpectations = {}): ExpectationBuilder<T> {
        const validation = ValidationDelegate.create(() => getValidations(options));
        return this.must(validation);
    }

    toBeInt(this: ExpectationBuilder<T>, options: NumberExpectations = {}): ExpectationBuilder<T> {
        const validation = ValidationDelegate.create(function* () {
            yield* getValidations(options);

            yield (value: number) => Math.round(value) === value;
        });
        return this.must(validation);
    }
}
