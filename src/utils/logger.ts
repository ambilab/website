export type LogLevel = 'debug' | 'info' | 'warning' | 'error';

export interface ILogger {
    debug: (message: string, meta?: Record<string, unknown>) => void;
    info: (message: string, meta?: Record<string, unknown>) => void;
    warn: (message: string, meta?: Record<string, unknown>) => void;
    error: (message: string, error?: unknown, meta?: Record<string, unknown>) => void;
}

export interface LoggerOptions {
    prefix?: string;
    minLevel?: LogLevel;
    enableDebug?: boolean;
    timestamp?: boolean;
}

class Logger implements ILogger {
    private readonly prefix: string;
    private readonly minLevel: LogLevel;
    private readonly enableDebug: boolean;
    private readonly timestamp: boolean;

    constructor(options: LoggerOptions = {}) {
        this.prefix = options.prefix ? `[${options.prefix}]` : '';
        this.minLevel = options.minLevel ?? 'info';
        this.enableDebug = options.enableDebug ?? false;
        this.timestamp = options.timestamp ?? false;
    }

    private shouldLog(level: LogLevel): boolean {
        const levels: LogLevel[] = ['error', 'warning', 'info', 'debug'];
        return levels.indexOf(level) <= levels.indexOf(this.minLevel);
    }

    private formatMessage(level: string, message: string): string {
        const parts: string[] = [];

        if (this.timestamp) {
            parts.push(new Date().toISOString());
        }

        if (this.prefix) {
            parts.push(this.prefix);
        }

        parts.push(`[${level.toUpperCase()}]`);
        parts.push(message);

        return parts.join(' ');
    }

    private logWithMeta(
        consoleMethod: (...args: unknown[]) => void,
        level: string,
        message: string,
        meta?: Record<string, unknown>,
    ): void {
        const formatted = this.formatMessage(level, message);

        if (meta && Object.keys(meta).length > 0) {
            consoleMethod(formatted, meta);
        } else {
            consoleMethod(formatted);
        }
    }

    public debug(message: string, meta?: Record<string, unknown>): void {
        if (this.enableDebug && this.shouldLog('debug')) {
            this.logWithMeta(console.debug, 'debug', message, meta);
        }
    }

    public info(message: string, meta?: Record<string, unknown>): void {
        if (this.shouldLog('info')) {
            this.logWithMeta(console.info, 'info', message, meta);
        }
    }

    public warn(message: string, meta?: Record<string, unknown>): void {
        if (this.shouldLog('warning')) {
            this.logWithMeta(console.warn, 'warn', message, meta);
        }
    }

    public error(message: string, error?: unknown, meta?: Record<string, unknown>): void {
        if (this.shouldLog('error')) {
            const formatted = this.formatMessage('error', message);

            if (error || (meta && Object.keys(meta).length > 0)) {
                console.error(formatted, error || '', meta || {});
            } else {
                console.error(formatted);
            }
        }
    }
}

/**
 * Create a logger instance with optional configuration.
 * Debug mode can be enabled via options or DEBUG environment variable.
 */
export const createLogger = (options: LoggerOptions = {}): ILogger => {
    const debugEnabled = options.enableDebug ?? (import.meta.env?.DEBUG === 'true' || import.meta.env?.DEV === true);

    return new Logger({
        ...options,
        enableDebug: debugEnabled,
    });
};
