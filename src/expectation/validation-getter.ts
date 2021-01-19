
export interface IValidationGetter<T = any> {
    readonly path: string;
    getValue(target: T): any;
}

export namespace IValidationGetter {

    export const self: IValidationGetter = {
        path: ".",
        getValue: val => val
    };
}

export class ValidationPropertyGetter<T, K extends keyof T & string> implements IValidationGetter<T> {
    private readonly _valueAccessor: (target: T) => any;

    constructor(
        readonly path: K
    ) {
        this._valueAccessor = (target: T) => target[path];
    }

    getValue(target: T): T[K] {
        return this._valueAccessor(target);
    }
}
