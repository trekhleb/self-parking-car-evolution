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

const getSearchParams = (): URLSearchParams => {
  const searchQuery = document.location.search.substring(1);
  return new URLSearchParams(searchQuery);
};
