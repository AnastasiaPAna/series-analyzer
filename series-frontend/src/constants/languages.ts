export const ua = 'ua';
export const en = 'en';
export const languages = [ua, en] as const;
export type Language = (typeof languages)[number];

export const toIntlLocale = (language: Language) => language === ua ? 'uk' : 'en';
