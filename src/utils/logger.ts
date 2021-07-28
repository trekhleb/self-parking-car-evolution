const logToConsole = true;

type LoggerParams = {
  context: string,
};

type LoggerCallback = (...params: any[]) => void;

type Logger = {
  info: LoggerCallback,
  error: LoggerCallback,
};

export const loggerBuilder = (params: LoggerParams): Logger => {
  const { context } = params;

  const info: LoggerCallback = (message, ...optionalParams) => {
    if (!logToConsole) {
      return;
    }
    console.log(
      `%c${context}`,
      'background: orange; color: white; padding: 0 3px; border-radius: 3px;',
      '→',
      message,
      ...optionalParams
    );
  };

  const error: LoggerCallback = (message, ...optionalParams) => {
    if (!logToConsole) {
      return;
    }
    console.error(context, message, ...optionalParams);
  };

  return { info, error };
};
