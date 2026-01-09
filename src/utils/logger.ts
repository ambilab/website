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
     * This function is used to display informative messages that provide
     * context or status updates within the application.
     *
     * It accepts a single string parameter representing the informational
     * message to be logged.
     *
     * @param {string} message - The informational message to be logged.
     */
    info: (message: string) => void;

    /**
     * Logs a warning message.
     *
     * This function is used to display warning messages that notify the
     * user of potential issues or non-critical errors within the application.
     *
     * It accepts a single string parameter representing
     * the warning message to be logged.
     *
     * @param {string} message - The warning message to log.
     */
    warn: (message: string) => void;

    /**
     * Logs an error message with an optional
     * error object for additional details.
     *
     * This function is used to display error messages that
     * indicate critical issues or failures within the application.
     *
     * It accepts a string parameter for the error message
     * and an optional error object for additional details.
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
     * An optional string used as a prefix.
     *
     * This can be used to prepend a specific set of characters or a word to
     * another value, typically for identification or formatting purposes.
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
     * Logs an informational message to the console
     * if the logging level is set to "info".
     *
     * @param {string} message - The message to be logged.
     * @return {void} This method does not return any value.
     */
    public info(message: string): void {
        if (this.shouldLog('info')) {
            console.info(this.prefix ? `${this.prefix} ${message}` : message);
        }
    }

    /**
     * Logs a warning message to the console
     * if the logging level is set to "warning".
     *
     * @param {string} message - The message to be logged.
     * @return {void} This method does not return any value.
     */
    public warn(message: string): void {
        if (this.shouldLog('warning')) {
            console.warn(this.prefix ? `${this.prefix} ${message}` : message);
        }
    }

    /**
     * Logs an error message to the console
     * if the logging level is set to "error".
     *
     * @param {string} message - The message to be logged.
     * @param {unknown} [error] - The error object to be logged along with the message.
     * @return {void} This method does not return any value.
     */
    public error(message: string, error?: unknown): void {
        console.error(this.prefix ? `${this.prefix} ${message}` : message, error || '');
    }
}

/**
 * Creates a new logger instance with the specified configuration options.
 *
 * @param {LoggerOptions} [options={}] - Configuration options for the logger. This includes properties such as log
 *                                       level, log format, and other settings for customizing the logger behavior.
 * @returns {ILogger} A logger instance configured according to the provided options.
 */
export const createLogger = (options: LoggerOptions = {}): ILogger => new Logger(options);
