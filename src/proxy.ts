import { auth } from '@/auth';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const handleI18nRouting = createMiddleware(routing);

export default auth((req) => {
    return handleI18nRouting(req);
});

export const config = {
    matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
