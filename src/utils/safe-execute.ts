import { createLogger } from './logger';

const logger = createLogger({ prefix: 'SafeExecute' });

export const safeExecute = <T>(
  fn: () => T,
  fallback?: T,
  errorMessage?: string
): T | undefined => {
  try {
    return fn();
  } catch (error) {
    logger.error(errorMessage || 'Execution failed', error);
    return fallback;
  }
};

