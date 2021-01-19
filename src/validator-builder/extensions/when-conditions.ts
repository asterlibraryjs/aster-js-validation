import { ExpectationBuilder } from "../expectation-builder";

export class WhenConditionExtensions<T> {

    whenDefined(this: ExpectationBuilder<T>): ExpectationBuilder<T> {
        return this.when((target: T) => typeof this.valueAccessor.getValue(target) !== "undefined");
    }

    whenNotNull(this: ExpectationBuilder<T>): ExpectationBuilder<T> {
        return this.when((target: T) => this.valueAccessor.getValue(target) !== null);
    }

    whenNotNullOrUndefined(this: ExpectationBuilder<T>): ExpectationBuilder<T> {
        return this.when((target: T) => {
            const value = this.valueAccessor.getValue(target);
            return value !== null && value !== "undefined";
        });
    }

    whenOk(this: ExpectationBuilder<T>): ExpectationBuilder<T> {
        return this.when((target: T) => Boolean(this.valueAccessor.getValue(target)));
    }
}
