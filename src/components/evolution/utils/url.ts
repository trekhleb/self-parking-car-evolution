import { getSearchParam } from '../../../utils/url';
import { WORLD_NAME_TO_TAB_INDEX_MAP, WORLD_SEARCH_PARAM } from '../constants/url';

export const getWorldKeyFromUrl = (defaultWorldKey: string): string => {
  const worldKeySearchParam = getSearchParam(WORLD_SEARCH_PARAM);
  if (!worldKeySearchParam) {
    return defaultWorldKey;
  }
  const worldKey = WORLD_NAME_TO_TAB_INDEX_MAP[worldKeySearchParam];
  if (!worldKey) {
    return defaultWorldKey;
  }
  return worldKey;
};
