// Bound any host-bridge or chain-RPC call by a wall-clock deadline.
//
// Several upstream calls — requestResourceAllocation, getProductAccount,
// requestPermission, ReviveApi.call, signSubmitAndWatch — can hang indefinitely
// when the host bridge is wedged or the chain node is unresponsive. Wrapping
// them here turns a hang into a typed DeadlineError the caller can retry,
// surface as an error, or fall through to a best-effort path.

export class DeadlineError extends Error {
  readonly kind = 'DeadlineError' as const;
  constructor(
    /** Human label of what was being waited on, for logs. */
    public readonly label: string,
    /** Milliseconds waited before giving up. */
    public readonly elapsedMs: number,
  ) {
    super(`${label} timed out after ${elapsedMs}ms`);
    this.name = 'DeadlineError';
  }
}

export function isDeadlineError(err: unknown): err is DeadlineError {
  return err instanceof DeadlineError;
}

/** Standard deadlines, exported so call sites stay consistent. */
export const DEADLINE = {
  /** Quick chain read (System.Account balance, ReviveApi dry-run, ...). */
  read: 45_000,
  /** Submit + best-block inclusion via signSubmitAndWatch. */
  submit: 60_000,
  /** User-gated sign action — mobile wallet round-trip plus the user finding the app. */
  sign: 90_000,
  /** Host-bridge permission / allowance dialog. */
  hostDialog: 90_000,
} as const;

/**
 * Run a promise-returning operation with a wall-clock deadline.
 * Throws DeadlineError if it has not settled by `ms`.
 *
 * The underlying work continues in the background after the deadline fires —
 * there is no way to cancel a pending host-bridge call. Callers needing real
 * cancellation must wire an AbortController into the work itself.
 */
export async function withDeadline<T>(
  work: Promise<T> | (() => Promise<T>),
  ms: number,
  label: string,
): Promise<T> {
  const start = Date.now();
  const promise = typeof work === 'function' ? work() : work;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const deadline = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new DeadlineError(label, Date.now() - start)), ms);
  });
  try {
    return await Promise.race([promise, deadline]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}
