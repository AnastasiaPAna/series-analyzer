'use client';

import Link from 'next/link';
import { FormEvent, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Alert,
  AppBar,
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  Stack,
  TextField,
  Toolbar,
  Typography
} from '@mui/material';
import { HOME_PAGE, SERIES_LIST, STATISTICS_PAGE, TOP_PAGE } from '@/constants/pages';
import { useLocationSearch } from '@/hooks/useLocationSearch';
import { ADMIN_LOGIN, ADMIN_PASSWORD, getAdminReviewsServiceUrl, useAdminMode } from '@/hooks/useAdminMode';
import { languages, type Language } from '@/constants/languages';

export default function AppHeader() {
  const router = useRouter();
  const search = useLocationSearch();
  const { isAdmin, adminUser, login, logout } = useAdminMode();
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  const text = useMemo(() => (
    search.lang === 'en'
      ? {
          home: 'Home',
          series: 'Series',
          top: 'Top 5',
          statistics: 'Statistics',
          reviews: 'All reviews',
          language: 'Language',
          admin: 'Admin',
          adminMode: 'Admin mode',
          loginTitle: 'Admin login',
          loginHint: 'Enter admin credentials to open admin mode and access the reviews service.',
          loginField: 'Login',
          passwordField: 'Password',
          cancel: 'Cancel',
          signIn: 'Sign in',
          signOut: 'Logout',
          invalid: 'Invalid login or password',
        }
      : {
          home: 'Головна',
          series: 'Серіали',
          top: 'Топ 5',
          statistics: 'Статистика',
          reviews: 'Усі відгуки',
          language: 'Мова',
          admin: 'Адмін',
          adminMode: 'Режим розробника',
          loginTitle: 'Вхід адміністратора',
          loginHint: 'Введи логін і пароль, щоб увімкнути режим розробника та відкрити вкладку з усіма відгуками.',
          loginField: 'Логін',
          passwordField: 'Пароль',
          cancel: 'Скасувати',
          signIn: 'Увійти',
          signOut: 'Вийти',
          invalid: 'Невірний логін або пароль',
        }
  ), [search.lang]);

  const changeLanguage = (lang: Language) => {
    const params = new URLSearchParams(window.location.search);
    params.set('lang', lang);
    router.push(`${window.location.pathname}?${params.toString()}`);
  };

  const withLang = (path: string) => `${path}?lang=${search.lang}`;

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (username.trim() === ADMIN_LOGIN && password === ADMIN_PASSWORD) {
      login(username.trim());
      setOpen(false);
      setAuthError('');
      setUsername('');
      setPassword('');
      return;
    }

    setAuthError(text.invalid);
  };

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ gap: 2, flexWrap: 'wrap', py: 1 }}>
          <Typography component={Link} href={withLang(HOME_PAGE)} variant="h6" sx={{ flexGrow: 1, fontWeight: 700, textDecoration: 'none', color: 'inherit' }}>
            Series Analyzer
          </Typography>
          <Button component={Link} href={withLang(HOME_PAGE)} variant="text">
            {text.home}
          </Button>
          <Button component={Link} href={withLang(SERIES_LIST)} variant="text">
            {text.series}
          </Button>
          <Button component={Link} href={withLang(TOP_PAGE)} variant="text">
            {text.top}
          </Button>
          <Button component={Link} href={withLang(STATISTICS_PAGE)} variant="text">
            {text.statistics}
          </Button>
          {isAdmin && (
            // Reviews moderation was kept in the Node service, so this link
            // jumps there instead of opening another page inside Next.js.
            <Button component="a" href={getAdminReviewsServiceUrl(search.lang)} variant="text">
              {text.reviews}
            </Button>
          )}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2">{text.language}</Typography>
            <Select size="small" value={search.lang} onChange={(event) => changeLanguage(event.target.value as Language)}>
              {languages.map((lang) => <MenuItem key={lang} value={lang}>{lang.toUpperCase()}</MenuItem>)}
            </Select>
          </Box>
          {isAdmin ? (
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip color="warning" variant="outlined" label={`${text.adminMode}: ${adminUser || ADMIN_LOGIN}`} />
              <Button variant="outlined" color="inherit" onClick={logout}>
                {text.signOut}
              </Button>
            </Stack>
          ) : (
            <Button variant="outlined" color="inherit" onClick={() => setOpen(true)}>
              {text.admin}
            </Button>
          )}
        </Toolbar>
      </Container>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>{text.loginTitle}</DialogTitle>
        <DialogContent dividers>
          <Box component="form" id="admin-login-form" onSubmit={submit}>
            <Stack spacing={2}>
              <Typography color="text.secondary">{text.loginHint}</Typography>
              <TextField
                label={text.loginField}
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                autoFocus
                fullWidth
              />
              <TextField
                label={text.passwordField}
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                fullWidth
              />
              {authError && <Alert severity="error">{authError}</Alert>}
            </Stack>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>{text.cancel}</Button>
          <Button type="submit" form="admin-login-form" variant="contained">{text.signIn}</Button>
        </DialogActions>
      </Dialog>
    </AppBar>
  );
}
