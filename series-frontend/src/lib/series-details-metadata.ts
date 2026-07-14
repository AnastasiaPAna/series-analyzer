import type { Language } from '@/constants/languages';
import { localizeGenre } from '@/lib/series-localization';

type SeriesSpotlightInput = {
  title: string;
  genre: string;
  seasons: number;
  year: number;
  finished: boolean;
  studioName?: string;
  trailerUrl?: string | null;
};

type GenreMood = {
  uaMood: string;
  enMood: string;
  accent: string;
};

type SeriesSpotlight = {
  description: string;
  trailerEmbedUrl: string;
  trailerSearchUrl: string;
  trailerAvailable: boolean;
  accent: string;
};

const genreMoods: Record<string, GenreMood> = {
  'Science Fiction': {
    uaMood: 'Тут відчувається великий sci-fi масштаб, напруга невідомого і сильний атмосферний вайб.',
    enMood: 'It leans into big science-fiction scale, the tension of the unknown, and a strong atmospheric vibe.',
    accent: 'linear-gradient(135deg, rgba(25, 56, 96, 0.96) 0%, rgba(20, 112, 161, 0.92) 100%)',
  },
  Horror: {
    uaMood: 'Основний акцент тут на тривозі, темній атмосфері й відчутті, що щось піде не так будь-якої миті.',
    enMood: 'Its core energy comes from dread, dark atmosphere, and the feeling that something can go wrong at any moment.',
    accent: 'linear-gradient(135deg, rgba(95, 28, 38, 0.96) 0%, rgba(22, 20, 29, 0.96) 100%)',
  },
  Mystery: {
    uaMood: 'Сюжет тримається на таємницях, прихованих деталях і поступовому розкритті великої загадки.',
    enMood: 'The story is powered by secrets, hidden details, and the slow reveal of a bigger mystery.',
    accent: 'linear-gradient(135deg, rgba(53, 40, 83, 0.96) 0%, rgba(18, 24, 40, 0.96) 100%)',
  },
  Comedy: {
    uaMood: 'Навіть коли історія стає напруженою, тут лишаються легкість, іронія і хороший ритм.',
    enMood: 'Even when the story gets tense, it keeps a sense of lightness, irony, and strong pacing.',
    accent: 'linear-gradient(135deg, rgba(196, 115, 27, 0.96) 0%, rgba(70, 50, 26, 0.96) 100%)',
  },
  Fantasy: {
    uaMood: 'У центрі історії магія, міфологія і світ, у який легко зануритися надовго.',
    enMood: 'Its heart lies in magic, mythology, and a world that is easy to disappear into for hours.',
    accent: 'linear-gradient(135deg, rgba(85, 49, 128, 0.96) 0%, rgba(28, 29, 77, 0.96) 100%)',
  },
  Drama: {
    uaMood: 'Найсильніше тут працюють персонажі, емоції та внутрішні конфлікти героїв.',
    enMood: 'Its strongest element is the people: emotions, choices, and internal conflicts.',
    accent: 'linear-gradient(135deg, rgba(35, 72, 116, 0.96) 0%, rgba(23, 41, 72, 0.96) 100%)',
  },
  Detective: {
    uaMood: 'Це історія для тих, хто любить підказки, інтелектуальну гру та відчуття справжнього розслідування.',
    enMood: 'This is made for viewers who enjoy clues, intellectual play, and the feeling of an active investigation.',
    accent: 'linear-gradient(135deg, rgba(66, 79, 94, 0.96) 0%, rgba(24, 28, 35, 0.96) 100%)',
  },
  Crime: {
    uaMood: 'Серіал тримається на ризику, жорстких рішеннях і світі, де ціна помилки дуже висока.',
    enMood: 'It runs on risk, hard choices, and a world where mistakes carry a serious cost.',
    accent: 'linear-gradient(135deg, rgba(77, 48, 31, 0.96) 0%, rgba(25, 23, 27, 0.96) 100%)',
  },
  Thriller: {
    uaMood: 'Напруга зростає поступово, а ключова сила історії саме у відчутті небезпеки та невизначеності.',
    enMood: 'Its tension builds step by step, with danger and uncertainty doing most of the heavy lifting.',
    accent: 'linear-gradient(135deg, rgba(84, 39, 33, 0.96) 0%, rgba(18, 24, 34, 0.96) 100%)',
  },
  'Marvel Universe': {
    uaMood: 'Тут працює супергеройський драйв, велика всесвітня подія, технології та відчуття, що зараз буде справжній Marvel-момент.',
    enMood: 'This one runs on superhero momentum, big-universe stakes, high-tech flair, and that unmistakable Marvel-event energy.',
    accent: 'linear-gradient(135deg, rgba(119, 16, 24, 0.96) 0%, rgba(196, 33, 39, 0.94) 55%, rgba(32, 67, 137, 0.92) 100%)',
  },
};

function pickPrimaryGenre(genre: string) {
  return genre.split(',')[0].trim();
}

function splitTitleLines(title: string) {
  const words = title.split(' ');
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > 14 && current) {
      lines.push(current);
      current = word;
      continue;
    }
    current = next;
  }

  if (current) {
    lines.push(current);
  }

  return lines.slice(0, 4);
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function getUkrainianSeasonWord(seasons: number) {
  if (seasons === 1) {
    return 'сезон';
  }

  if (seasons >= 2 && seasons <= 4) {
    return 'сезони';
  }

  return 'сезонів';
}

