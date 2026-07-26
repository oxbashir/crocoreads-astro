import { defineMiddleware } from 'astro:middleware';
import { createSupabaseServerClient } from './lib/supabase/server';

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
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

  return next();
});
