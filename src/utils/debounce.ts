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
