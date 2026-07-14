'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  FormControlLabel,
  Stack,
  Switch,
  Tab,
  Tabs,
  TextField,
  Typography
} from '@mui/material';
import { api } from '@/lib/api';
import { useLocationSearch } from '@/hooks/useLocationSearch';
import { useSubscriberProfileSession } from '@/hooks/useSubscriberProfileSession';
import type {
  SubscriberLoginRequest,
  SubscriberProfile,
  SubscriberProfileRequest,
  SubscriberRegistrationRequest,
} from '@/types/series';

const defaultProfile: SubscriberProfileRequest = {
  name: '',
  email: '',
  notifyNewSeries: true,
  notifyNewSeason: true,
};

const defaultRegistration: SubscriberRegistrationRequest & { confirmPassword: string } = {
  ...defaultProfile,
  password: '',
  confirmPassword: '',
};

const defaultLogin: SubscriberLoginRequest = {
  email: '',
  password: '',
};

type AuthMode = 'register' | 'login';

const SUBSCRIBER_PROFILE_KEY = 'series-subscriber-profile';

function toEditableProfile(profile: SubscriberProfile): SubscriberProfileRequest {
  return {
    name: profile.name,
    email: profile.email,
    notifyNewSeries: profile.notifyNewSeries,
    notifyNewSeason: profile.notifyNewSeason,
  };
}

function readStoredSubscriberProfile(): SubscriberProfile | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(SUBSCRIBER_PROFILE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as Partial<SubscriberProfile>;
    if (
      typeof parsed.id !== 'number' ||
      typeof parsed.name !== 'string' ||
      typeof parsed.email !== 'string' ||
      typeof parsed.notifyNewSeries !== 'boolean' ||
      typeof parsed.notifyNewSeason !== 'boolean'
    ) {
      return null;
    }

    return {
      id: parsed.id,
      name: parsed.name,
      email: parsed.email,
      notifyNewSeries: parsed.notifyNewSeries,
      notifyNewSeason: parsed.notifyNewSeason,
      activeNow: Boolean(parsed.activeNow),
      createdAt: typeof parsed.createdAt === 'string' ? parsed.createdAt : '',
      updatedAt: typeof parsed.updatedAt === 'string' ? parsed.updatedAt : '',
      lastSeenAt: typeof parsed.lastSeenAt === 'string' ? parsed.lastSeenAt : '',
    };
  } catch {
    return null;
  }
}

function storeSubscriberProfile(profile: SubscriberProfile | null) {
  if (typeof window === 'undefined') {
    return;
  }

  if (!profile) {
    window.localStorage.removeItem(SUBSCRIBER_PROFILE_KEY);
    return;
  }

  window.localStorage.setItem(SUBSCRIBER_PROFILE_KEY, JSON.stringify(profile));
}

type LocalizedText = {
  title: string;
  subtitle: string;
  register: string;
  login: string;
  cabinet: string;
  registerHint: string;
  loginHint: string;
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  notifyNewSeries: string;
  notifyNewSeason: string;
  registerButton: string;
  loginButton: string;
  save: string;
  logout: string;
  registered: string;
  loggedIn: string;
  saved: string;
  loadError: string;
  registerError: string;
  loginError: string;
  saveError: string;
  logoutError: string;
  invalidName: string;
  invalidEmail: string;
  passwordRuleLength: string;
  passwordRuleUppercase: string;
  passwordRuleLowercase: string;
  passwordRuleNumber: string;
  passwordRuleSpecial: string;
  passwordRuleSpaces: string;
  weakPassword: string;
  passwordMismatch: string;
  alreadyLoggedIn: string;
  loading: string;
  passwordChecklistTitle: string;
  accountExists: string;
  emailAlreadyUsed: string;
  invalidCredentials: string;
};

const NAME_PATTERN = /^[\p{L}][\p{L} .'-]{1,119}$/u;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function normalizeName(value: string) {
  return value.trim().replace(/\s+/g, ' ');
}

function hasUppercase(value: string) {
  return /[A-Z]/.test(value);
}

function hasLowercase(value: string) {
  return /[a-z]/.test(value);
}

function hasNumber(value: string) {
  return /\d/.test(value);
}

function hasSpecialCharacter(value: string) {
  return /[^A-Za-z\d]/.test(value);
}

function hasNoSpaces(value: string) {
  return !/\s/.test(value);
}

