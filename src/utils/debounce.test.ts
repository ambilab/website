import { beforeEach, describe, expect, it, vi } from 'vitest';

import { debounce } from './debounce';

describe('debounce', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    it('should debounce function calls', () => {
        const func = vi.fn();
        const debouncedFunc = debounce(func, 100);

        debouncedFunc();
        debouncedFunc();
        debouncedFunc();

        expect(func).not.toHaveBeenCalled();

        vi.advanceTimersByTime(100);

        expect(func).toHaveBeenCalledTimes(1);
    });

    it('should pass arguments correctly', () => {
        const func = vi.fn();
        const debouncedFunc = debounce(func, 100);

        debouncedFunc('test', 123);

        vi.advanceTimersByTime(100);

        expect(func).toHaveBeenCalledWith('test', 123);
    });

    it('should cancel pending execution', () => {
        const func = vi.fn();
        const debouncedFunc = debounce(func, 100);

        debouncedFunc();
        debouncedFunc.cancel();

        vi.advanceTimersByTime(100);

        expect(func).not.toHaveBeenCalled();
    });

    it('should only execute the last call within the wait period', () => {
        const func = vi.fn();
        const debouncedFunc = debounce(func, 100);

        debouncedFunc('first');
        vi.advanceTimersByTime(50);

        debouncedFunc('second');
        vi.advanceTimersByTime(50);

        debouncedFunc('third');
        vi.advanceTimersByTime(100);

        expect(func).toHaveBeenCalledTimes(1);
        expect(func).toHaveBeenCalledWith('third');
    });
});
