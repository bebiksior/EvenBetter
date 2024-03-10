import { CURRENT_VERSION, DEBUG_MODE } from "../settings/constants";

export enum LogLevel {
  INFO = "info",
  ERROR = "error",
  WARN = "warn",
  DEBUG = "debug",
}

export class Logger {
  log(level: LogLevel, message: string) {
    const date = new Date();
    const prefix = `${date.toString()} [EvenBetter ${CURRENT_VERSION}]`;

    switch (level) {
      case LogLevel.INFO:
        console.log(`${prefix} [INFO] ${message}`);
        break;
      case LogLevel.ERROR:
        console.error(`${prefix} [ERROR] ${message}`);
        break;
      case LogLevel.WARN:
        console.warn(`${prefix} [WARN] ${message}`);
        break;
      case LogLevel.DEBUG:
        if (DEBUG_MODE) console.log(`${prefix} [DEBUG] ${message}`);
        break;
      default:
        console.log(`${prefix} [UNKNOWN] ${message}`);
    }
  }

  info(message: string) {
    this.log(LogLevel.INFO, message);
  }

  error(message: string) {
    this.log(LogLevel.ERROR, message);
  }

  warn(message: string) {
    this.log(LogLevel.WARN, message);
  }

  debug(message: string) {
    this.log(LogLevel.DEBUG, message);
  }
}

const log = new Logger();
export default log;
