
export interface IValidationGetter<T, V> {
    readonly path: string;
    getValue(target: T): V;
}

export class ValidationPropertyGetter<T, K extends keyof T & string> implements IValidationGetter<T, T[K]> {
    private readonly _valueAccessor: (target: T) => T[K];

    constructor(
        readonly path: K
    ) {
        this._valueAccessor = (target: T) => target[path];
    }

    getValue(target: T): T[K] {
        return this._valueAccessor(target);
    }
}
