import type { Language } from '@/constants/languages';

const titleDictionary = [
  { ua: 'Дуже дивні дива', en: 'Stranger Things' },
  { ua: 'Венздей', en: 'Wednesday' },
  { ua: 'Щоденники вампіра', en: 'The Vampire Diaries' },
  { ua: 'Первородні', en: 'The Originals' },
  { ua: 'Спадок', en: 'Legacies' },
  { ua: 'Щит', en: 'S.H.I.E.L.D.' },
  { ua: 'Хороший лікар', en: 'The Good Doctor' },
  { ua: 'Ключі Локів', en: 'Locke & Key' },
  { ua: 'Гра престолів', en: 'Game of Thrones' },
];

const genreDictionary = [
  { ua: 'Наукова фантастика', en: 'Science Fiction' },
  { ua: 'Горор', en: 'Horror' },
  { ua: 'Містика', en: 'Mystery' },
  { ua: 'Комедія', en: 'Comedy' },
  { ua: 'Фентезі', en: 'Fantasy' },
  { ua: 'Драма', en: 'Drama' },
  { ua: 'Романтика', en: 'Romance' },
  { ua: 'Пригоди', en: 'Adventure' },
  { ua: 'Кримінал', en: 'Crime' },
  { ua: 'Трилер', en: 'Thriller' },
  { ua: 'Медична драма', en: 'Medical Drama' },
  { ua: 'Надприродне', en: 'Supernatural' },
  { ua: 'Політична драма', en: 'Political Drama' },
  { ua: 'Детектив', en: 'Detective' },
  { ua: 'Підліткова драма', en: 'Teen Drama' },
];

function translateByDictionary(value: string, language: Language, dictionary: Array<{ ua: string; en: string }>) {
  const trimmed = value.trim();
  const hit = dictionary.find((item) => item.ua === trimmed || item.en === trimmed);

  if (!hit) {
    return trimmed;
  }

  return language === 'en' ? hit.en : hit.ua;
}

export function localizeSeriesTitle(title: string, language: Language) {
  return translateByDictionary(title, language, titleDictionary);
}

export function localizeGenre(genre: string, language: Language) {
  return genre
    .split(',')
    .map((part) => translateByDictionary(part, language, genreDictionary))
    .join(', ');
}
