import en from './en.json';
import ua from './ua.json';
import { Language } from '@/constants/languages';

const messages = { ua, en };

export const getMessages = (lang: Language) => messages[lang] ?? messages.ua;
