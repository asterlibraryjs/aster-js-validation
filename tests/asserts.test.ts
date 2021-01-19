import { assert } from "chai";
import { Validator } from "../src";
import { SucceedValidationResult } from "../src/validator/validation-result";

describe("Validator", () => {

    type MyModel = {
        readonly id: number,
        readonly name: string,
        readonly value: any;
    };

    const myModelValidator = Validator.create<MyModel>(expect => {
        expect("id").toBeNumber({ min: 0 }).orFail("id must be a number greater than 0");
        expect("name").toBeString({ minLength: 6, maxLength: 20 }).orFail("name must have more than 6 chars and less than 20");
        expect("value").toBeDefined().orFail("value must be defined");
    });

    it("Should successfully validate a model", async () => {
        const result = await myModelValidator.validate({ id: 2, name: "Bernard", value: null });
        assert.equal(result, SucceedValidationResult);
    });

    it("Should successfully validate a model using a callback", async () => {
        const callback = Validator.createCallback<MyModel>(expect => {
            expect("id").toBeOk().orFail("id must be Ok!");
            expect("id").toBeNumber({ min: 0 }).orFail("id must be a number greater than 0");
        });

        const result = await callback({ id: 2, name: "Bernard", value: null });
        assert.equal(result, SucceedValidationResult);
    });

    it("Should successfully validate a model using a self validation on conditional state", async () => {
        const callback = Validator.createCallback<MyModel>(expect => {
            expect().must(myModelValidator).when(t => t.value !== null);
        });

        const result = await callback({ id: 0, name: "", value: null });
        assert.equal(result, SucceedValidationResult);
    });

    it("Should fail to validate id", async () => {
        const result = await myModelValidator.validate({ id: 0, name: "Bernard", value: null });
        assert.deepEqual(result, {
            type: "failed", errors: {
                id: "id must be a number greater than 0"
            }
        });
    });

    it("Should fail to validate name length", async () => {
        const result = await myModelValidator.validate({ id: 22, name: "Berni", value: null });
        assert.deepEqual(result, {
            type: "failed", errors: {
                name: "name must have more than 6 chars and less than 20"
            }
        });
    });

    it("Should fail to validate id and name length", async () => {
        const result = await myModelValidator.validate({ id: 0, name: "Berni", value: null });
        assert.deepEqual(result, {
            type: "failed", errors: {
                id: "id must be a number greater than 0",
                name: "name must have more than 6 chars and less than 20"
            }
        });
    });

    it("Should fail validate a model using a self validation on conditional state", async () => {
        const callback = Validator.createCallback<MyModel>(expect => {
            expect().use(myModelValidator).when(t => t.value !== null);
        });

        const result = await callback({ id: 0, name: "", value: 1 });
        assert.deepEqual(result, {
            type: "failed", errors: {
                id: "id must be a number greater than 0",
                name: "name must have more than 6 chars and less than 20"
            }
        });
    });
});
