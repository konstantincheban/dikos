export const buildFilterExpressions = (filter: string) =>
  filter.split('and').reduce((acc, item) => {
    let [key, value] = item.split('eq');
    key = key?.trim() ?? '';
    value = value?.replace(/'|"|\s/g, '') ?? '';
    acc.push({ [key]: value });
    return acc;
  }, []);

export const immutableObjectFiltering = <T>(
  object: unknown,
  extraKeys = [],
): T => {
  return Object.keys(object)
    .filter((key) => !extraKeys.includes(key))
    .reduce((obj, key) => {
      obj[key] = object[key];
      return obj;
    }, {} as T);
};
