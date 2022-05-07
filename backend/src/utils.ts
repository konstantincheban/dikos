export const buildFilterExpressions = (filter: string) =>
  filter.split('and').reduce((acc, item) => {
    let [key, value] = item.split('eq');
    key = key?.trim() ?? '';
    value = value?.replace(/'|"|\s/g, '') ?? '';
    acc.push({ [key]: value });
    return acc;
  }, []);
