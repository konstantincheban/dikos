import { SortOrder } from "mongoose";

const SUPPORTED_OPERATORS = ['eq', 'contains', 'lt', 'gt'] as const;

export const buildFilterExpressions = (filter: string) => {
  const getValueBySeparator = (item: string, separator: typeof SUPPORTED_OPERATORS[number]) => {
    let [key, value] = item.split(separator);
    key = key?.trim() ?? '';
    value = value?.replace(/'|"|\s/g, '') ?? '';

    return [key, value];
  };
  return filter
    .replace(/\(|\)/g, '')
    .split('and')
    .reduce((acc, item) => {
      if (item.includes('eq')) {
        const [key, value] = getValueBySeparator(item, 'eq');
        acc.push({ [key]: value });
      }
      if (item.includes('contains')) {
        const [key, value] = getValueBySeparator(item, 'contains');
        acc.push({ [key]: { $regex: new RegExp(value, 'g') } });
      }
      if (item.includes('lt')) {
        const [key, value] = getValueBySeparator(item, 'lt');
        acc.push({ [key]: { $lt: value } });
      }
      if (item.includes('gt')) {
        const [key, value] = getValueBySeparator(item, 'gt');
        acc.push({ [key]: { $gt: value } });
      }
      // placeholder for the $and operation in case of missing parameters
      if (!item) acc.push({ '': '' });
      return acc;
    }, []);
};

export const buildSortByOrderBy = (orderBy: string) => {
  const [field, criteria] = orderBy.split(' ');
  if (field && criteria) return { [field]: criteria as SortOrder };
  return { created_at: 'desc' as SortOrder };
};

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
