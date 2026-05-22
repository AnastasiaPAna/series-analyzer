'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AppBar, Box, Button, Container, MenuItem, Select, Toolbar, Typography } from '@mui/material';
import { useIntl } from 'react-intl';
import { HOME_PAGE, SERIES_LIST, STATISTICS_PAGE, TOP_PAGE } from '@/constants/pages';
import { useLocationSearch } from '@/hooks/useLocationSearch';
import { languages, type Language } from '@/constants/languages';

export default function AppHeader() {
  const intl = useIntl();
  const router = useRouter();
  const search = useLocationSearch();

  const changeLanguage = (lang: Language) => {
    const params = new URLSearchParams(window.location.search);
    params.set('lang', lang);
    router.push(`${window.location.pathname}?${params.toString()}`);
  };

  const withLang = (path: string) => `${path}?lang=${search.lang}`;

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ gap: 2 }}>
          <Typography component={Link} href={withLang(HOME_PAGE)} variant="h6" sx={{ flexGrow: 1, fontWeight: 700, textDecoration: 'none', color: 'inherit' }}>
            {intl.formatMessage({ id: 'app.title' })}
          </Typography>
          <Button component={Link} href={withLang(HOME_PAGE)} variant="text">
            {intl.formatMessage({ id: 'nav.home' })}
          </Button>
          <Button component={Link} href={withLang(SERIES_LIST)} variant="text">
            {intl.formatMessage({ id: 'nav.series' })}
          </Button>
          <Button component={Link} href={withLang(TOP_PAGE)} variant="text">
            {intl.formatMessage({ id: 'nav.top' })}
          </Button>
          <Button component={Link} href={withLang(STATISTICS_PAGE)} variant="text">
            {intl.formatMessage({ id: 'nav.statistics' })}
          </Button>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2">{intl.formatMessage({ id: 'nav.language' })}</Typography>
            <Select size="small" value={search.lang} onChange={(event) => changeLanguage(event.target.value as Language)}>
              {languages.map((lang) => <MenuItem key={lang} value={lang}>{lang.toUpperCase()}</MenuItem>)}
            </Select>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
