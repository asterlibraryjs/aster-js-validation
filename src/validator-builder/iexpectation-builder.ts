import { IValidator } from "../validator/ivalidator";
import { IExpectation } from "../expectation/iexpectation";
import { ValidationDelegate } from "../expectation/validation-delegate";

export interface IExpectationBuilder<T> {

    readonly and: this;

    use(validation: IValidator<any>): this;

    must(validation: ValidationDelegate): this;

    when(condition: (target: T) => boolean): this;

    orFail(message: string): this;

    build(): IExpectation<T>;
}
