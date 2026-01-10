export type LogLevel = 'info' | 'warning' | 'error';

/**
 * Represents a logger for handling various levels of log messages.
 *
 * Provides methods to log informational messages, warnings, and errors.
 */
export interface ILogger {
    /**
     * Logs an informational message.
     *
     * @param {string} message - The informational message to be logged.
     */
    info: (message: string) => void;

    /**
     * Logs a warning message.
     *
     * @param {string} message - The warning message to log.
     */
    warn: (message: string) => void;

    /**
     * Logs an error message with an optional error object.
     *
     * @param {string} message - A descriptive error message.
     * @param {unknown} [error] - An optional error object containing additional information about the error.
     */
    error: (message: string, error?: unknown) => void;
}

/**
 * Represents configuration options for a logger.
 */
export interface LoggerOptions {
    /**
     * Optional string prefix for all log messages.
     */
    prefix?: string;

    /**
     * The minimum log level to be displayed.
     *
     * Only messages with a level equal to or higher than this will be logged.
     */
    minLevel?: LogLevel;
}

/**
 * A Logger class that implements the ILogger
 * interface and provides logging functionality
 * with configurable log levels and optional message prefixes.
 */
class Logger implements ILogger {
    private readonly prefix: string;
    private readonly minLevel: LogLevel;

    /**
     * Initializes a new instance of the Logger
     * class with the specified options.
     *
     * @param {LoggerOptions} [options={}] - Configuration options for the Logger.
     * @param {string} [options.prefix] - A string to be used as a prefix for all log messages.
     * @param {string} [options.minLevel='info'] - The minimum logging level for messages to be logged.
     * @return {Logger} A new Logger instance configured with the provided options.
     */
    constructor(options: LoggerOptions = {}) {
        this.prefix = options.prefix ? `[${options.prefix}]` : '';
        this.minLevel = options.minLevel ?? 'info';
    }

    private shouldLog(level: LogLevel): boolean {
        const levels: LogLevel[] = ['error', 'warning', 'info'];
        return levels.indexOf(level) <= levels.indexOf(this.minLevel);
    }

    /**
     * Logs an informational message.
     *
     * @param {string} message - The message to be logged.
     */
    public info(message: string): void {
        if (this.shouldLog('info')) {
            console.info(this.prefix ? `${this.prefix} ${message}` : message);
        }
    }

    /**
     * Logs a warning message.
     *
     * @param {string} message - The message to be logged.
     */
    public warn(message: string): void {
        if (this.shouldLog('warning')) {
            console.warn(this.prefix ? `${this.prefix} ${message}` : message);
        }
    }

    /**
     * Logs an error message with an optional error object.
     *
     * @param {string} message - The message to be logged.
     * @param {unknown} [error] - The error object to be logged along with the message.
     */
    public error(message: string, error?: unknown): void {
        console.error(this.prefix ? `${this.prefix} ${message}` : message, error || '');
    }
}

/**
 * Creates a new logger instance with the specified configuration options.
 *
 * @param {LoggerOptions} [options={}] - Configuration options for the logger.
 * @returns {ILogger} A logger instance configured according to the provided options.
 */
export const createLogger = (options: LoggerOptions = {}): ILogger => new Logger(options);
