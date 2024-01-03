const replacements = [
  // Ukrainian
  ['Є', 'Ye'],
  ['І', 'I'],
  ['Ї', 'Yi'],
  ['Ґ', 'G'],
  ['є', 'ye'],
  ['і', 'i'],
  ['ї', 'yi'],
  ['ґ', 'g'],

  // russian
  ['А', 'A'],
  ['а', 'a'],
  ['Б', 'B'],
  ['б', 'b'],
  ['В', 'V'],
  ['в', 'v'],
  ['Г', 'G'],
  ['г', 'g'],
  ['Д', 'D'],
  ['д', 'd'],
  ['ъе', 'ye'],
  ['Ъе', 'Ye'],
  ['ъЕ', 'yE'],
  ['ЪЕ', 'YE'],
  ['Е', 'E'],
  ['е', 'e'],
  ['Ё', 'Yo'],
  ['ё', 'yo'],
  ['Ж', 'Zh'],
  ['ж', 'zh'],
  ['З', 'Z'],
  ['з', 'z'],
  ['И', 'I'],
  ['и', 'i'],
  ['ый', 'iy'],
  ['Ый', 'Iy'],
  ['ЫЙ', 'IY'],
  ['ыЙ', 'iY'],
  ['Й', 'Y'],
  ['й', 'y'],
  ['К', 'K'],
  ['к', 'k'],
  ['Л', 'L'],
  ['л', 'l'],
  ['М', 'M'],
  ['м', 'm'],
  ['Н', 'N'],
  ['н', 'n'],
  ['О', 'O'],
  ['о', 'o'],
  ['П', 'P'],
  ['п', 'p'],
  ['Р', 'R'],
  ['р', 'r'],
  ['С', 'S'],
  ['с', 's'],
  ['Т', 'T'],
  ['т', 't'],
  ['У', 'U'],
  ['у', 'u'],
  ['Ф', 'F'],
  ['ф', 'f'],
  ['Х', 'Kh'],
  ['х', 'kh'],
  ['Ц', 'Ts'],
  ['ц', 'ts'],
  ['Ч', 'Ch'],
  ['ч', 'ch'],
  ['Ш', 'Sh'],
  ['ш', 'sh'],
  ['Щ', 'Sch'],
  ['щ', 'sch'],
  ['Ъ', ''],
  ['ъ', ''],
  ['Ы', 'Y'],
  ['ы', 'y'],
  ['Ь', ''],
  ['ь', ''],
  ['Э', 'E'],
  ['э', 'e'],
  ['Ю', 'Yu'],
  ['ю', 'yu'],
  ['Я', 'Ya'],
  ['я', 'ya'],
];

const doCustomReplacements = (string, replacements) => {
  for (const [key, value] of replacements) {
    string = string.replace(new RegExp(key, 'g'), value);
  }

  return string;
};

export default function transliterate(
  string,
  options = { customReplacements: [] },
) {
  if (typeof string !== 'string') {
    throw new TypeError(`Expected a string, got \`${typeof string}\``);
  }

  options = {
    customReplacements: [],
    ...options,
  };

  const customReplacements = new Map([
    ...replacements,
    ...options.customReplacements,
  ]);

  string = string.normalize();
  string = doCustomReplacements(string, customReplacements);
  string = string
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .normalize();

  return string;
}
