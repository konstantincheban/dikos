type ClassMapObjectType = {
  [key: string]: boolean;
};
export const classMap = (obj: ClassMapObjectType, baseClass = '') => {
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
