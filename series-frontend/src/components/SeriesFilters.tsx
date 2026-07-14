'use client';

import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  FormControlLabel,
  Grid,
  MenuItem,
  Stack,
  Switch,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from '@mui/material';
import { useIntl } from 'react-intl';
import { GENRE_OPTIONS, GENRE_THEMES, MAX_SELECTED_GENRES, type GenreOption } from '@/constants/genres';
import { localizeGenre } from '@/lib/series-localization';
import type { LocationSearch } from '@/hooks/useLocationSearch';
import type { Studio } from '@/types/series';

const DEFAULT_PREVIEW_GENRE: GenreOption = 'Science Fiction';

function isGenreOption(value: string): value is GenreOption {
  return GENRE_OPTIONS.includes(value as GenreOption);
}

type GenreSoundEvent = {
  kind: 'tone' | 'sweep';
  startOffset: number;
  duration: number;
  volume: number;
  frequency?: number;
  from?: number;
  to?: number;
  type?: OscillatorType;
  attack?: number;
  release?: number;
  detune?: number;
  filter?: { type: BiquadFilterType; frequency: number; q?: number };
  vibrato?: { frequency: number; depth: number };
};

const GENRE_SOUND_PROFILES: Record<GenreOption, GenreSoundEvent[]> = {
  'Science Fiction': [
    { kind: 'tone', startOffset: 0, duration: 0.32, frequency: 392, volume: 0.028, type: 'triangle', vibrato: { frequency: 6, depth: 5 }, filter: { type: 'lowpass', frequency: 1900 } },
    { kind: 'tone', startOffset: 0.08, duration: 0.28, frequency: 523, volume: 0.024, type: 'sine', filter: { type: 'highpass', frequency: 180 } },
    { kind: 'sweep', startOffset: 0.18, duration: 0.42, from: 659, to: 900, volume: 0.02, type: 'triangle', filter: { type: 'bandpass', frequency: 1400, q: 2.4 } },
  ],
  Horror: [
    { kind: 'tone', startOffset: 0, duration: 0.65, frequency: 92, volume: 0.032, type: 'sawtooth', filter: { type: 'lowpass', frequency: 440, q: 1.2 } },
    { kind: 'sweep', startOffset: 0.1, duration: 0.48, from: 220, to: 146, volume: 0.022, type: 'triangle', filter: { type: 'bandpass', frequency: 520, q: 2.8 } },
    { kind: 'tone', startOffset: 0.34, duration: 0.22, frequency: 622, volume: 0.012, type: 'sine', filter: { type: 'highpass', frequency: 900 } },
  ],
  Mystery: [
    { kind: 'tone', startOffset: 0, duration: 0.28, frequency: 261, volume: 0.024, type: 'triangle', filter: { type: 'bandpass', frequency: 860, q: 1.8 } },
    { kind: 'tone', startOffset: 0.16, duration: 0.3, frequency: 311, volume: 0.02, type: 'triangle', filter: { type: 'bandpass', frequency: 920, q: 2.2 } },
    { kind: 'sweep', startOffset: 0.28, duration: 0.35, from: 349, to: 293, volume: 0.016, type: 'sine', vibrato: { frequency: 4, depth: 3 } },
  ],
  Comedy: [
    { kind: 'tone', startOffset: 0, duration: 0.16, frequency: 659, volume: 0.022, type: 'square' },
    { kind: 'tone', startOffset: 0.08, duration: 0.16, frequency: 784, volume: 0.024, type: 'square' },
    { kind: 'tone', startOffset: 0.18, duration: 0.2, frequency: 988, volume: 0.02, type: 'triangle' },
  ],
  Fantasy: [
    { kind: 'tone', startOffset: 0, duration: 0.42, frequency: 440, volume: 0.025, type: 'sine', vibrato: { frequency: 5, depth: 6 }, filter: { type: 'lowpass', frequency: 1600 } },
    { kind: 'tone', startOffset: 0.14, duration: 0.4, frequency: 554, volume: 0.02, type: 'sine' },
    { kind: 'tone', startOffset: 0.3, duration: 0.34, frequency: 659, volume: 0.018, type: 'triangle', filter: { type: 'highpass', frequency: 200 } },
  ],
  Drama: [
    { kind: 'tone', startOffset: 0, duration: 0.42, frequency: 293, volume: 0.024, type: 'sine', filter: { type: 'lowpass', frequency: 1100 } },
    { kind: 'tone', startOffset: 0.12, duration: 0.38, frequency: 392, volume: 0.019, type: 'triangle', filter: { type: 'bandpass', frequency: 760, q: 1.4 } },
  ],
  Romance: [
    { kind: 'tone', startOffset: 0, duration: 0.32, frequency: 349, volume: 0.024, type: 'sine', vibrato: { frequency: 5, depth: 4 } },
    { kind: 'tone', startOffset: 0.11, duration: 0.36, frequency: 440, volume: 0.022, type: 'sine' },
    { kind: 'tone', startOffset: 0.25, duration: 0.3, frequency: 523, volume: 0.018, type: 'triangle' },
  ],
  Adventure: [
    { kind: 'tone', startOffset: 0, duration: 0.22, frequency: 392, volume: 0.022, type: 'triangle' },
    { kind: 'tone', startOffset: 0.1, duration: 0.24, frequency: 494, volume: 0.024, type: 'triangle' },
    { kind: 'tone', startOffset: 0.22, duration: 0.3, frequency: 587, volume: 0.022, type: 'sawtooth', filter: { type: 'highpass', frequency: 180 } },
  ],
  Crime: [
    { kind: 'tone', startOffset: 0, duration: 0.44, frequency: 110, volume: 0.028, type: 'square', filter: { type: 'lowpass', frequency: 420 } },
    { kind: 'sweep', startOffset: 0.08, duration: 0.34, from: 220, to: 260, volume: 0.018, type: 'triangle' },
    { kind: 'sweep', startOffset: 0.42, duration: 0.34, from: 260, to: 220, volume: 0.018, type: 'triangle' },
  ],
  Thriller: [
    { kind: 'tone', startOffset: 0, duration: 0.18, frequency: 329, volume: 0.02, type: 'sawtooth' },
    { kind: 'tone', startOffset: 0.16, duration: 0.18, frequency: 415, volume: 0.02, type: 'sawtooth' },
    { kind: 'sweep', startOffset: 0.28, duration: 0.4, from: 311, to: 520, volume: 0.018, type: 'triangle', filter: { type: 'bandpass', frequency: 1200, q: 2 } },
  ],
  'Medical Drama': [
    { kind: 'tone', startOffset: 0, duration: 0.12, frequency: 78, volume: 0.028, type: 'sine', filter: { type: 'lowpass', frequency: 220 } },
    { kind: 'tone', startOffset: 0.15, duration: 0.14, frequency: 78, volume: 0.034, type: 'sine', filter: { type: 'lowpass', frequency: 240 } },
    { kind: 'tone', startOffset: 0.36, duration: 0.24, frequency: 523, volume: 0.016, type: 'triangle', filter: { type: 'highpass', frequency: 300 } },
  ],
  Supernatural: [
    { kind: 'tone', startOffset: 0, duration: 0.44, frequency: 246, volume: 0.022, type: 'triangle', vibrato: { frequency: 3, depth: 7 }, filter: { type: 'bandpass', frequency: 700, q: 2.4 } },
    { kind: 'sweep', startOffset: 0.16, duration: 0.4, from: 329, to: 246, volume: 0.016, type: 'sine', filter: { type: 'highpass', frequency: 280 } },
  ],
  'Political Drama': [
    { kind: 'tone', startOffset: 0, duration: 0.34, frequency: 196, volume: 0.024, type: 'square', filter: { type: 'lowpass', frequency: 600 } },
    { kind: 'tone', startOffset: 0.14, duration: 0.34, frequency: 261, volume: 0.018, type: 'triangle' },
    { kind: 'tone', startOffset: 0.26, duration: 0.3, frequency: 220, volume: 0.015, type: 'sine' },
  ],
  Detective: [
    { kind: 'tone', startOffset: 0, duration: 0.18, frequency: 329, volume: 0.02, type: 'triangle' },
    { kind: 'tone', startOffset: 0.12, duration: 0.22, frequency: 392, volume: 0.02, type: 'triangle' },
    { kind: 'tone', startOffset: 0.22, duration: 0.24, frequency: 349, volume: 0.016, type: 'sine', filter: { type: 'bandpass', frequency: 980, q: 2.6 } },
  ],
  'Teen Drama': [
    { kind: 'tone', startOffset: 0, duration: 0.16, frequency: 440, volume: 0.022, type: 'sine' },
    { kind: 'tone', startOffset: 0.09, duration: 0.18, frequency: 494, volume: 0.022, type: 'triangle' },
    { kind: 'tone', startOffset: 0.19, duration: 0.2, frequency: 554, volume: 0.018, type: 'triangle' },
  ],
  'Marvel Universe': [
    { kind: 'tone', startOffset: 0, duration: 0.2, frequency: 196, volume: 0.026, type: 'sawtooth', filter: { type: 'lowpass', frequency: 780 } },
    { kind: 'tone', startOffset: 0.12, duration: 0.22, frequency: 246, volume: 0.024, type: 'square', filter: { type: 'bandpass', frequency: 980, q: 1.4 } },
    { kind: 'tone', startOffset: 0.25, duration: 0.26, frequency: 329, volume: 0.022, type: 'sawtooth', filter: { type: 'highpass', frequency: 320 } },
  ],
};

