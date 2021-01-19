import { Constructor } from "@aster-js/core";
import { ExpectationBuilder } from "../expectation-builder";
import { ToBeArrayExtensions } from "./to-be-array";
import { ToBeBasicsExtensions } from "./to-be-basics";
import { ToBeNumbersExtensions } from "./to-be-numbers";
import { ToBeStringExtensions } from "./to-be-strings";
import { WhenConditionExtensions } from "./when-conditions";

declare module "../expectation-builder" {
    interface ExpectationBuilder<T>
        extends WhenConditionExtensions<T>, ToBeBasicsExtensions<T>, ToBeStringExtensions<T>, ToBeArrayExtensions<T>, ToBeNumbersExtensions<T> {
    }
}

apply(WhenConditionExtensions, ToBeBasicsExtensions, ToBeStringExtensions, ToBeArrayExtensions, ToBeNumbersExtensions);

function apply(...extensions: Constructor[]): void {
    for (const extension of extensions) {
        const { constructor, ...rest } = Object.getOwnPropertyDescriptors(extension.prototype)
        Object.defineProperties(ExpectationBuilder.prototype, rest);
    }
}