export const getSearchParam = (name: string): string | null => {
  const searchParams = getSearchParams();
  return searchParams.get(name);
};

export const setSearchParam = (name: string, value: string): void => {
  const searchParams = getSearchParams();
  searchParams.set(name, value);
  const relativeURL = '?' + searchParams.toString() + document.location.hash;
  window.history.pushState(null, '', relativeURL);
};

export const deleteSearchParam = (name: string): void => {
  const searchParams = getSearchParams();
  searchParams.delete(name);
  const relativeURL = '?' + searchParams.toString() + document.location.hash;
  window.history.pushState(null, '', relativeURL);
};

const getSearchParams = (): URLSearchParams => {
  const searchQuery = document.location.search.substring(1);
  return new URLSearchParams(searchQuery);
};

export const getStringSearchParam = (name: string, defaultValue: string): string => {
  const searchParam: string | null = getSearchParam(name);
  if (searchParam === null) {
    return defaultValue;
  }
  return searchParam;
};

export const getIntSearchParam = (name: string, defaultValue: number): number => {
  const searchParam: string | null = getSearchParam(name);
  if (searchParam === null) {
    return defaultValue;
  }
  return parseInt(searchParam);
};

export const getFloatSearchParam = (name: string, defaultValue: number): number => {
  const searchParam: string | null = getSearchParam(name);
  if (searchParam === null) {
    return defaultValue;
  }
  return parseFloat(searchParam);
};

export const getBooleanSearchParam = (name: string, defaultValue: boolean): boolean => {
  const searchParam: string | null = getSearchParam(name);
  if (searchParam === null) {
    return defaultValue;
  }
  return searchParam.toLowerCase() === 'true' ? true : false;
};