export default function SeriesFilters({ search, studios, onApply, onClear }: {
  search: LocationSearch;
  studios: Studio[];
  onApply: (values: Pick<LocationSearch, 'genre' | 'year' | 'minRating' | 'studioId'>) => void;
  onClear: () => void;
}) {
  const intl = useIntl();
  const [selectedGenres, setSelectedGenres] = useState(
    search.genre
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean)
  );
  const [hoveredGenre, setHoveredGenre] = useState<GenreOption | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [year, setYear] = useState(search.year);
  const [minRating, setMinRating] = useState(search.minRating);
  const [studioId, setStudioId] = useState(search.studioId);
  const audioContextRef = useRef<AudioContext | null>(null);
  const soundCooldownRef = useRef<{ genre: GenreOption | null; time: number }>({ genre: null, time: 0 });

  useEffect(() => {
    setSelectedGenres(
      search.genre
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean)
    );
    setYear(search.year);
    setMinRating(search.minRating);
    setStudioId(search.studioId);
  }, [search.genre, search.minRating, search.studioId, search.year]);

  useEffect(() => () => {
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => undefined);
    }
  }, []);

  const genreOptions = useMemo(
    () => [...new Set([...GENRE_OPTIONS, ...selectedGenres.filter(isGenreOption)])],
    [selectedGenres]
  );

  const previewGenre = useMemo<GenreOption>(() => {
    if (hoveredGenre) {
      return hoveredGenre;
    }

    const firstSelected = selectedGenres.find(isGenreOption);
    return firstSelected || DEFAULT_PREVIEW_GENRE;
  }, [hoveredGenre, selectedGenres]);

  const activeTheme = GENRE_THEMES[previewGenre];

  const copy = search.lang === 'en'
    ? {
        sound: 'Genre sound',
        soundHint: 'Turn on cinematic hover sounds for the active genre.',
        previewLabel: 'Genre mood board',
        previewHint: 'Hover over a genre to recolor the panel and preview its cinema vibe.',
        particleLabel: 'Atmosphere',
      }
    : {
        sound: 'Звук жанру',
        soundHint: 'Увімкни короткі кінематографічні hover-звуки для активного жанру.',
        previewLabel: 'Настрій жанру',
        previewHint: 'Наведи на жанр, щоб панель змінила палітру і показала його кіношний вайб.',
        particleLabel: 'Атмосфера',
      };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    onApply({ genre: selectedGenres.join(', '), year, minRating, studioId });
  };

  const handleGenreChange = (_: unknown, values: string[]) => {
    if (values.length <= MAX_SELECTED_GENRES) {
      setSelectedGenres(values);
    }
  };

  const clampNumber = (value: string, min: number, max: number, setter: (next: string) => void) => {
    if (!value) {
      setter('');
      return;
    }

    const parsed = Number(value);
    if (Number.isNaN(parsed)) {
      return;
    }

    setter(String(Math.max(min, Math.min(max, parsed))));
  };

  const getAudioContext = () => {
    if (typeof window === 'undefined') {
      return null;
    }

    if (!audioContextRef.current) {
      const Context = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Context) {
        return null;
      }
      audioContextRef.current = new Context();
    }

    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume().catch(() => undefined);
    }

    return audioContextRef.current;
  };

  const playGenreSound = (genre: GenreOption) => {
    if (!soundEnabled) {
      return;
    }

    const now = Date.now();
    if (soundCooldownRef.current.genre === genre && now - soundCooldownRef.current.time < 760) {
      return;
    }
    soundCooldownRef.current = { genre, time: now };

    const context = getAudioContext();
    if (!context) {
      return;
    }

    const theme = GENRE_THEMES[genre];
    const events = GENRE_SOUND_PROFILES[genre];
    const startAt = context.currentTime + 0.03;
    const masterGain = context.createGain();
    const masterFilter = context.createBiquadFilter();

    masterFilter.type = 'lowpass';
    masterFilter.frequency.setValueAtTime(2600, startAt);
    masterGain.gain.setValueAtTime(0.72, startAt);

    masterFilter.connect(masterGain);
    masterGain.connect(context.destination);

    events.forEach((event) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const nodeChain: AudioNode[] = [oscillator];
      const eventStart = startAt + event.startOffset;
      const attack = event.attack ?? 0.025;
      const release = event.release ?? Math.min(0.18, event.duration * 0.45);
      const sustainUntil = Math.max(eventStart + attack, eventStart + event.duration - release);

      oscillator.type = event.type ?? theme.wave;

      if (event.kind === 'sweep') {
        oscillator.frequency.setValueAtTime(event.from ?? event.frequency ?? theme.notes[0], eventStart);
        oscillator.frequency.linearRampToValueAtTime(event.to ?? event.frequency ?? theme.notes[theme.notes.length - 1], eventStart + event.duration);
      } else {
        oscillator.frequency.setValueAtTime(event.frequency ?? theme.notes[0], eventStart);
      }

      if (event.detune) {
        oscillator.detune.setValueAtTime(event.detune, eventStart);
      }

      if (event.filter) {
        const filter = context.createBiquadFilter();
        filter.type = event.filter.type;
        filter.frequency.setValueAtTime(event.filter.frequency, eventStart);
        filter.Q.setValueAtTime(event.filter.q ?? 1, eventStart);
        nodeChain.push(filter);
      }

      if (event.vibrato) {
        const lfo = context.createOscillator();
        const lfoGain = context.createGain();
        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(event.vibrato.frequency, eventStart);
        lfoGain.gain.setValueAtTime(event.vibrato.depth, eventStart);
        lfo.connect(lfoGain);
        lfoGain.connect(oscillator.frequency);
        lfo.start(eventStart);
        lfo.stop(eventStart + event.duration + 0.04);
      }

      gain.gain.setValueAtTime(0.0001, eventStart);
      gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, event.volume), eventStart + attack);
      gain.gain.setValueAtTime(Math.max(0.0002, event.volume * 0.88), sustainUntil);
      gain.gain.exponentialRampToValueAtTime(0.0001, eventStart + event.duration);

      let previousNode: AudioNode = oscillator;
      nodeChain.slice(1).forEach((node) => {
        previousNode.connect(node);
        previousNode = node;
      });

      previousNode.connect(gain);
      gain.connect(masterFilter);

      oscillator.start(eventStart);
      oscillator.stop(eventStart + event.duration + 0.02);
    });
  };

  return (
    <Card
      sx={{
        mb: 3,
        position: 'relative',
        overflow: 'hidden',
        background: `linear-gradient(135deg, ${activeTheme.primary}38 0%, ${activeTheme.secondary}2f 46%, ${activeTheme.accent}24 100%)`,
        border: `1px solid ${activeTheme.secondary}38`,
        boxShadow: `0 26px 56px rgba(24, 46, 79, 0.18), 0 0 42px ${activeTheme.glow}`,
        backdropFilter: 'blur(12px)',
        transition: 'background 240ms ease, box-shadow 240ms ease, border-color 240ms ease',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at top right, ${activeTheme.accent}35, transparent 32%), radial-gradient(circle at bottom left, ${activeTheme.secondary}26, transparent 30%)`,
          pointerEvents: 'none',
        },
      }}
    >
      <CardContent component="form" onSubmit={submit} sx={{ position: 'relative', zIndex: 1 }}>
        <Stack spacing={2.5}>
          <Box>
            <Stack
              direction={{ xs: 'column', lg: 'row' }}
              spacing={2.5}
              justifyContent="space-between"
              alignItems={{ xs: 'flex-start', lg: 'stretch' }}
            >
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 900, fontSize: '1.05rem' }}>
                  {intl.formatMessage({ id: 'series.genre' })}
                </Typography>
                <ToggleButtonGroup
                  value={selectedGenres}
                  onChange={handleGenreChange}
                  sx={{ flexWrap: 'wrap', gap: 1 }}
                >
                  {genreOptions.map((genre) => {
                    const theme = GENRE_THEMES[genre];
                    return (
                      <ToggleButton
                        key={genre}
                        value={genre}
                        onMouseEnter={() => {
                          setHoveredGenre(genre);
                          playGenreSound(genre);
                        }}
                        onMouseLeave={() => setHoveredGenre((current) => (current === genre ? null : current))}
                        sx={{
                          '&&': {
                            borderRadius: 999,
                            px: 1.85,
                            py: 0.85,
                            textTransform: 'none',
                            color: '#203556',
                            cursor: 'pointer',
                            bgcolor: 'rgba(245,250,255,0.88)',
                            border: '1px solid rgba(24, 42, 71, 0.10)',
                            transition: 'all 0.24s ease',
                            boxShadow: '0 10px 20px rgba(24, 42, 71, 0.12)',
                            backdropFilter: 'blur(8px)',
                          },
                          '&&:hover': {
                            background: `linear-gradient(135deg, ${theme.secondary} 0%, ${theme.accent} 100%)`,
                            color: '#ffffff',
                            borderColor: '#ff6b57',
                            boxShadow: `0 0 0 1px rgba(255, 91, 87, 0.68), 0 18px 34px rgba(255, 91, 87, 0.30), 0 0 30px ${theme.glow}`,
                            transform: 'translateY(-3px) scale(1.05)',
                            textShadow: '0 0 16px rgba(255,255,255,0.22)',
                          },
                          '&&.Mui-selected': {
                            background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)`,
                            color: '#ffffff',
                            borderColor: theme.secondary,
                            boxShadow: `0 20px 36px ${theme.glow}, 0 0 0 1px rgba(255,255,255,0.10) inset`,
                          },
                          '&&.Mui-selected:hover': {
                            background: `linear-gradient(135deg, ${theme.secondary} 0%, ${theme.accent} 100%)`,
                            borderColor: '#ff6b57',
                          },
                        }}
                      >
                        {localizeGenre(genre, search.lang)}
                      </ToggleButton>
                    );
                  })}
                </ToggleButtonGroup>
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={1.5}
                  alignItems={{ xs: 'flex-start', sm: 'center' }}
                  justifyContent="space-between"
                  sx={{ mt: 1.25 }}
                >
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      {intl.formatMessage({ id: 'series.genre.limit' })}
                    </Typography>
                    <Typography variant="caption" sx={{ display: 'block', color: activeTheme.secondary, fontWeight: 800, mt: 0.35 }}>
                      {copy.previewHint}
                    </Typography>
                  </Box>
                  <FormControlLabel
                    control={<Switch checked={soundEnabled} onChange={(event) => setSoundEnabled(event.target.checked)} />}
                    label={
                      <Box>
                        <Typography variant="body2" fontWeight={700}>{copy.sound}</Typography>
                        <Typography variant="caption" color="text.secondary">{copy.soundHint}</Typography>
                      </Box>
                    }
                    sx={{ ml: 0 }}
                  />
                </Stack>
                {selectedGenres.length === MAX_SELECTED_GENRES && (
                  <Alert severity="info" sx={{ mt: 1.25 }}>
                    {intl.formatMessage({ id: 'series.genre.limitReached' })}
                  </Alert>
                )}
              </Box>

              <Box
                sx={{
                  width: { xs: '100%', lg: 360 },
                  minHeight: 210,
                  borderRadius: 4,
                  p: 2.5,
                  position: 'relative',
                  overflow: 'hidden',
                  color: activeTheme.ink,
                  background: `linear-gradient(145deg, ${activeTheme.primary} 0%, ${activeTheme.secondary} 54%, ${activeTheme.accent} 100%)`,
                  boxShadow: `0 20px 42px ${activeTheme.glow}`,
                  transition: 'background 240ms ease, box-shadow 240ms ease',
                  '@keyframes genreFloat': {
                    '0%': { transform: 'translateY(0px) rotate(0deg)', opacity: 0.45 },
                    '50%': { transform: 'translateY(-10px) rotate(4deg)', opacity: 1 },
                    '100%': { transform: 'translateY(0px) rotate(-4deg)', opacity: 0.55 },
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    width: 160,
                    height: 160,
                    borderRadius: '50%',
                    top: -46,
                    right: -28,
                    background: 'rgba(255,255,255,0.12)',
                    filter: 'blur(2px)',
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    bottom: -44,
                    left: -18,
                    background: 'rgba(255,255,255,0.10)',
                  },
                }}
              >
                {activeTheme.particles.map((particle, index) => (
                  <Typography
                    key={`${previewGenre}-${particle}-${index}`}
                    sx={{
                      position: 'absolute',
                      right: 18 + (index * 40),
                      top: 18 + ((index % 2) * 34),
                      fontSize: index === 0 ? '1.55rem' : '1.2rem',
                      opacity: 0.78,
                      animation: `genreFloat ${2.6 + (index * 0.35)}s ease-in-out infinite`,
                      animationDelay: `${index * 0.12}s`,
                    }}
                  >
                    {particle}
                  </Typography>
                ))}
                <Stack justifyContent="space-between" sx={{ height: '100%', position: 'relative', zIndex: 1 }}>
                  <Box>
                    <Typography variant="overline" sx={{ letterSpacing: 2.4, opacity: 0.84, fontWeight: 800 }}>
                      {copy.previewLabel}
                    </Typography>
                    <Typography variant="h5" fontWeight={900} sx={{ mt: 0.5, maxWidth: 220, lineHeight: 1.05 }}>
                      {search.lang === 'en' ? activeTheme.titleEn : activeTheme.titleUa}
                    </Typography>
                    <Typography sx={{ mt: 1.15, maxWidth: 260, opacity: 0.92 }}>
                      {search.lang === 'en' ? activeTheme.descriptionEn : activeTheme.descriptionUa}
                    </Typography>
                  </Box>

                  <Stack direction="row" justifyContent="space-between" alignItems="flex-end" spacing={2}>
                    <Box>
                      <Typography variant="caption" sx={{ opacity: 0.82 }}>{copy.particleLabel}</Typography>
                      <Typography fontWeight={800}>{localizeGenre(previewGenre, search.lang)}</Typography>
                    </Box>
                    <Box
                      sx={{
                        width: 86,
                        height: 110,
                        borderRadius: 3,
                        bgcolor: 'rgba(255,255,255,0.14)',
                        border: '1px solid rgba(255,255,255,0.22)',
                        boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.08)',
                        display: 'grid',
                        placeItems: 'center',
                        backdropFilter: 'blur(8px)',
                      }}
                    >
                      <Stack spacing={0.5} alignItems="center">
                        <Typography sx={{ fontSize: '2.1rem', lineHeight: 1 }}>{activeTheme.icon}</Typography>
                      </Stack>
                    </Box>
                  </Stack>
                </Stack>
              </Box>
            </Stack>
          </Box>

          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, sm: 3 }}>
              <TextField
                fullWidth
                type="number"
                label={intl.formatMessage({ id: 'series.year' })}
                value={year}
                inputProps={{ min: 1950, max: 2100 }}
                onChange={(e) => clampNumber(e.target.value, 1950, 2100, setYear)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <TextField
                fullWidth
                type="number"
                label={intl.formatMessage({ id: 'series.rating' })}
                value={minRating}
                inputProps={{ min: 0, max: 10, step: 0.1 }}
                onChange={(e) => clampNumber(e.target.value, 0, 10, setMinRating)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField fullWidth select label={intl.formatMessage({ id: 'series.studio' })} value={studioId} onChange={(e) => setStudioId(e.target.value)}>
                <MenuItem value="">-</MenuItem>
                {studios.map((studio) => <MenuItem key={studio.id} value={studio.id}>{studio.name}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 2 }} sx={{ display: 'flex', gap: 1 }}>
              <Button type="submit" variant="contained">{intl.formatMessage({ id: 'series.filter' })}</Button>
              <Button variant="outlined" onClick={onClear}>{intl.formatMessage({ id: 'series.clear' })}</Button>
            </Grid>
          </Grid>
        </Stack>
      </CardContent>
    </Card>
  );
}







