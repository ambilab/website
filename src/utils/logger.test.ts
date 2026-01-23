import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createLogger } from './logger';

describe('Logger', () => {
    beforeEach(() => {
        vi.spyOn(console, 'debug').mockImplementation(() => {});
        vi.spyOn(console, 'info').mockImplementation(() => {});
        vi.spyOn(console, 'warn').mockImplementation(() => {});
        vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    it('should log info messages', () => {
        const logger = createLogger();
        logger.info('Test message');

        expect(console.info).toHaveBeenCalled();
        expect(console.info).toHaveBeenCalledWith(expect.stringContaining('Test message'));
    });

    it('should log warning messages', () => {
        const logger = createLogger();
        logger.warn('Warning message');

        expect(console.warn).toHaveBeenCalled();
        expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('Warning message'));
    });

    it('should log error messages', () => {
        const logger = createLogger();
        logger.error('Error message');

        expect(console.error).toHaveBeenCalled();
        expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Error message'));
    });

    it('should include prefix in messages', () => {
        const logger = createLogger({ prefix: 'TEST' });
        logger.info('Message');

        expect(console.info).toHaveBeenCalledWith(expect.stringContaining('[TEST]'));
        expect(console.info).toHaveBeenCalledWith(expect.stringContaining('Message'));
    });

    it('should respect minLevel setting', () => {
        const logger = createLogger({ minLevel: 'error' });

        logger.info('Info message');
        logger.warn('Warning message');
        logger.error('Error message');

        expect(console.info).not.toHaveBeenCalled();
        expect(console.warn).not.toHaveBeenCalled();
        expect(console.error).toHaveBeenCalled();
    });

    it('should log error with additional error object', () => {
        const logger = createLogger();
        const error = new Error('Test error');

        logger.error('Error occurred', error);

        expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Error occurred'), error, {});
    });

    it('should log debug messages when enabled', () => {
        const logger = createLogger({ enableDebug: true, minLevel: 'debug' });
        logger.debug('Debug message');

        expect(console.debug).toHaveBeenCalled();
        expect(console.debug).toHaveBeenCalledWith(expect.stringContaining('Debug message'));
    });

    it('should not log debug messages when disabled', () => {
        const logger = createLogger({ enableDebug: false });
        logger.debug('Debug message');

        expect(console.debug).not.toHaveBeenCalled();
    });

    it('should include metadata in logs', () => {
        const logger = createLogger();
        logger.info('Test message', { userId: 123, action: 'login' });

        expect(console.info).toHaveBeenCalledWith(
            expect.stringContaining('Test message'),
            expect.objectContaining({ userId: 123, action: 'login' }),
        );
    });

    it('should include timestamp when enabled', () => {
        const logger = createLogger({ timestamp: true });
        logger.info('Test message');

        expect(console.info).toHaveBeenCalledWith(expect.stringMatching(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/));
    });
});
