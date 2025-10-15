import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;

  // Ensure that a valid locale is used
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  // Explicitly import all messages to work with Turbopack
  const messagesModule = {
    en: () => import('@/messages/en.json'),
    zh: () => import('@/messages/zh.json'),
    ja: () => import('@/messages/ja.json'),
    es: () => import('@/messages/es.json'),
    pt: () => import('@/messages/pt.json'),
    ko: () => import('@/messages/ko.json'),
  };

  const messages = (await messagesModule[locale as keyof typeof messagesModule]()).default;

  return {
    locale,
    messages,
  };
});

