/**
 * Creates a debounced version of the provided function.
 *
 * The debounced function delays the execution of the original function until
 * after the specified wait time has passed since the last invocation.
 *
 * It also includes a `cancel` method to cancel any delayed executions.
 *
 * @template T - A function type that specifies the signature of the function being debounced.
 * @param {T} func - The original function to debounce.
 * @param {number} wait - The number of milliseconds to wait before invoking the function
 *                        after the last call to the debounced function.
 * @returns {{ (...args: Parameters<T>): void; cancel(): void; }} - A debounced function that
 *          also provides a `cancel` method to clear any pending executions.
 */
export const debounce = <T extends (...args: unknown[]) => unknown>(
    func: T,
    wait: number,
): {
    (...args: Parameters<T>): void;
    cancel(): void;
} => {
    let timeout: ReturnType<typeof setTimeout> | null = null;

    const wrapped = (...args: Parameters<T>) => {
        if (timeout) {
            clearTimeout(timeout);
        }

        timeout = setTimeout(() => {
            func(...args);
            timeout = null;
        }, wait);
    };

    wrapped.cancel = () => {
        if (timeout) {
            clearTimeout(timeout);
        }

        timeout = null;
    };

    return wrapped;
};
