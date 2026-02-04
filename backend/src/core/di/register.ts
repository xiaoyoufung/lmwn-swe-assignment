import "reflect-metadata";
import { container } from "tsyringe";

import { TOKENS } from "./tokens.js";
import type { ILogger } from "../logging/ILogger.js";
import { ConsoleLogger } from "../logging/ConsoleLogger.js";

container.registerSingleton<ILogger>(TOKENS.Logger, ConsoleLogger);
