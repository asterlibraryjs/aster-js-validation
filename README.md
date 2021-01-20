# @aster-js/validation ![Node.js Package](https://github.com/asterlibraryjs/aster-js-validation/workflows/Node.js%20Package/badge.svg)

Fluent validation library inspired by the fluent validation library from .NET.

## Usage

We will take the following model as a sample:

```ts
type MyModel = {
    readonly id: number,
    readonly name: string,
    readonly value: any;
};

```

### Validator declaration

```ts
import { Validator, Validate } from "@aster-js/validation";

const myModelValidator = Validator.create<MyModel>(expect => {

    expect("id").toBeNumber({ min: 0 }).orFail("id must be a number greater than 0");

    expect("name").toBeString({ minLength: 5, maxLength: 20 }).orFail("name must have more than 5 chars and less than 20");

    expect("value").toBeDefined().orFail("value must be defined");

});
```

### Validator usage

```ts
const model = { id: 0, name: "Joe", value: null };
const validationResult = myModelValidator.validate(model);

if(validationResult.type === "failed") {
    console.debug(validationResult.errors);
}
```
