export interface ILogger {
  error(error: Error, ...args: unknown[]): void;
}
