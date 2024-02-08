import clsx from 'clsx';

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

export const cn = clsx;
