import pino from "pino";

const isDevelopment = process.env["NODE_ENV"] !== "production";
const isNextRuntime = process.env["NEXT_RUNTIME"] !== undefined;
const logLevel = process.env["LOG_LEVEL"] ?? "info";
const serviceName = process.env["APP_NAME"] ?? "ai-opti-nextjs-starter";

/**
 * Base Pino logger configuration.
 *
 * - JSON output in production for machine parsing
 * - Pretty output in development for readability (outside Next.js only)
 * - Base fields: service, environment
 *
 * Pino's worker transport symlinks break Turbopack on Windows, so Next.js uses JSON logs.
 */
export const logger = pino({
  level: logLevel,
  base: {
    service: serviceName,
    environment: process.env["NODE_ENV"] ?? "development",
  },
  ...(isDevelopment && !isNextRuntime
    ? {
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "HH:MM:ss",
            ignore: "pid,hostname",
          },
        },
      }
    : {}),
});

export type Logger = typeof logger;
