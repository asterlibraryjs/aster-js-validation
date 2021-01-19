
export type ValidationResult = SucceedValidationResult | FailedValidationResult;

export interface IValidationResult {
    readonly target: any;
}

export type SucceedValidationResult = typeof SucceedValidationResult;

export const SucceedValidationResult = {
    type: "succeed"
} as const;

export type FailedValidationResult = {
    readonly type: "failed";
    readonly errors: Record<string, string>;
}

export function FailedValidationResult(errors: Iterable<readonly [string, string]>): FailedValidationResult {
    return {
        type: "failed",
        errors: Object.fromEntries(errors)
    };
}
