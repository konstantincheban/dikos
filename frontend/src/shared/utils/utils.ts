import { KeyValueType } from '@shared/interfaces';
import moment from 'moment';

type ClassMapObjectType = {
  [key: string]: boolean;
};
export const classMap = (obj: ClassMapObjectType, baseClass = ''): string => {
  return Object.entries(obj)
    .reduce((acc, [key, value]) => {
      if (value) {
        acc = `${acc} ${key}`;
      }
      return acc;
    }, baseClass)
    .trim();
};

export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 *
 * @param {array} array - array to reordering
 * @param {number} fromIndex - movable item index
 * @param {number} toIndex - index of the position where the element will be moved to
 * @returns {array} - reordered cloned array
 */
export const immutableMove = (
  array: any[],
  fromIndex: number,
  toIndex: number,
) => {
  const clonedArr = [...array];
  clonedArr.splice(toIndex, 0, clonedArr.splice(fromIndex, 1)[0]);
  return clonedArr;
};

export const setGlobalCSSVariable = (variableName: string, value: string) => {
  document.documentElement.style.setProperty(variableName, value);
};

export const formatDate = (ICOString: string) =>
  moment(ICOString).format('lll');

export const dateFormatter = (date: string) => {
  // month formate
  if (date.split('-').length === 3) return moment(date).format('MMM DD');
  // year formate
  if (date.split('-').length === 2) return moment(date).format('MMM');

  return date;
};

export const textToID = (string: string) => {
  return string.replaceAll(' ', '_').toUpperCase();
};

export const filterArrayOfObjects = (
  arr: KeyValueType[],
  uniqueProperty: string,
) => {
  return [
    ...new Map([...arr].map((item) => [item[uniqueProperty], item])).values(),
  ];
};

export const buildQueryParamsString = (params: KeyValueType) => {
  return Object.entries(params)
    .filter(([key, value]) => value)
    .reduce((acc, [key, value], index) => {
      return `${acc}${index ? '&' : '?'}${key}=${value}`;
    }, '');
};

export const debounce = (fn: Function, ms = 300) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
};

// export const memoize = (fn: Function) => {
//   const cache = new Map();
//   return (...args: any[]) => {
//     const stringifiedArgs = JSON.stringify(args);
//     const result = cache.has(stringifiedArgs) ? cache.get(stringifiedArgs) : fn(...args);
//     cache.set(stringifiedArgs, result);

//     return result;
//   }
// };