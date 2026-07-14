export const config = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:9090/api/v1',
  reviewsApiBaseUrl: process.env.NEXT_PUBLIC_REVIEWS_API_BASE_URL || 'http://localhost:3010',
  emailApiBaseUrl: process.env.NEXT_PUBLIC_EMAIL_API_BASE_URL || 'http://localhost:3021',
  defaultLanguage: process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE || 'ua',
};
