export const WORLD_SEARCH_PARAM = 'parking';

export const WORLD_TAB_INDEX_TO_NAME_MAP: Record<string, string> = {
  '0': 'evolution',
  '1': 'manual',
};

export const WORLD_NAME_TO_TAB_INDEX_MAP: Record<string, string> = Object.keys(WORLD_TAB_INDEX_TO_NAME_MAP)
  .reduce((map: Record<string, string>, key: string) => {
    map[WORLD_TAB_INDEX_TO_NAME_MAP[key]] = key;
    return map;
  }, {});
