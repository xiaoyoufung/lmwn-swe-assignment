// src/core/logging/logger.ts
import { container } from "tsyringe";
import type { ILogger } from "./ILogger.js";
import { TOKENS } from "../di/tokens.js";

export function getLogger(): ILogger {
  return container.resolve<ILogger>(TOKENS.Logger);
}
