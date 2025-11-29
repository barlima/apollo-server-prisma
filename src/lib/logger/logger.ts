import { ILogger } from "./types";

export class Logger implements ILogger {
  error(error: Error, ...args: unknown[]): void {
    // Log the error to an external service
    // Simple console.error for now
    console.error(error, ...args);
  }
}

export const createLogger = (): ILogger => {
  return new Logger();
};
