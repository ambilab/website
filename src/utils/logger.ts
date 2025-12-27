export type LogLevel = 'info' | 'warning' | 'error';

export interface ILogger {
    info: (message: string) => void;
    warn: (message: string) => void;
    error: (message: string, error?: unknown) => void;
}

export interface LoggerOptions {
    prefix?: string;
    minLevel?: LogLevel;
}

class Logger implements ILogger {
    private readonly prefix: string;
    private readonly minLevel: LogLevel;

    constructor(options: LoggerOptions = {}) {
        this.prefix = options.prefix ? `[${options.prefix}]` : '';
        this.minLevel = options.minLevel ?? 'info';
    }

    private shouldLog(level: LogLevel): boolean {
        const levels: LogLevel[] = ['error', 'warning', 'info'];
        return levels.indexOf(level) <= levels.indexOf(this.minLevel);
    }

    public info(message: string): void {
        if (this.shouldLog('info')) {
            console.info(this.prefix ? `${this.prefix} ${message}` : message);
        }
    }

    public warn(message: string): void {
        if (this.shouldLog('warning')) {
            console.warn(this.prefix ? `${this.prefix} ${message}` : message);
        }
    }

    public error(message: string, error?: unknown): void {
        console.error(this.prefix ? `${this.prefix} ${message}` : message, error || '');
    }
}

export const createLogger = (options: LoggerOptions = {}): ILogger => new Logger(options);
