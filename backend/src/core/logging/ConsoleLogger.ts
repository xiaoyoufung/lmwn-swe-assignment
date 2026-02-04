import type { ILogger } from "../../core/logging/ILogger.js";
import type { LogContext } from "../../core/logging/LogContext.js";

export class ConsoleLogger implements ILogger {
  child(bindings: Partial<LogContext>): ILogger {
    // simplest: ignore child context or merge it if you want
    return this;
  }

  debug(message: string, meta?: Partial<LogContext>) {
    console.debug(message, meta ?? {});
  }
  info(message: string, meta?: Partial<LogContext>) {
    console.info(message, meta ?? {});
  }
  warn(message: string, meta?: Partial<LogContext>) {
    console.warn(message, meta ?? {});
  }
  error(message: string, meta?: Partial<LogContext>) {
    console.error(message, meta ?? {});
  }
}