function getPasswordIssues(value: string, text: LocalizedText) {
  const issues: string[] = [];

  if (value.length < 8 || value.length > 72) {
    issues.push(text.passwordRuleLength);
  }
  if (!hasUppercase(value)) {
    issues.push(text.passwordRuleUppercase);
  }
  if (!hasLowercase(value)) {
    issues.push(text.passwordRuleLowercase);
  }
  if (!hasNumber(value)) {
    issues.push(text.passwordRuleNumber);
  }
  if (!hasSpecialCharacter(value)) {
    issues.push(text.passwordRuleSpecial);
  }
  if (!hasNoSpaces(value)) {
    issues.push(text.passwordRuleSpaces);
  }

  return issues;
}

function getStatusCode(error: unknown) {
  if (error && typeof error === 'object' && 'status' in error) {
    const status = (error as { status?: unknown }).status;
    if (typeof status === 'number') {
      return status;
    }
  }

  return undefined;
}

function resolveSubscriberError(
  error: unknown,
  fallback: string,
  text: LocalizedText,
  mode: 'register' | 'login' | 'profile' | 'logout' | 'load',
) {
  const rawMessage = error instanceof Error ? error.message.trim() : '';
  const status = getStatusCode(error);
  const normalizedMessage = rawMessage.toLowerCase();

  if (status === 409 || normalizedMessage === 'conflict' || normalizedMessage.includes('already exists')) {
    return mode === 'profile' ? text.emailAlreadyUsed : text.accountExists;
  }

  if (normalizedMessage.includes('already uses this email')) {
    return text.emailAlreadyUsed;
  }

  if (normalizedMessage.includes('invalid email or password') || status === 401 || rawMessage === 'Unauthorized') {
    return text.invalidCredentials;
  }

  if (rawMessage && rawMessage !== 'Conflict' && rawMessage !== 'Unauthorized' && rawMessage !== 'Bad Request') {
    return rawMessage;
  }

  return fallback;
}

