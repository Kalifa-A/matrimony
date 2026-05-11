import createMiddleware from 'next-intl/middleware';
import {routing} from './navigation';

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except for
  // - … if they contain a dot, e.g. `favicon.ico`
  // - api routes
  // - _next (internal paths)
  // - static files (e.g. `public` folder)
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
