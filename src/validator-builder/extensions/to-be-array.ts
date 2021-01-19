import { ValidationDelegate } from "../../expectation/validation-delegate";
import { ExpectationBuilder } from "../expectation-builder";

export class ToBeArrayExtensions<T> {

    toBeAnArray(this: ExpectationBuilder<T>, { minSize, maxSize }: { minSize?: number, maxSize?: number } = {}): ExpectationBuilder<T> {
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

    toBeAnItemsOf(this: ExpectationBuilder<T>, items: any[]): ExpectationBuilder<T> {
        const validation = ValidationDelegate.create(function* () {
            yield (value: unknown) => Array.isArray(value);
            yield (value: any[]) => value.every(item => items.includes(item));
        });
        return this.must(validation);
    }

    toNotBeAnItemsOf(this: ExpectationBuilder<T>, items: any[]): ExpectationBuilder<T> {
        const validation = ValidationDelegate.create(function* () {
            yield (value: unknown) => Array.isArray(value);
            yield (value: any[]) => value.every(item => !items.includes(item));
        });
        return this.must(validation);
    }
}
