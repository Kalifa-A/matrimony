import {getRequestConfig} from 'next-intl/server';
import {routing} from '../navigation';

export default getRequestConfig(async ({requestLocale}) => {
  // For Next.js 15/16, the locale might be a promise
  const locale = await requestLocale;

  // Validate that the incoming `locale` parameter is valid
  if (!locale || !routing.locales.includes(locale as any)) {
    return {
      locale: routing.defaultLocale,
      messages: (await import(`../messages/${routing.defaultLocale}.json`)).default
    };
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
