type LogContext = Record<string, unknown>;

function format(level: string, message: string, ctx?: LogContext): string {
  const base = { ts: new Date().toISOString(), level, message };
  return JSON.stringify(ctx ? { ...base, ...ctx } : base);
}

export const logger = {
  info(message: string, ctx?: LogContext) {
    console.log(format('info', message, ctx));
  },
  warn(message: string, ctx?: LogContext) {
    console.warn(format('warn', message, ctx));
  },
  error(message: string, ctx?: LogContext) {
    console.error(format('error', message, ctx));
  },
};
