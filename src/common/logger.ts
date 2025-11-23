/* eslint-disable @typescript-eslint/no-explicit-any */
export interface LoggerInterface {
  info(message: string, ...meta: any[]): void;
  error(message: string, ...meta: any[]): void;
  warn(message: string, ...meta: any[]): void;
  debug(message: string, ...meta: any[]): void;
}
/* eslint-enable @typescript-eslint/no-explicit-any */
