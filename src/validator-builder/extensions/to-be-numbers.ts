import { ValidationDelegate } from "../../expectation/validation-delegate";
import { ExpectationBuilder } from "../expectation-builder";

export class ToBeNumbersExtensions<T> {

    toBeNumber(this: ExpectationBuilder<T>, { min, max }: { min?: number, max?: number } = {}): ExpectationBuilder<T> {
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
}
