import { assert } from "chai";
import { Validate, Validator } from "../src";

describe("Validator", () => {

type MyModel = {
    readonly id: number,
    readonly name: string,
    readonly value: any;
};

const myModelValidator = Validator.create<MyModel>(builder => {
    builder.for("id").must(Validate.toBeNumber, { min: 0 }).withMessage("id must be a number greater than 0");
    builder.for("name").must(Validate.toBeString, { minLength: 5, maxLength: 20 }).withMessage("name must have more than 5 chars and less than 20");
    builder.for("id").must(Validate.toBeDefined).withMessage("value must be defined");
});

    it("Should be auto registered in service collection", () => {

        //assert.equal(result, container.services);
    });
});