export default function ProfilePage() {
  const search = useLocationSearch();
  const { subscriberToken, setSubscriberToken } = useSubscriberProfileSession();
  const cachedProfile = useMemo(() => readStoredSubscriberProfile(), []);
  const [authMode, setAuthMode] = useState<AuthMode>('register');
  const [profile, setProfile] = useState<SubscriberProfileRequest>(() => cachedProfile ? toEditableProfile(cachedProfile) : defaultProfile);
  const [registration, setRegistration] = useState(defaultRegistration);
  const [loginForm, setLoginForm] = useState(defaultLogin);
  const [currentProfile, setCurrentProfile] = useState<SubscriberProfile | null>(cachedProfile);
  const [statusMessage, setStatusMessage] = useState('');
  const [statusType, setStatusType] = useState<'success' | 'error'>('success');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const text = useMemo<LocalizedText>(() => (
    search.lang === 'en'
      ? {
          title: 'My account',
          subtitle: 'Create an account or sign in to manage your email notifications for new series and new seasons.',
          register: 'Register',
          login: 'Sign in',
          cabinet: 'My cabinet',
          registerHint: 'Create your account once and this device will remember you.',
          loginHint: 'Use the email and password you created during registration.',
          name: 'Name',
          email: 'Gmail or email',
          password: 'Password',
          confirmPassword: 'Repeat password',
          notifyNewSeries: 'Notify me about new series',
          notifyNewSeason: 'Notify me about new seasons',
          registerButton: 'Create account',
          loginButton: 'Sign in',
          save: 'Save changes',
          logout: 'Log out',
          registered: 'Account created. You are now signed in.',
          loggedIn: 'You are signed in.',
          saved: 'Profile saved. New notifications will use this email.',
          loadError: 'Failed to load your account.',
          registerError: 'Failed to create your account. Check the message below and try again.',
          loginError: 'Failed to sign in.',
          saveError: 'Failed to save your account.',
          logoutError: 'Failed to log out.',
          invalidName: 'Name must be 2 to 120 characters and contain only letters, spaces, apostrophes, dots, or hyphens.',
          invalidEmail: 'Enter a valid email address.',
          passwordRuleLength: '8 to 72 characters',
          passwordRuleUppercase: 'at least one uppercase letter',
          passwordRuleLowercase: 'at least one lowercase letter',
          passwordRuleNumber: 'at least one number',
          passwordRuleSpecial: 'at least one special character',
          passwordRuleSpaces: 'no spaces',
          weakPassword: 'Password is too weak. Fix these rules:',
          passwordMismatch: 'Passwords do not match.',
          alreadyLoggedIn: 'You are signed in and can edit your profile below.',
          loading: 'Loading...',
          passwordChecklistTitle: 'Password must include:',
          accountExists: 'An account with this email already exists. Try signing in or use another email.',
          emailAlreadyUsed: 'Another account already uses this email. Please choose a different address.',
          invalidCredentials: 'Incorrect email or password.',
        }
      : {
          title: 'Мій кабінет',
          subtitle: 'Створи акаунт або увійди, щоб керувати email-сповіщеннями про нові серіали та нові сезони.',
          register: 'Реєстрація',
          login: 'Вхід',
          cabinet: 'Мій кабінет',
          registerHint: 'Створи акаунт один раз, і сайт запам’ятає тебе на цьому пристрої.',
          loginHint: 'Використай email і пароль, які ти створила під час реєстрації.',
          name: 'Імʼя',
          email: 'Gmail або email',
          password: 'Пароль',
          confirmPassword: 'Повтори пароль',
          notifyNewSeries: 'Повідомляти про нові серіали',
          notifyNewSeason: 'Повідомляти про нові сезони',
          registerButton: 'Створити акаунт',
          loginButton: 'Увійти',
          save: 'Зберегти зміни',
          logout: 'Вийти',
          registered: 'Акаунт створено. Тепер ти вже увійшла.',
          loggedIn: 'Вхід успішний.',
          saved: 'Профіль збережено. Нові листи приходитимуть на цей email.',
          loadError: 'Не вдалося завантажити твій акаунт.',
          registerError: 'Не вдалося створити акаунт. Перевір повідомлення нижче і спробуй ще раз.',
          loginError: 'Не вдалося увійти.',
          saveError: 'Не вдалося зберегти акаунт.',
          logoutError: 'Не вдалося вийти.',
          invalidName: 'Імʼя має містити від 2 до 120 символів і лише літери, пробіли, апостроф, крапку або дефіс.',
          invalidEmail: 'Введи коректний email.',
          passwordRuleLength: 'від 8 до 72 символів',
          passwordRuleUppercase: 'хоча б одну велику літеру',
          passwordRuleLowercase: 'хоча б одну малу літеру',
          passwordRuleNumber: 'хоча б одну цифру',
          passwordRuleSpecial: 'хоча б один спеціальний символ',
          passwordRuleSpaces: 'без пробілів',
          weakPassword: 'Пароль не пройшов перевірку. Виправ ось що:',
          passwordMismatch: 'Паролі не збігаються.',
          alreadyLoggedIn: 'Ти вже увійшла і можеш редагувати свій профіль нижче.',
          loading: 'Завантаження...',
          passwordChecklistTitle: 'Пароль має містити:',
          accountExists: 'Акаунт з таким email уже існує. Спробуй увійти або використай інший email.',
          emailAlreadyUsed: 'Цей email уже використовується іншим акаунтом. Вкажи іншу адресу.',
          invalidCredentials: 'Невірний email або пароль.',
        }
  ), [search.lang]);

  useEffect(() => {
    if (!subscriberToken) {
      setCurrentProfile(null);
      return;
    }

    const load = async () => {
      try {
        setLoading(true);
        const response = await api.getSubscriberProfile(subscriberToken);
        setCurrentProfile(response);
        setProfile({
          name: response.name,
          email: response.email,
          notifyNewSeries: response.notifyNewSeries,
          notifyNewSeason: response.notifyNewSeason,
        });
      } catch (error) {
        setSubscriberToken(null);
        setCurrentProfile(null);
        setStatusType('error');
        setStatusMessage(resolveSubscriberError(error, text.loadError, text, 'load'));
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [subscriberToken, setSubscriberToken, text]);

  const validateName = (value: string) => {
    const normalized = normalizeName(value);
    return NAME_PATTERN.test(normalized);
  };

  const validateEmail = (value: string) => EMAIL_PATTERN.test(normalizeEmail(value));

  const validateProfileFields = (name: string, email: string) => {
    if (!validateName(name)) {
      return text.invalidName;
    }

    if (!validateEmail(email)) {
      return text.invalidEmail;
    }

    return null;
  };

  const validateRegistration = () => {
    const profileError = validateProfileFields(registration.name, registration.email);
    if (profileError) {
      return profileError;
    }

    const passwordIssues = getPasswordIssues(registration.password, text);
    if (passwordIssues.length) {
      return `${text.weakPassword} ${passwordIssues.join(' • ')}`;
    }

    if (registration.password !== registration.confirmPassword) {
      return text.passwordMismatch;
    }

    return null;
  };

  const submitRegistration = async (event: FormEvent) => {
    event.preventDefault();

    const validationMessage = validateRegistration();
    if (validationMessage) {
      setStatusType('error');
      setStatusMessage(validationMessage);
      return;
    }

    try {
      setSaving(true);
      setStatusMessage('');
      const session = await api.registerSubscriber({
        name: normalizeName(registration.name),
        email: normalizeEmail(registration.email),
        password: registration.password,
        notifyNewSeries: registration.notifyNewSeries,
        notifyNewSeason: registration.notifyNewSeason,
      });
      setSubscriberToken(session.authToken);
      setCurrentProfile(session.profile);
      setProfile({
        name: session.profile.name,
        email: session.profile.email,
        notifyNewSeries: session.profile.notifyNewSeries,
        notifyNewSeason: session.profile.notifyNewSeason,
      });
      setRegistration(defaultRegistration);
      setStatusType('success');
      setStatusMessage(text.registered);
    } catch (error) {
      setStatusType('error');
      setStatusMessage(resolveSubscriberError(error, text.registerError, text, 'register'));
    } finally {
      setSaving(false);
    }
  };

  const submitLogin = async (event: FormEvent) => {
    event.preventDefault();

    if (!validateEmail(loginForm.email)) {
      setStatusType('error');
      setStatusMessage(text.invalidEmail);
      return;
    }

    if (!loginForm.password.trim()) {
      setStatusType('error');
      setStatusMessage(text.invalidCredentials);
      return;
    }

    try {
      setSaving(true);
      setStatusMessage('');
      const session = await api.loginSubscriber({
        email: normalizeEmail(loginForm.email),
        password: loginForm.password,
      });
      setSubscriberToken(session.authToken);
      setCurrentProfile(session.profile);
      setProfile({
        name: session.profile.name,
        email: session.profile.email,
        notifyNewSeries: session.profile.notifyNewSeries,
        notifyNewSeason: session.profile.notifyNewSeason,
      });
      setLoginForm(defaultLogin);
      setStatusType('success');
      setStatusMessage(text.loggedIn);
    } catch (error) {
      setStatusType('error');
      setStatusMessage(resolveSubscriberError(error, text.loginError, text, 'login'));
    } finally {
      setSaving(false);
    }
  };

  const submitProfile = async (event: FormEvent) => {
    event.preventDefault();
    if (!subscriberToken) {
      return;
    }

    const validationMessage = validateProfileFields(profile.name, profile.email);
    if (validationMessage) {
      setStatusType('error');
      setStatusMessage(validationMessage);
      return;
    }

    try {
      setSaving(true);
      setStatusMessage('');
      const saved = await api.saveSubscriberProfile(subscriberToken, {
        ...profile,
        name: normalizeName(profile.name),
        email: normalizeEmail(profile.email),
      });
      setCurrentProfile(saved);
      setProfile({
        name: saved.name,
        email: saved.email,
        notifyNewSeries: saved.notifyNewSeries,
        notifyNewSeason: saved.notifyNewSeason,
      });
      setStatusType('success');
      setStatusMessage(text.saved);
    } catch (error) {
      setStatusType('error');
      setStatusMessage(resolveSubscriberError(error, text.saveError, text, 'profile'));
    } finally {
      setSaving(false);
    }
  };

  const logout = async () => {
    if (!subscriberToken) {
      return;
    }

    try {
      await api.logoutSubscriber(subscriberToken);
    } catch (error) {
      setStatusType('error');
      setStatusMessage(resolveSubscriberError(error, text.logoutError, text, 'logout'));
      return;
    }

    setSubscriberToken(null);
    setCurrentProfile(null);
    setProfile(defaultProfile);
    setStatusMessage('');
    setStatusType('success');
  };

  const passwordChecklist = [
    text.passwordRuleLength,
    text.passwordRuleUppercase,
    text.passwordRuleLowercase,
    text.passwordRuleNumber,
    text.passwordRuleSpecial,
    text.passwordRuleSpaces,
  ];

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Card
        sx={{
          borderRadius: 4,
          background: 'linear-gradient(180deg, rgba(239,247,255,0.96) 0%, rgba(223,236,252,0.93) 100%)',
          boxShadow: '0 28px 64px rgba(15, 23, 42, 0.18)',
          border: '1px solid rgba(91, 143, 220, 0.18)',
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Stack spacing={3}>
            <Box>
              <Typography variant="h3" fontWeight={800} sx={{ mb: 1 }}>
                {currentProfile ? text.cabinet : text.title}
              </Typography>
              <Typography color="text.secondary">
                {text.subtitle}
              </Typography>
            </Box>

            {!currentProfile ? (
              <>
                <Tabs value={authMode} onChange={(_, value: AuthMode) => setAuthMode(value)}>
                  <Tab value="register" label={text.register} />
                  <Tab value="login" label={text.login} />
                </Tabs>

                {authMode === 'register' ? (
                  <Box component="form" onSubmit={submitRegistration}>
                    <Stack spacing={2.5}>
                      <Typography color="text.secondary">{text.registerHint}</Typography>
                      <TextField
                        label={text.name}
                        value={registration.name}
                        onChange={(event) => setRegistration((current) => ({ ...current, name: event.target.value }))}
                        required
                        fullWidth
                      />
                      <TextField
                        label={text.email}
                        type="email"
                        value={registration.email}
                        onChange={(event) => setRegistration((current) => ({ ...current, email: event.target.value }))}
                        required
                        fullWidth
                      />
                      <TextField
                        label={text.password}
                        type="password"
                        value={registration.password}
                        onChange={(event) => setRegistration((current) => ({ ...current, password: event.target.value }))}
                        required
                        fullWidth
                      />
                      <TextField
                        label={text.confirmPassword}
                        type="password"
                        value={registration.confirmPassword}
                        onChange={(event) => setRegistration((current) => ({ ...current, confirmPassword: event.target.value }))}
                        required
                        fullWidth
                      />
                      <Alert severity="info">
                        <strong>{text.passwordChecklistTitle}</strong>
                        <br />{`• ${passwordChecklist.join(' • ')}`}
                      </Alert>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={registration.notifyNewSeries}
                            onChange={(event) => setRegistration((current) => ({ ...current, notifyNewSeries: event.target.checked }))}
                          />
                        }
                        label={text.notifyNewSeries}
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={registration.notifyNewSeason}
                            onChange={(event) => setRegistration((current) => ({ ...current, notifyNewSeason: event.target.checked }))}
                          />
                        }
                        label={text.notifyNewSeason}
                      />
                      {statusMessage && <Alert severity={statusType}>{statusMessage}</Alert>}
                      <Box>
                        <Button type="submit" variant="contained" disabled={saving}>
                          {text.registerButton}
                        </Button>
                      </Box>
                    </Stack>
                  </Box>
                ) : (
                  <Box component="form" onSubmit={submitLogin}>
                    <Stack spacing={2.5}>
                      <Typography color="text.secondary">{text.loginHint}</Typography>
                      <TextField
                        label={text.email}
                        type="email"
                        value={loginForm.email}
                        onChange={(event) => setLoginForm((current) => ({ ...current, email: event.target.value }))}
                        required
                        fullWidth
                      />
                      <TextField
                        label={text.password}
                        type="password"
                        value={loginForm.password}
                        onChange={(event) => setLoginForm((current) => ({ ...current, password: event.target.value }))}
                        required
                        fullWidth
                      />
                      {statusMessage && <Alert severity={statusType}>{statusMessage}</Alert>}
                      <Box>
                        <Button type="submit" variant="contained" disabled={saving}>
                          {text.loginButton}
                        </Button>
                      </Box>
                    </Stack>
                  </Box>
                )}
              </>
            ) : (
              <Box component="form" onSubmit={submitProfile}>
                <Stack spacing={2.5}>
                  <Alert severity="info">{text.alreadyLoggedIn}</Alert>
                  <TextField
                    label={text.name}
                    value={profile.name}
                    onChange={(event) => setProfile((current) => ({ ...current, name: event.target.value }))}
                    required
                    fullWidth
                  />
                  <TextField
                    label={text.email}
                    type="email"
                    value={profile.email}
                    onChange={(event) => setProfile((current) => ({ ...current, email: event.target.value }))}
                    required
                    fullWidth
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={profile.notifyNewSeries}
                        onChange={(event) => setProfile((current) => ({ ...current, notifyNewSeries: event.target.checked }))}
                      />
                    }
                    label={text.notifyNewSeries}
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={profile.notifyNewSeason}
                        onChange={(event) => setProfile((current) => ({ ...current, notifyNewSeason: event.target.checked }))}
                      />
                    }
                    label={text.notifyNewSeason}
                  />
                  {statusMessage && <Alert severity={statusType}>{statusMessage}</Alert>}
                  {loading && <Alert severity="info">{text.loading}</Alert>}
                  <Stack direction="row" spacing={2}>
                    <Button type="submit" variant="contained" disabled={saving}>
                      {text.save}
                    </Button>
                    <Button type="button" variant="outlined" color="inherit" onClick={logout}>
                      {text.logout}
                    </Button>
                  </Stack>
                </Stack>
              </Box>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
}



