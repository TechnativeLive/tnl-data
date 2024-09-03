import clsx from 'clsx';

export function getByteSize(o: unknown): number {
  return Buffer.byteLength(JSON.stringify(o));
}

export function split<T>(arr: T[], size: number): T[][] {
  return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) => arr.slice(i * size, (i + 1) * size));
}

export function isObject(maybeObject: unknown): maybeObject is Record<string, unknown> {
  return typeof maybeObject === 'object' && maybeObject !== null && !Array.isArray(maybeObject);
}

export function throttleAndDebounce(fn: () => void, delay: number): () => void {
  let timeoutId: NodeJS.Timeout;
  let called = false;

  return () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    if (!called) {
      fn();
      called = true;
      setTimeout(() => (called = false), delay);
    } else {
      timeoutId = setTimeout(fn, delay);
    }
  };
}

export function toNumOrZero(maybeNum: unknown): number {
  const asNum = Number(maybeNum);
  return Number.isNaN(asNum) ? 0 : asNum;
}

export function toNumOrNull(maybeNum: unknown): number | null {
  const asNum = Number(maybeNum);
  return Number.isNaN(asNum) ? null : asNum;
}
export function toNumOr<F>(maybeNum: unknown, fallback: F): number | F {
  if (maybeNum === null) return fallback;
  const asNum = Number(maybeNum);
  return Number.isNaN(asNum) ? fallback : asNum;
}

export const cn = clsx;

export function append<T>(value: T, obj: Record<string, T[]>, key: string) {
  Array.isArray(obj[key]) ? obj[key]!.push(value) : (obj[key] = [value]);
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export type SafeData<D = unknown> =
  | { data: D; error: undefined }
  | { data: undefined; error: SafeError };
export type SafeError = { code: number | string; message: string };
export function safeError(err: SafeError) {
  return { data: undefined, error: { code: err.code, message: err.message } };
}
