import { assert } from "chai";

describe("ServiceCollection", () => {

    it("Should be auto registered in service collection", () => {

        assert.equal(result, container.services);
    });
});