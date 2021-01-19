import { ValidationResult } from "./validation-result";

export interface IValidator<T> {

    validate(target: T): Promise<ValidationResult>;

    groupWith(validator: IValidator<T>): IValidator<T>;

    asIterableValidator(): IIterableValidator<T>;
}

export interface IIterableValidator<T> extends IValidator<Iterable<T>> { }
