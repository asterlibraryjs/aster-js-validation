
export interface IValidationGetter<T> {
    readonly path: string;
    getValue(target: T): any;
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
