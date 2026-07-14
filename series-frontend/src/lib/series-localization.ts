import type { Language } from '@/constants/languages';

type DictionaryEntry = {
  ua: string;
  en: string;
};

const titleDictionary: readonly DictionaryEntry[] = [
  { ua: 'Дуже дивні дива', en: 'Stranger Things' },
  { ua: 'Венздей', en: 'Wednesday' },
  { ua: 'Щоденники вампіра', en: 'The Vampire Diaries' },
  { ua: 'Первородні', en: 'The Originals' },
  { ua: 'Спадок', en: 'Legacies' },
  { ua: 'Агенти Щ.И.Т.', en: 'Agents of S.H.I.E.L.D.' },
  { ua: 'Хороший лікар', en: 'The Good Doctor' },
  { ua: 'Ключі Локів', en: 'Locke & Key' },
  { ua: 'Гра престолів', en: 'Game of Thrones' },
  { ua: 'Темрява', en: 'Dark' },
  { ua: 'Чорне дзеркало', en: 'Black Mirror' },
  { ua: 'Аркейн', en: 'Arcane' },
  { ua: 'Шерлок', en: 'Sherlock' },
  { ua: 'Останні з нас', en: 'The Last of Us' },
  { ua: 'Дім дракона', en: 'House of the Dragon' },
  { ua: 'Бріджертони', en: 'Bridgerton' },
  { ua: 'Гострі картузи', en: 'Peaky Blinders' },
  { ua: 'Корона', en: 'The Crown' },
  { ua: 'Розрив', en: 'Severance' },
  { ua: 'Ведмідь', en: 'The Bear' },
  { ua: 'Справжній детектив', en: 'True Detective' },
  { ua: 'Відьмак', en: 'The Witcher' },
  { ua: 'Звідти', en: 'From' },
  { ua: 'Сайло', en: 'Silo' },
  { ua: 'Ейфорія', en: 'Euphoria' },
  { ua: 'Озарк', en: 'Ozark' },
  { ua: 'Мисливець за розумом', en: 'Mindhunter' },
  { ua: 'Хлопаки', en: 'The Boys' },
  { ua: 'Чорнобиль', en: 'Chernobyl' },
  { ua: 'Світ Дикого Заходу', en: 'Westworld' },
  { ua: 'Фарґо', en: 'Fargo' },
  { ua: 'Містер Робот', en: 'Mr. Robot' },
  { ua: 'Краще подзвоніть Солу', en: 'Better Call Saul' },
  { ua: 'Локі', en: 'Loki' },
  { ua: 'ВандаВіжен', en: 'WandaVision' },
  { ua: 'Місячний лицар', en: 'Moon Knight' },
  { ua: 'Шибайголова', en: 'Daredevil' },
  { ua: 'Джессіка Джонс', en: 'Jessica Jones' },
  { ua: 'Соколине Око', en: 'Hawkeye' },
  { ua: 'Сокіл і Зимовий солдат', en: 'The Falcon and the Winter Soldier' },
  { ua: 'Міс Марвел', en: 'Ms. Marvel' },
] as const;

const genreDictionary: readonly DictionaryEntry[] = [
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
  { ua: 'Всесвіт Marvel', en: 'Marvel Universe' },
] as const;

function translateByDictionary(
  value: string,
  language: Language,
  dictionary: readonly DictionaryEntry[],
) {
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
