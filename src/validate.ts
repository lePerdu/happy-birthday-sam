/**
 * Simple schema validation system.
 * @module
 */

export type Validator<T> = (data: unknown) => data is T;

export type StringValidatorConfig = {
  minLength?: number;
  maxLength?: number;
};

export function string(config: StringValidatorConfig = {}): Validator<string> {
  return (s): s is string =>
    typeof s === "string" &&
    (config.minLength === undefined || s.length >= config.minLength) &&
    (config.maxLength === undefined || s.length <= config.maxLength);
}

export type NumberValidatorConfig = {
  integer?: boolean;
};

export function number(config: NumberValidatorConfig = {}): Validator<number> {
  return (n): n is number =>
    typeof n === "number" && (!config.integer || n === Math.floor(n));
}

export function array<T>(itemValidator: Validator<T>): Validator<T[]> {
  return (a): a is T[] => Array.isArray(a) && a.every(itemValidator);
}

export type ShapeValidator<T extends Record<string, unknown>> = {
  [K in keyof T]: Validator<T[K]>;
};

export function object<T extends Record<string, unknown>>(
  shape: ShapeValidator<T>
): Validator<T> {
  return (o): o is T =>
    Object.entries(shape).every(([key, validator]) => validator(o[key]));
}

export function oneOf<E>(items: readonly E[]): Validator<E> {
  return (e): e is E => items.includes(e as E);
}
