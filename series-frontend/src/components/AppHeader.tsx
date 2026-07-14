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
import { DEVELOPER_PAGE, EMAIL_CONTROL_PAGE, HOME_PAGE, PROFILE_PAGE, SERIES_LIST, STATISTICS_PAGE, TOP_PAGE } from '@/constants/pages';
import { useLocationSearch } from '@/hooks/useLocationSearch';
import { useAdminMode } from '@/hooks/useAdminMode';
import { languages, type Language } from '@/constants/languages';
import { ADMIN_LOGIN, ADMIN_PASSWORD } from '@/constants/admin';

export default function AppHeader() {
  const router = useRouter();
  const search = useLocationSearch();
  const { isAdmin, adminUser, login, logout } = useAdminMode();
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  const text = useMemo(
    () =>
      search.lang === 'en'
        ? {
            home: 'Home',
            series: 'Series',
            top: 'Top 5',
            statistics: 'Statistics',
            profile: 'My profile',
            developer: 'Developer',
            emailControl: 'Email control',
            language: 'Language',
            admin: 'Admin',
            adminMode: 'Dev mode',
            loginTitle: 'Admin login',
            loginHint: 'Enter admin credentials to open developer tools and moderation pages.',
            loginField: 'Login',
            passwordField: 'Password',
            cancel: 'Cancel',
            signIn: 'Sign in',
            signOut: 'Logout',
            invalid: 'Invalid login or password',
          }
        : {
            home: '\u0413\u043e\u043b\u043e\u0432\u043d\u0430',
            series: '\u0421\u0435\u0440\u0456\u0430\u043b\u0438',
            top: '\u0422\u043e\u043f 5',
            statistics: '\u0421\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043a\u0430',
            profile: '\u041c\u0456\u0439 \u043a\u0430\u0431\u0456\u043d\u0435\u0442',
            developer: 'Developer',
            emailControl: '\u041a\u043e\u043d\u0442\u0440\u043e\u043b\u044c email',
            language: '\u041c\u043e\u0432\u0430',
            admin: '\u0410\u0434\u043c\u0456\u043d',
            adminMode: '\u0420\u0435\u0436\u0438\u043c \u0430\u0434\u043c\u0456\u043d\u0456\u0441\u0442\u0440\u0430\u0442\u043e\u0440\u0430',
            loginTitle: '\u0412\u0445\u0456\u0434 \u0434\u043b\u044f \u0430\u0434\u043c\u0456\u043d\u0456\u0441\u0442\u0440\u0430\u0442\u043e\u0440\u0430',
            loginHint: '\u0412\u0432\u0435\u0434\u0438 \u043b\u043e\u0433\u0456\u043d \u0456 \u043f\u0430\u0440\u043e\u043b\u044c, \u0449\u043e\u0431 \u0432\u0456\u0434\u043a\u0440\u0438\u0442\u0438 \u0456\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442\u0438 \u0440\u043e\u0437\u0440\u043e\u0431\u043d\u0438\u043a\u0430 \u0442\u0430 \u0441\u0442\u043e\u0440\u0456\u043d\u043a\u0438 \u043c\u043e\u0434\u0435\u0440\u0430\u0446\u0456\u0457.',
            loginField: '\u041b\u043e\u0433\u0456\u043d',
            passwordField: '\u041f\u0430\u0440\u043e\u043b\u044c',
            cancel: '\u0421\u043a\u0430\u0441\u0443\u0432\u0430\u0442\u0438',
            signIn: '\u0423\u0432\u0456\u0439\u0442\u0438',
            signOut: '\u0412\u0438\u0439\u0442\u0438',
            invalid: '\u041d\u0435\u043f\u0440\u0430\u0432\u0438\u043b\u044c\u043d\u0438\u0439 \u043b\u043e\u0433\u0456\u043d \u0430\u0431\u043e \u043f\u0430\u0440\u043e\u043b\u044c',
          },
    [search.lang],
  );

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

  const navButtonSx = {
    color: 'rgba(231,241,255,0.92)',
    borderRadius: 999,
    px: 1.6,
    '&:hover': {
      bgcolor: 'rgba(255,255,255,0.12)',
      color: '#ffffff',
    },
  } as const;

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: 'linear-gradient(135deg, #152848 0%, #23446f 54%, #17273d 100%)',
        color: '#ffffff',
        borderBottom: '1px solid rgba(255,255,255,0.12)',
        boxShadow: '0 16px 34px rgba(17, 34, 61, 0.32)',
        backdropFilter: 'blur(14px)',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ gap: 2, flexWrap: 'wrap', py: 1.25 }}>
          <Typography
            component={Link}
            href={withLang(HOME_PAGE)}
            variant="h6"
            sx={{ flexGrow: 1, fontWeight: 800, textDecoration: 'none', color: '#ffffff' }}
          >
            Series Analyzer
          </Typography>
          <Button component={Link} href={withLang(HOME_PAGE)} variant="text" sx={navButtonSx}>
            {text.home}
          </Button>
          <Button component={Link} href={withLang(SERIES_LIST)} variant="text" sx={navButtonSx}>
            {text.series}
          </Button>
          <Button component={Link} href={withLang(TOP_PAGE)} variant="text" sx={navButtonSx}>
            {text.top}
          </Button>
          <Button component={Link} href={withLang(STATISTICS_PAGE)} variant="text" sx={navButtonSx}>
            {text.statistics}
          </Button>
          <Button component={Link} href={withLang(PROFILE_PAGE)} variant="text" sx={navButtonSx}>
            {text.profile}
          </Button>
          {isAdmin && (
            <>
              <Button component={Link} href={withLang(DEVELOPER_PAGE)} variant="text" sx={navButtonSx}>
                {text.developer}
              </Button>
              <Button component={Link} href={withLang(EMAIL_CONTROL_PAGE)} variant="text" sx={navButtonSx}>
                {text.emailControl}
              </Button>
            </>
          )}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#ffffff' }}>
            <Typography variant="body2">{text.language}</Typography>
            <Select
              size="small"
              value={search.lang}
              onChange={(event) => changeLanguage(event.target.value as Language)}
              sx={{
                minWidth: 90,
                bgcolor: 'rgba(255,255,255,0.12)',
                color: '#ffffff',
                borderRadius: 3,
                '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.26)' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.52)' },
                '.MuiSvgIcon-root': { color: '#ffffff' },
              }}
            >
              {languages.map((lang) => (
                <MenuItem key={lang} value={lang}>
                  {lang.toUpperCase()}
                </MenuItem>
              ))}
            </Select>
          </Box>
          {isAdmin ? (
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip color="warning" variant="filled" label={`${text.adminMode}: ${adminUser || ADMIN_LOGIN}`} />
              <Button variant="outlined" onClick={logout} sx={{ color: '#ffffff', borderColor: 'rgba(255,255,255,0.42)' }}>
                {text.signOut}
              </Button>
            </Stack>
          ) : (
            <Button variant="outlined" onClick={() => setOpen(true)} sx={{ color: '#ffffff', borderColor: 'rgba(255,255,255,0.42)' }}>
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
          <Button type="submit" form="admin-login-form" variant="contained">
            {text.signIn}
          </Button>
        </DialogActions>
      </Dialog>
    </AppBar>
  );
}
