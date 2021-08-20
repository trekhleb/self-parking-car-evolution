import { loggerBuilder } from './logger';

export const write = (key: string, data: any): boolean => {
  const logger = loggerBuilder({context: 'storage-write'});
  try {
    const stringifiedData = JSON.stringify(data);
    localStorage.setItem(key, stringifiedData);
  } catch (error) {
    logger.error('Cannot write data to storage', error);
    return false;
  }
  return true;
};

export const read = (key: string): any | null => {
  const logger = loggerBuilder({context: 'storage-read'});
  try {
    const stringifiedData: string | null = localStorage.getItem(key);
    if (!stringifiedData) {
      return stringifiedData;
    }
    return JSON.parse(stringifiedData);
  } catch (error) {
    logger.error('Cannot read data to storage', error);
    return null;
  }
};
