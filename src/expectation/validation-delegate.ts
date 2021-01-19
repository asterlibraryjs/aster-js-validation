import { Iterables } from "@aster-js/iterators";

export type ValidationDelegate = (value: any) => boolean | Promise<boolean>;

export namespace ValidationDelegate {
    export function create(factory: () => Iterable<ValidationDelegate>): ValidationDelegate {
        const validator = factory();

        if (Iterables.cast(validator)) {
            const validators = [...validator]
            switch (validators.length) {
                case 0:
                    return () => true;
                case 1:
                    return validators[0];
                default:
                    return (value: any) => {
                        for (const validator of validators) {
                            if (!validator(value)) return false;
                        }
                        return true;
                    }
            }
        }
        return validator;
    }
}