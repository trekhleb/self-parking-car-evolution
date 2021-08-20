import { loggerBuilder } from './logger';

export const write = (key: string, data: any): boolean => {
  const logger = loggerBuilder({context: 'storage::write'});
  try {
    const stringifiedData = JSON.stringify(data);
    localStorage.setItem(key, stringifiedData);
    logger.info(`Wrote data with the key "${key}" to storage successfully`);
  } catch (error) {
    logger.error('Cannot write data to storage', error);
    return false;
  }
  return true;
};

export const read = (key: string): any | null => {
  const logger = loggerBuilder({context: 'storage::read'});
  try {
    const stringifiedData: string | null = localStorage.getItem(key);
    logger.info(`Read data with the key "${key}" from storage successfully`);
    if (!stringifiedData) {
      return stringifiedData;
    }
    return JSON.parse(stringifiedData);
  } catch (error) {
    logger.error('Cannot read data to storage', error);
    return null;
  }
};

export const remove = (key: string): void => {
  const logger = loggerBuilder({context: 'storage::remove'});
  localStorage.removeItem(key);
  logger.info(`Removed data with the key "${key}" from storage`);
};
