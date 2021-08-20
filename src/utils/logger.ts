import { getSearchParam } from './url';

const LOG_SEARCH_PARAM_NAME = 'debug';

const logToConsole = !!getSearchParam(LOG_SEARCH_PARAM_NAME);

type LoggerParams = {
  context: string,
};

type LoggerCallback = (...params: any[]) => void;

type Logger = {
  info: LoggerCallback,
  warn: LoggerCallback,
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

  const warn: LoggerCallback = (message, ...optionalParams) => {
    if (!logToConsole) {
      return;
    }
    console.info(
      `%c${context}`,
      'background: red; color: white; padding: 0 3px; border-radius: 3px;',
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

  return { info, warn, error };
};
