export interface ILogger {
  error(error: unknown, ...args: unknown[]): void;
}
