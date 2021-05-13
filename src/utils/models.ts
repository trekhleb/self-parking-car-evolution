import { MODEL_BASE_PATH } from '../constants/models';

export const getModelPath = (modelFileName: string): string => {
  return `${MODEL_BASE_PATH}/${modelFileName}`;
};