export function extractYoutubeVideoId(rawUrl?: string | null) {
  if (!rawUrl) {
    return '';
  }

  try {
    const url = new URL(rawUrl.trim());
    const host = url.hostname.replace(/^www\./, '');

    if (host === 'youtu.be') {
      return url.pathname.replace(/^\//, '').split('/')[0];
    }

    if (host === 'youtube.com' || host === 'm.youtube.com') {
      if (url.pathname === '/watch') {
        return url.searchParams.get('v') || '';
      }

      if (url.pathname.startsWith('/embed/')) {
        return url.pathname.replace('/embed/', '').split('/')[0];
      }

      if (url.pathname.startsWith('/shorts/')) {
        return url.pathname.replace('/shorts/', '').split('/')[0];
      }
    }
  } catch {
    return '';
  }

  return '';
}

function buildYoutubeTrailerUrls(searchTitle: string, rawTrailerUrl?: string | null) {
  const directVideoId = extractYoutubeVideoId(rawTrailerUrl);
  const trailerQuery = `${searchTitle} official trailer`;
  const encodedQuery = encodeURIComponent(trailerQuery);

  if (directVideoId) {
    return {
      embedUrl: `https://www.youtube.com/embed/${directVideoId}?rel=0&modestbranding=1&playsinline=1`,
      searchUrl: rawTrailerUrl?.trim() || `https://www.youtube.com/watch?v=${directVideoId}`,
      available: true,
    };
  }

  return {
    embedUrl: '',
    searchUrl: `https://www.youtube.com/results?search_query=${encodedQuery}`,
    available: false,
  };
}

export function getSeriesSpotlight(
  input: SeriesSpotlightInput,
  canonicalEnglishTitle: string,
  language: Language,
): SeriesSpotlight {
  const primaryGenre = pickPrimaryGenre(input.genre);
  const mood = genreMoods[primaryGenre] || genreMoods.Drama;
  const localizedGenre = localizeGenre(input.genre, language);
  const searchTitle = canonicalEnglishTitle || input.title;
  const studioPhrase = input.studioName
    ? input.studioName
    : (language === 'en' ? 'an international studio' : 'міжнародною студією');
  const status = language === 'en'
    ? (input.finished ? 'already finished' : 'still ongoing')
    : (input.finished ? 'вже завершений' : 'ще триває');
  const trailerUrls = buildYoutubeTrailerUrls(searchTitle, input.trailerUrl);

  const description = language === 'en'
    ? `${searchTitle} is a ${localizedGenre.toLowerCase()} series released in ${input.year}. It currently has ${input.seasons} season${input.seasons === 1 ? '' : 's'}, is produced by ${studioPhrase}, and is ${status}. ${mood.enMood}`
    : `${input.title} — серіал у жанрі ${localizedGenre.toLowerCase()}, що вийшов у ${input.year} році. Зараз він має ${input.seasons} ${getUkrainianSeasonWord(input.seasons)}, створений ${studioPhrase} і ${status}. ${mood.uaMood}`;

  return {
    description,
    trailerEmbedUrl: trailerUrls.embedUrl,
    trailerSearchUrl: trailerUrls.searchUrl,
    trailerAvailable: trailerUrls.available,
    accent: mood.accent,
  };
}

export function getSeriesPosterDataUrl(
  input: Pick<SeriesSpotlightInput, 'title' | 'genre' | 'year'>,
  canonicalEnglishTitle: string,
  language: Language,
) {
  const primaryGenre = pickPrimaryGenre(input.genre);
  const mood = genreMoods[primaryGenre] || genreMoods.Drama;
  const lines = splitTitleLines(input.title);
  const localizedGenre = localizeGenre(input.genre, language);
  const printableTitle = canonicalEnglishTitle || input.title;
  const lineMarkup = lines
    .map((line, index) => `<text x="76" y="${250 + index * 98}" fill="#ffffff" font-size="74" font-weight="800" font-family="Arial, Helvetica, sans-serif">${escapeXml(line)}</text>`)
    .join('');
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#10223c" />
          <stop offset="100%" stop-color="#3d74a7" />
        </linearGradient>
        <linearGradient id="accent" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#ff7a18" stop-opacity="0.92" />
          <stop offset="100%" stop-color="#ff3f5e" stop-opacity="0.72" />
        </linearGradient>
      </defs>
      <rect width="800" height="1000" rx="46" fill="url(#bg)" />
      <rect width="800" height="1000" rx="46" fill="${escapeXml(mood.accent)}" opacity="0.88" />
      <circle cx="680" cy="170" r="150" fill="url(#accent)" opacity="0.55" />
      <circle cx="128" cy="860" r="170" fill="#61d1ff" opacity="0.18" />
      <rect x="54" y="54" width="692" height="892" rx="34" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.14)" />
      <text x="76" y="126" fill="rgba(255,255,255,0.7)" font-size="24" letter-spacing="7" font-weight="700" font-family="Arial, Helvetica, sans-serif">SERIES PICK</text>
      ${lineMarkup}
      <rect x="76" y="690" width="648" height="74" rx="24" fill="rgba(255,255,255,0.10)" stroke="rgba(255,255,255,0.16)" />
      <text x="108" y="737" fill="#eef6ff" font-size="28" font-weight="600" font-family="Arial, Helvetica, sans-serif">${escapeXml(localizedGenre)}</text>
      <text x="76" y="830" fill="#ffffff" font-size="30" font-weight="700" font-family="Arial, Helvetica, sans-serif">${escapeXml(printableTitle)}</text>
      <text x="76" y="880" fill="rgba(255,255,255,0.74)" font-size="26" font-family="Arial, Helvetica, sans-serif">${escapeXml(String(input.year))}</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}
