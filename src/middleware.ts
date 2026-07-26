import { defineMiddleware } from 'astro:middleware';
import { SITE } from './config/site';
import { createSupabaseServerClient } from './lib/supabase/server';
import { isSupabaseConfigured } from './lib/supabase/config';

const CANONICAL_HOST = new URL(SITE.url).hostname;

function isDevHost(host: string): boolean {
  return (
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host.endsWith('.local') ||
    host.endsWith('.pages.dev')
  );
}

export const onRequest = defineMiddleware(async (context, next) => {
  const requestUrl = new URL(context.request.url);
  const host = (context.request.headers.get('host') ?? requestUrl.hostname)
    .split(':')[0]
    .toLowerCase();
  const proto =
    context.request.headers.get('x-forwarded-proto') ??
    requestUrl.protocol.replace(':', '');

  if (!isDevHost(host) && (proto === 'http' || host === `www.${CANONICAL_HOST}`)) {
    const target = new URL(context.request.url);
    target.protocol = 'https:';
    target.hostname = CANONICAL_HOST;
    target.port = '';
    return Response.redirect(target.toString(), 301);
  }

  const { pathname } = context.url;

  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!isSupabaseConfigured()) {
      return context.redirect('/admin/login?setup=1');
    }

    try {
      const supabase = createSupabaseServerClient(context.cookies);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return context.redirect('/admin/login');
      }

      context.locals.user = user;
    } catch {
      return context.redirect('/admin/login');
    }
  }

  const response = await next();
  const contentType = response.headers.get('content-type');

  if (contentType?.startsWith('text/html') && !/charset=/i.test(contentType)) {
    const headers = new Headers(response.headers);
    headers.set('Content-Type', 'text/html; charset=utf-8');
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  }

  return response;
});
